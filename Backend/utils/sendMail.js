import { Resend } from "resend";
import { userModel } from "../model/userModel.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendLimitAlert = async (userId, category, limit, spent, level) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) return;

    const subject =
      level === 90
        ? `⚠️ Your ${category} limit is 90% used`
        : `🚨 Your ${category} limit has been exceeded!`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <p>Hi ${user.name || "User"},</p>
        <p>Your <strong>${category}</strong> limit of <strong>₹${limit}</strong> is now 
        ${level === 90 ? "90% used" : "exceeded"}.</p>
        <p>Current spent: ₹${spent}</p>
        <p>Keep an eye on your expenses — visit <b>Xpense Tracker</b> to review your spending.</p>
        <br>
        <p style="color:#888;">— Xpense Tracker</p>
      </div>
    `;

    const response = await resend.emails.send({
      from: "Xpense Tracker <no-reply@xpensetracker.dev>", // use a sender domain
      to: user.email,
      subject,
      html,
    });

    if (response.error) {
      console.error("❌ Email sending failed:", response.error.message);
    } else {
      console.log(`📧 Email sent to ${user.email}: ${subject}`);
    }
  } catch (error) {
    console.error("❌ sendLimitAlert error:", error.message);
  }
};
