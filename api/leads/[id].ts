import type { VercelRequest, VercelResponse } from "@vercel/node";
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

function getDb() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return drizzle(pool);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  if (req.method !== "PATCH") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const leadId = parseInt(req.query.id as string, 10);
  if (isNaN(leadId)) {
    res.status(400).json({ error: "Invalid lead id" });
    return;
  }

  try {
    const db = getDb();
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    const allowed = ["status", "name", "email", "phone", "message", "stripeSessionId"];
    for (const key of allowed) {
      if (req.body?.[key] !== undefined) updates[key] = req.body[key];
    }

    const [lead] = await db.update(leadsTable)
      .set(updates)
      .where(eq(leadsTable.id, leadId))
      .returning();

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    console.log(`[leads] updated lead id=${leadId}`);
    res.json(lead);
  } catch (err) {
    console.error(`[leads] error updating lead ${leadId}:`, err);
    res.status(500).json({ error: "Failed to update lead" });
  }
}
