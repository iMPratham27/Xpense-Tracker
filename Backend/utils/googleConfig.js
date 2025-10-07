import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

// creates a google oauth2 client for our backend
export const oauth2client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
);