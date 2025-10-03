import { config } from 'dotenv';
config();

export const port = process.env.PORT;
export const mongoURL = process.env.MONGODB_ATLAS_URL;