
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        photo: {
            type: String,
        }
    },
    {timestamps: true}
);

export const userModel = mongoose.model("user", userSchema);