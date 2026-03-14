import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { leadsTable } from "./leads";

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leadsTable.id),
  plan: text("plan").notNull(),
  amountCents: integer("amount_cents").notNull(),
  stripeSessionId: text("stripe_session_id").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  customerEmail: text("customer_email"),
  paidAt: timestamp("paid_at").defaultNow().notNull(),
});

export type Payment = typeof paymentsTable.$inferSelect;
