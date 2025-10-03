
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        transactionType: {
            type: String,
            enum: ["Balance", "Expense"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            enum: ["Grocery", "Restaurant", "Travel", "Shopping", "Bills", "Others"],
            required: function(){
                return this.transactionType === "Expense";
            }
        },
        description: {
            type: String,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        }
    },
    {timestamps: true}
);

// Index for faster filtering by user + date + category
transactionSchema.index({ user: 1, date: -1, category: 1 });

export const transactionModel = mongoose.model("transaction", transactionSchema);