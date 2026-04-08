import { Resend } from "resend";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, phone, message } = req.body ?? {};

  if (!name || !email || !message) {
    res.status(400).json({ error: "Missing required fields: name, email, message" });
    return;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!resendKey || !notifyEmail) {
    console.error("[contact] RESEND_API_KEY or NOTIFY_EMAIL not set");
    res.status(500).json({ error: "Email service not configured" });
    return;
  }

  try {
    const resend = new Resend(resendKey);
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Message: ${message}`,
    ].filter(Boolean).join("\n");

    await resend.emails.send({
      from: "GreyWhale <onboarding@resend.dev>",
      to: notifyEmail,
      subject: `New message from ${name}`,
      text: body,
    });

    console.log(`[contact] notification sent for ${email}`);
    res.json({ success: true });
  } catch (err) {
    console.error("[contact] failed to send email:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
}
