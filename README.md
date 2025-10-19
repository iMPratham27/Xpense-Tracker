# 🚀 **Overview**
Xpense Tracker merges a **modern React frontend** with a **secure Node.js + Express backend** powered by **MongoDB**.\
It features real-time transaction tracking, budget limit automation, and Google OAuth authentication, making it both user-friendly and developer-centric.

## 🎯 **Why Xpense Tracker?**
✨ **Key Features -**
- ⚡ **Modern UI/UX:** Built using React, Vite, and Tailwind CSS for a fast, responsive experience.
- 🔐 **Google OAuth & JWT Authentication:** Secure login and session handling with route protection.
- 📊 **Smart Budget Tracking:** Automatically monitor expenses and monthly limits in real time.
- 📧 **Email Alerts:** Uses Resend API to notify users when spending approaches or exceeds limits.
- 🧩 **Modular Components:** Reusable UI blocks for dashboards, expense cards, and limits.
- ⚙️ **Backend Power:** Express + MongoDB backend with efficient API routing and validation utilities.


### Demo Video
[Youtube demo video](https://youtu.be/EbWxfJpA5Bw)


**Backend .env file:**
```
PORT=8000
MONGODB_ATLAS_URL=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
JWT_TIMEOUT=12h
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
RESEND_API_KEY=your_resend_api_key
```

**Frontend .env file:**
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=https://your-backend-domain.com
```
