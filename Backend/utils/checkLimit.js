// utils/checkLimit.js
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

    if (!limit) {
      // no active limit for this category
      return;
    }

    const { end } = getMonthStartEnd();

    // IMPORTANT: Use createdAt timestamps for "after-limit" matching.
    // Only count transactions that were created after the limit was created.
    const limitCreatedAt = new Date(limit.createdAt);

    console.log(`🕒 checkLimit: user=${userId}, category=${category}, limitCreatedAt=${limitCreatedAt.toISOString()}, monthEnd=${end.toISOString()}`);

    const agg = await transactionModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          transactionType: "Expense",
          category,
          // Only transactions created after the limit creation moment and before month end
          createdAt: { $gte: limitCreatedAt, $lte: end },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const spent = agg[0]?.total || 0;
    const percent = Math.round((spent / limit.limitAmount) * 100);

    console.log(`🧮 limit check result: category=${category} spent=${spent} limit=${limit.limitAmount} percent=${percent}`);

    let sendMail90 = false;
    let sendMail100 = false;

    if (percent >= 90 && !limit.notified90) {
      limit.notified90 = true;
      sendMail90 = true;
    }

    if (percent >= 99.5 && !limit.notified100) {
      limit.notified100 = true;
      limit.status = "completed";
      limit.completedAt = new Date();
      sendMail100 = true;
    }

    await limit.save();

    if (sendMail90) {
      sendLimitAlert(userId, category, limit.limitAmount, spent, 90).catch((err) =>
        console.error("❌ 90% alert failed:", err)
      );
    }

    if (sendMail100) {
      sendLimitAlert(userId, category, limit.limitAmount, spent, 100).catch((err) =>
        console.error("❌ 100% alert failed:", err)
      );
    }
  } catch (err) {
    console.error("❌ checkLimit error:", err);
  }
};