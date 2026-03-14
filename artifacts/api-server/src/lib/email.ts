import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendLeadNotification(lead: {
  role: string;
  service: string;
  location: string;
  plan: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  status: string;
}) {
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (!notifyEmail) {
    console.log("[email] NOTIFY_EMAIL not set, skipping notification");
    return;
  }

  const resend = getResend();
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set, skipping notification");
    return;
  }

  const subject = lead.status === "paid"
    ? `New payment received — ${lead.plan} plan`
    : `New contact inquiry — ${lead.plan}`;

  const body = [
    `Status: ${lead.status.toUpperCase()}`,
    `Plan: ${lead.plan}`,
    `Role: ${lead.role}`,
    `Service: ${lead.service}`,
    `Location: ${lead.location}`,
    lead.name ? `Name: ${lead.name}` : null,
    lead.email ? `Email: ${lead.email}` : null,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.message ? `Message: ${lead.message}` : null,
  ].filter(Boolean).join("\n");

  try {
    await resend.emails.send({
      from: "GreyWhale <onboarding@resend.dev>",
      to: notifyEmail,
      subject,
      text: body,
    });
    console.log(`[email] Notification sent to ${notifyEmail}`);
  } catch (err) {
    console.error("[email] Failed to send notification:", err);
  }
}
