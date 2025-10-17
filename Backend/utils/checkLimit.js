import { limitModel } from "../model/limitModel.js";
import { transactionModel } from "../model/transactionModel.js";
import { sendLimitAlert } from "./sendMail.js";
import { getMonthStartEnd, getCurrentMonthYear } from "./dateUtils.js";
import mongoose from "mongoose";

export const checkLimit = async(userId, category) => {
    const monthYear = getCurrentMonthYear();
    const limit =  await limitModel.findOne({
        user: userId,
        category: category,
        monthYear,
        status: "active"
    });
    if(!limit) return;

    const { end } = getMonthStartEnd();

    const agg = await transactionModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
                transactionType: "Expense",
                category,
                date: { $gte: limit.createdAt, $lte: end }
            }
        },
        {
            $group: { _id: null, total: { $sum: "$amount" } }
        }
    ]);

    const spent = agg[0]?.total || 0;
    const percent = (spent / limit.limitAmount) * 100;

    if(percent >= 90 && !limit.notified90){
        await sendLimitAlert(userId, category, limit.limitAmount, spent, 90);
        limit.notified90 = true;
    }

    if(percent >= 100 && !limit.notified100){
        await sendLimitAlert(userId, category, limit.limitAmount, spent, 100);
        limit.notified100 = true;
        limit.status = "completed";
    }

    await limit.save();
}