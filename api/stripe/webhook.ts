import Stripe from "stripe";
import { Resend } from "resend";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import type { IncomingMessage } from "http";

const { Pool } = pkg;

export const config = { api: { bodyParser: false } };

const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  role: text("role"),
  service: text("service"),
  location: text("location"),
  plan: text("plan").notNull(),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  message: text("message"),
  status: text("status").notNull().default("started"),
  stripeSessionId: text("stripe_session_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  plan: text("plan").notNull(),
  amountCents: integer("amount_cents").notNull(),
  monthlyAmountCents: integer("monthly_amount_cents"),
  stripeSessionId: text("stripe_session_id").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  customerEmail: text("customer_email"),
  paidAt: timestamp("paid_at").defaultNow().notNull(),
});

const PLAN_MONTHLY: Record<string, number> = {
  essential: 14900,
  growth: 24900,
  premium: 34900,
};

function getDb() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return drizzle(pool);
}

async function getRawBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function sendNotification(lead: {
  role: string | null;
  service: string | null;
  location: string | null;
  plan: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status: string;
}) {
  const notifyEmail = process.env.NOTIFY_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  if (!notifyEmail || !resendKey) return;

  const resend = new Resend(resendKey);
  const subject = `New payment received — ${lead.plan} plan`;
  const body = [
    `Status: ${lead.status.toUpperCase()}`,
    `Plan: ${lead.plan}`,
    `Role: ${lead.role}`,
    `Service: ${lead.service}`,
    `Location: ${lead.location}`,
    lead.name ? `Name: ${lead.name}` : null,
    lead.email ? `Email: ${lead.email}` : null,
    lead.phone ? `Phone: ${lead.phone}` : null,
  ].filter(Boolean).join("\n");

  await resend.emails.send({
    from: "GreyWhale <onboarding@resend.dev>",
    to: notifyEmail,
    subject,
    text: body,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    res.status(503).json({ error: "Stripe not configured" });
    return;
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    res.status(400).json({ error: "Missing stripe-signature header" });
    return;
  }

  let event: Stripe.Event;
  try {
    const rawBody = await getRawBody(req as IncomingMessage);
    const stripe = new Stripe(stripeKey);
    event = stripe.webhooks.constructEvent(rawBody, sig as string, webhookSecret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    res.status(400).json({ error: "Webhook signature verification failed" });
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const leadId = session.metadata?.leadId ? parseInt(session.metadata.leadId, 10) : null;

    if (leadId) {
      try {
        const db = getDb();
        const [lead] = await db.update(leadsTable)
          .set({ status: "paid", updatedAt: new Date() })
          .where(eq(leadsTable.id, leadId))
          .returning();

        if (lead) {
          const monthlyAmount = PLAN_MONTHLY[lead.plan] ?? 0;
          await db.insert(paymentsTable).values({
            leadId,
            plan: lead.plan,
            amountCents: monthlyAmount,
            monthlyAmountCents: monthlyAmount,
            stripeSessionId: session.id,
            stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
            stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : null,
            customerEmail: session.customer_details?.email ?? lead.email ?? null,
          });
          await sendNotification(lead).catch(console.error);
          console.log(`[webhook] lead id=${leadId} marked paid`);
        }
      } catch (err) {
        console.error("[webhook] db error:", err);
      }
    }
  }

  res.json({ received: true });
}
