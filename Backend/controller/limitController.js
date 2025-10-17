// controllers/limitController.js
import { limitModel } from "../model/limitModel.js";
import { transactionModel } from "../model/transactionModel.js";
import { getCurrentMonthYear, isLastDayOfMonth, getMonthStartEnd } from "../utils/dateUtils.js";
import mongoose from "mongoose";

export const createLimit = async (req, res) => {
  try {
    const { category, limitAmount } = req.body;
    const userId = req.user._id;

    if (!category || !limitAmount) {
      return res.status(400).json({ message: "Category and amount are required" });
    }

    const allowed = ["Grocery", "Restaurant", "Travel", "Shopping"];
    if (!allowed.includes(category)) {
      return res.status(400).json({ message: "Invalid Category" });
    }

    if (isLastDayOfMonth()) {
      return res.status(400).json({ message: "Cannot set limit on the last day of the month" });
    }

    const monthYear = getCurrentMonthYear();

    const existing = await limitModel.findOne({
      user: userId,
      category,
      monthYear,
      status: "active",
    });

    if (existing) {
      return res.status(400).json({ message: "Active limit already exists for this category" });
    }

    const limit = await limitModel.create({
      user: userId,
      category,
      limitAmount,
      monthYear,
    });

    console.log(`✅ Limit created: user=${userId} category=${category} limit=${limitAmount} createdAt=${limit.createdAt.toISOString()}`);

    return res.status(201).json({ data: limit, message: "Limit added successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "A limit for this category already exists this month." });
    }
    console.error("❌ createLimit error:", err);
    return res.status(500).json({ message: "Something went wrong while adding your limit. Please try again." });
  }
};

export const getLimits = async (req, res) => {
  try {
    const userId = req.user._id;
    const monthYear = getCurrentMonthYear();
    const { end } = getMonthStartEnd();

    const limits = await limitModel.find({ user: userId, monthYear }).lean();

    const results = await Promise.all(
      limits.map(async (l) => {
        // Use createdAt for "after-limit" matching so new limit starts at 0
        const limitCreatedAt = new Date(l.createdAt);

        const spentAgg = await transactionModel.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(userId),
              category: l.category,
              transactionType: "Expense",
              createdAt: { $gte: limitCreatedAt, $lte: end },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const spent = spentAgg[0]?.total || 0;
        const percent = (spent / l.limitAmount) * 100;
        return { ...l, spent, percent };
      })
    );

    console.log("📊 getLimits results:", results.map(r => ({ cat: r.category, spent: r.spent, percent: r.percent, limit: r.limitAmount })));

    return res.status(200).json({ results });
  } catch (err) {
    console.error("❌ getLimits error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
