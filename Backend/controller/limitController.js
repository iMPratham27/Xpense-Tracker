import { limitModel } from "../model/limitModel.js";
import { transactionModel } from "../model/transactionModel.js";
import { getCurrentMonthYear, isLastDayOfMonth, getMonthStartEnd } from "../utils/dateUtils.js";
import mongoose from "mongoose";

export const createLimit = async(req, res) => {
    try{
        const { category, limitAmount } = req.body;
        const userId = req.user._id;

        if(!category || !limitAmount){
            return res.status(400).json({message: "Category and amount are required"});
        }

        const allowed = ["Grocery", "Restaurant", "Travel", "Shopping"];

        if(!allowed.includes(category)){
            return res.status(400).json({message: "Invalid Category"});
        }

        if(isLastDayOfMonth()){
            return res.status(400).json({message: "Cannot set limit on the last day of the month"});
        }

        const monthYear = getCurrentMonthYear();
        const existing = await limitModel.findOne({
            user: userId,
            category,
            monthYear,
        });

        if(existing && existing.status == "active"){
            return res.status(400).json({message: "Active limit already exists for this category"});
        }

        const limit = await limitModel.create({
            user: userId,
            category,
            limitAmount,
            monthYear
        });

        return res.status(201).json({
            data: limit,
            message: "Limit added successfully"
        });

    }catch(err){
        return res.status(500).json({message: "Internal server error"});
    }
}

export const getLimits = async(req, res) => {
    try{
        const userId = req.user._id;
        const monthYear = getCurrentMonthYear();
        const { end } = getMonthStartEnd();

        const limits = await limitModel.find({
            user: userId,
            monthYear
        }).lean();

        const results = await Promise.all(
            limits.map( async(l) => {

                const limitStart = new Date(l.createdAt);
                limitStart.setUTCHours(0, 0, 0, 0);

                const spentAgg = await transactionModel.aggregate([
                    {
                        $match: {
                            user: new mongoose.Types.ObjectId(userId),
                            category: l.category,
                            transactionType: "Expense",
                            date: {$gte: new Date(limitStart), $lte: end}
                        },
                    },
                    {
                        $group: {_id: null, total: { $sum: "$amount" }}
                    }
                ]);

                const spent = spentAgg[0]?.total || 0;
                const percent = (spent / l.limitAmount) * 100;
                return { ...l, spent, percent };
            })
        );

        return res.status(200).json({results});

    }catch(err){
        return res.status(500).json({message: "Internal Server Error"});
    }
}