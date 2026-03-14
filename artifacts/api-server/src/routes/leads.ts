import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/leads", async (req, res) => {
  try {
    const { role, service, location, plan, name, email, phone } = req.body;
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

    res.json({ id: lead.id });
  } catch (err) {
    console.error("[leads] Error creating lead:", err);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

router.patch("/leads/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid lead id" });
      return;
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    const allowed = ["status", "name", "email", "phone", "message", "stripeSessionId"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const [lead] = await db.update(leadsTable)
      .set(updates)
      .where(eq(leadsTable.id, id))
      .returning();

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    res.json(lead);
  } catch (err) {
    console.error("[leads] Error updating lead:", err);
    res.status(500).json({ error: "Failed to update lead" });
  }
});

export default router;
