import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/leads", async (req, res) => {
  const id = req.requestId;
  console.log(`[${id}] [leads] POST /leads — creating lead with plan="${req.body.plan}"`);
  try {
    const { role, service, location, plan, name, email, phone } = req.body;
    if (!plan) {
      console.warn(`[${id}] [leads] missing plan field`);
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

    console.log(`[${id}] [leads] created lead id=${lead.id} plan=${plan}`);
    res.json({ id: lead.id });
  } catch (err) {
    console.error(`[${id}] [leads] error creating lead:`, err);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

router.patch("/leads/:id", async (req, res) => {
  const id = req.requestId;
  const leadId = parseInt(req.params.id, 10);
  console.log(`[${id}] [leads] PATCH /leads/${req.params.id}`);
  try {
    if (isNaN(leadId)) {
      console.warn(`[${id}] [leads] invalid lead id "${req.params.id}"`);
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

    console.log(`[${id}] [leads] applying updates:`, JSON.stringify(updates));

    const [lead] = await db.update(leadsTable)
      .set(updates)
      .where(eq(leadsTable.id, leadId))
      .returning();

    if (!lead) {
      console.warn(`[${id}] [leads] lead id=${leadId} not found`);
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    console.log(`[${id}] [leads] updated lead id=${leadId}`);
    res.json(lead);
  } catch (err) {
    console.error(`[${id}] [leads] error updating lead ${leadId}:`, err);
    res.status(500).json({ error: "Failed to update lead" });
  }
});

export default router;
