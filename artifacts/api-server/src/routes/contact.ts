import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { sendLeadNotification } from "../lib/email";

const router = Router();

router.post("/contact", async (req, res) => {
  try {
    const { leadId, name, businessName, email, phone, message } = req.body;
    if (!leadId || !name || !email) {
      res.status(400).json({ error: "Missing required fields: leadId, name, email" });
      return;
    }

    const msgParts = [];
    if (businessName) msgParts.push(`Business: ${businessName}`);
    if (message) msgParts.push(message);
    const fullMessage = msgParts.join("\n") || null;

    const [lead] = await db.update(leadsTable)
      .set({
        name,
        email,
        phone: phone || null,
        message: fullMessage,
        status: "submitted",
        updatedAt: new Date(),
      })
      .where(eq(leadsTable.id, parseInt(String(leadId), 10)))
      .returning();

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    await sendLeadNotification(lead);

    res.json({ success: true });
  } catch (err) {
    console.error("[contact] Error submitting contact:", err);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
});

export default router;
