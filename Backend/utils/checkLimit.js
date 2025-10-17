import { limitModel } from "../model/limitModel.js";
import { transactionModel } from "../model/transactionModel.js";
import { sendLimitAlert } from "./sendMail.js";
import { getMonthStartEnd, getCurrentMonthYear } from "./dateUtils.js";
import mongoose from "mongoose";

export const checkLimit = async (userId, category) => {
  try {
    const monthYear = getCurrentMonthYear();
    const limit = await limitModel.findOne({
      user: userId,
      category,
      monthYear,
      status: "active",
    });

    if (!limit) return;

    const { end } = getMonthStartEnd();

    const limitStart = new Date(limit.createdAt);

    const agg = await transactionModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          transactionType: "Expense",
          category,
          date: { $gte: limitStart, $lte: end },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const spent = agg[0]?.total || 0;
    const percent = Math.round((spent / limit.limitAmount) * 100);

    let sendMail90 = false;
    let sendMail100 = false;

    if (percent >= 90 && !limit.notified90) {
      limit.notified90 = true;
      sendMail90 = true; // mark for later async email
    }

    if (percent >= 99.5 && !limit.notified100) {
      limit.notified100 = true;
      limit.status = "completed";
      limit.completedAt = new Date();
      sendMail100 = true; // mark for later async email
    }

    await limit.save(); // update DB first

    if (sendMail90) {
      sendLimitAlert(userId, category, limit.limitAmount, spent, 90).catch((err) =>
        console.error("90% alert failed:", err)
      );
    }

    if (sendMail100) {
      sendLimitAlert(userId, category, limit.limitAmount, spent, 100).catch((err) =>
        console.error("100% alert failed:", err)
      );
    }

  } catch (err) {
    console.error("❌ Error during limit check:", err);
  }
};