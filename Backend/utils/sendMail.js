import nodemailer from "nodemailer";
import { userModel } from "../model/userModel.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify Gmail connection once on startup
transporter.verify((error) => {
  if (error) console.error("SMTP verification failed:", error.message);
});

export const sendLimitAlert = async (userId, category, limit, spent, level) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) return;

    const subject =
      level === 90
        ? `⚠️ Your ${category} limit is 90% used`
        : `🚨 Your ${category} limit has been exceeded!`;

    const html = `
      <p>Hi ${user.name || "User"},</p>
      <p>Your <strong>${category}</strong> limit of ₹${limit} is now ${
      level === 90 ? "90% used" : "exceeded"
    }.</p>
      <p>Current spent: ₹${spent}</p>
      <p>Keep an eye on your expenses — visit Xpense Tracker to review your spending.</p>
      <br>
      <p>— Xpense Tracker</p>
    `;

    // try sending the email once, retry if temporary failure
    try {
      await transporter.sendMail({
        from: `"Xpense Tracker" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject,
        html,
      });
    } catch (err) {
      // Retry once if Gmail timed out or connection dropped
      if (["ETIMEDOUT", "ECONNECTION", "ECONNRESET"].includes(err.code)) {
        await transporter.sendMail({
          from: `"Xpense Tracker" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject,
          html,
        });
      } else {
        throw err;
      }
    }
  } catch {
    
  }
};