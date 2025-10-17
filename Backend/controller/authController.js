import axios from "axios";
import { oauth2client } from "../utils/googleConfig.js";
import { userModel } from "../model/userModel.js";
import jwt from "jsonwebtoken";

export const googleLogin = async(req, res) => {

    const { code } = req.query;

    try{
        // backend exchanges authorization code for tokens(access token)
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);

        // fetch user profile from access token
        const userResult = await axios.get(
            "https://openidconnect.googleapis.com/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${googleRes.tokens.access_token}`,
                },
            }   
        );

        const { email, name, picture } = userResult.data;

        let user = await userModel.findOne({email});
        if(!user){
            user = await userModel.create({ name, email, photo: picture })
        }

        // create JWT and add id in the payload
        const token = jwt.sign(
            {_id: user._id, email},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_TIMEOUT}
        );

        // Detect environment automatically
        const isProduction = process.env.FRONTEND_URL?.includes("vercel.app");

        // Store JWT in cookie
        res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction, // true only for Render + Vercel
        sameSite: isProduction ? "none" : "lax", // 'lax' for localhost
        maxAge: 12 * 60 * 60 * 1000, // 12 hours
        });

        return res.status(200).json({
            message: "Google login successfull",
            user
        });

    }catch(err){
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getMe = async(req, res) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message: "Unauthorized!!"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded._id).select("name email photo");
        if(!user){
            return res.status(404).json({
                message: "User not found!"
            });
        }

        return res.status(200).json({
            message: "success",
            name: user.name,
            email: user.email,
            photo: user.photo
        });

    }catch(err){
        return res.status(403).json({
            message: "Forbidden"
        });
    }
}

export const logoutUser = async(req, res) => {

    // Detect environment automatically
    const isProduction = process.env.FRONTEND_URL?.includes("vercel.app");

    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({
        message: "Logged out successfully"
    });
}