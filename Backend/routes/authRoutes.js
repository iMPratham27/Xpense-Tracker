import express from 'express';
import { getMe, googleLogin, logoutUser } from '../controller/authController.js';

export const authRouter = express.Router();

authRouter.get('/google', googleLogin);
authRouter.get('/me', getMe);
authRouter.post('/logout', logoutUser);