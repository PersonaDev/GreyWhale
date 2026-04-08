import Stripe from "stripe";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

const { Pool } = pkg;

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

function getDb() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return drizzle(pool);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    res.status(503).json({ error: "Stripe not configured" });
    return;
  }

  try {
    const stripe = new Stripe(stripeKey);
    const db = getDb();
    const { leadId, plan, successUrl, cancelUrl, customerEmail } = req.body ?? {};

    if (!leadId || !plan || !successUrl || !cancelUrl) {
      res.status(400).json({ error: "Missing required fields: leadId, plan, successUrl, cancelUrl" });
      return;
    }

    const monthlyAmount = PLAN_MONTHLY[plan];
    if (!monthlyAmount) {
      res.status(400).json({ error: `Invalid plan: ${plan}` });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: PLAN_NAMES[plan],
            description: "Monthly subscription — hosting, support & maintenance",
          },
          unit_amount: monthlyAmount,
          recurring: { interval: "month" },
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail || undefined,
      metadata: { leadId: String(leadId) },
    });

    console.log(`[stripe] created session id=${session.id} plan=${plan}`);

    await db.update(leadsTable)
      .set({ stripeSessionId: session.id, updatedAt: new Date() })
      .where(eq(leadsTable.id, leadId));

    res.json({ url: session.url });
  } catch (err) {
    console.error("[stripe] error creating checkout session:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
