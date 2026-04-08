import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

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

  try {
    const db = getDb();
    const { role, service, location, plan, name, email, phone } = req.body ?? {};
    if (!plan) {
      res.status(400).json({ error: "Missing required field: plan" });
      return;
    }

    const [lead] = await db.insert(leadsTable).values({
      plan,
      status: "started",
      ...(role && { role }),
      ...(service && { service }),
      ...(location && { location }),
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
    }).returning();

    console.log(`[leads] created lead id=${lead.id} plan=${plan}`);
    res.json({ id: lead.id });
  } catch (err) {
    console.error("[leads] error creating lead:", err);
    res.status(500).json({ error: "Failed to create lead" });
  }
}
