const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

function getTransport() {
  const host = process.env.SMTP_HOST;
  if (!host || typeof host !== "string" || !host.trim()) {
    return null;
  }
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  return nodemailer.createTransport({
    host: host.trim(),
    port,
    secure,
    auth: user ? { user: user.trim(), pass: pass || "" } : undefined,
  });
}

/**
 * @param {{ to: string; resetUrl: string }} params
 */
async function sendPasswordResetEmail({ to, resetUrl }) {
  const from = (process.env.SMTP_FROM || "TradePilot <noreply@localhost>").trim();
  const subject = "Reset your TradePilot password";
  const text = `Hi,

We received a request to reset your TradePilot password. Open this link (valid for 1 hour):

${resetUrl}

If you did not request a reset, you can ignore this email.

— TradePilot`;

  const transport = getTransport();
  if (!transport) {
    logger.warn(
      `[password-reset] SMTP not configured (set SMTP_HOST in .env). Reset link for ${to}: ${resetUrl}`
    );
    return { sent: false };
  }

  await transport.sendMail({
    from,
    to,
    subject,
    text,
  });
  logger.info({ message: "Password reset email sent", to });
  return { sent: true };
}

module.exports = { sendPasswordResetEmail, getTransport };
