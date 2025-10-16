import mongoose from "mongoose";

const limitSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        category: {
            type: String,
            enum: ["Grocery", "Restaurant", "Travel", "Shopping"],
            required: true,
        },
        limitAmount: {
            type: Number,
            required: true,
            min: 1,
        },
        monthYear: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "completed"],
            default:"active",
        },
        notified90: {
            type: Boolean,
            default: false,
        },
        notified100: {
            type: Boolean,
            default: false, 
        },
    },
    {timestamps: true}
);

limitSchema.index({user: 1, category: 1, monthYear: 1},{unique: true});

export const limitModel = mongoose.model("limit", limitSchema);