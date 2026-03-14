import { Router } from "express";
import Stripe from "stripe";
import { db } from "@workspace/db";
import { leadsTable, paymentsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { sendLeadNotification } from "../lib/email";

const router = Router();

const PLAN_MONTHLY: Record<string, number> = {
  essential: 14900,
  growth: 24900,
  premium: 34900,
};

const PLAN_NAMES: Record<string, string> = {
  essential: "Essential Plan",
  growth: "Growth Plan",
  premium: "Premium Plan",
};

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

router.post("/stripe/checkout", async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      res.status(503).json({ error: "Stripe is not configured. Please add STRIPE_SECRET_KEY." });
      return;
    }

    const { leadId, plan, successUrl, cancelUrl, customerEmail } = req.body;
    if (!leadId || !plan || !successUrl || !cancelUrl) {
      res.status(400).json({ error: "Missing required fields: leadId, plan, successUrl, cancelUrl" });
      return;
    }

    const monthlyAmount = PLAN_MONTHLY[plan];
    if (!monthlyAmount) {
      res.status(400).json({ error: `Invalid plan: ${plan}` });
      return;
    }

    const planLabel = PLAN_NAMES[plan] || plan;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planLabel,
              description: `Monthly subscription — hosting, support & maintenance`,
            },
            unit_amount: monthlyAmount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail || undefined,
      metadata: { leadId: String(leadId) },
    });

    await db.update(leadsTable)
      .set({ stripeSessionId: session.id, updatedAt: new Date() })
      .where(eq(leadsTable.id, leadId));

    res.json({ url: session.url });
  } catch (err) {
    console.error("[stripe] Error creating checkout session:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

router.post("/stripe/webhook", async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      res.status(503).json({ error: "Stripe not configured" });
      return;
    }

    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[stripe] STRIPE_WEBHOOK_SECRET not set — rejecting webhook for security");
      res.status(503).json({ error: "Webhook secret not configured" });
      return;
    }

    if (!sig) {
      res.status(400).json({ error: "Missing stripe-signature header" });
      return;
    }

    let event: Stripe.Event;
    try {
      const rawBody = req.rawBody;
      event = stripe.webhooks.constructEvent(rawBody || JSON.stringify(req.body), sig as string, webhookSecret);
    } catch (err) {
      console.error("[stripe] Webhook signature verification failed:", err);
      res.status(400).json({ error: "Webhook signature verification failed" });
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const leadId = session.metadata?.leadId ? parseInt(session.metadata.leadId, 10) : null;

      if (leadId) {
        const [lead] = await db.update(leadsTable)
          .set({ status: "paid", updatedAt: new Date() })
          .where(eq(leadsTable.id, leadId))
          .returning();

        if (lead) {
          const monthlyAmount = PLAN_MONTHLY[lead.plan] ?? 0;

          const paymentIntentId = typeof session.payment_intent === "string"
            ? session.payment_intent
            : null;
          const subscriptionId = typeof session.subscription === "string"
            ? session.subscription
            : null;

          await db.insert(paymentsTable).values({
            leadId,
            plan: lead.plan,
            amountCents: monthlyAmount,
            monthlyAmountCents: monthlyAmount,
            stripeSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
            stripeSubscriptionId: subscriptionId,
            customerEmail: session.customer_details?.email ?? lead.email ?? null,
          });

          await sendLeadNotification(lead);
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("[stripe] Webhook error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default router;
