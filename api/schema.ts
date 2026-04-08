import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const leadsTable = pgTable("leads", {
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
