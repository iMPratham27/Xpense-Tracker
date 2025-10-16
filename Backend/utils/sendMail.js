import nodemailer from "nodemailer";
import { userModel } from "../model/userModel.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

export const sendLimitAlert = async(userId, category, limit, spent, level) => {
    const user = await userModel.findById(userId);
    if(!user) return;

    const subject = level === 90 ? `⚠️ Your ${category} limit is 90% used` : `🚨 Your ${category} limit has been exceeded!`;

    const html = `
        <p>Hi ${user.name || "User"}, </p>
        <p>Your<strong> ${category} </strong>limit of ₹${limit} is now ${level === 90 ? "90% used" : "exceeded"}.</p>
        <p>Current spent: ₹${spent}</p>
        <p>Keep an eye on your expenses — visit Xpense Tracker to review your spending.</p>
        <br>
        <p> — Xpense Tracker</p>
    `;

    await transporter.sendMail({
        from: `"Xpense Tracker" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject,
        html,
    });
} 