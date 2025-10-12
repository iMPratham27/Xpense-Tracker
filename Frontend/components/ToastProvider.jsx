// ToastProvider.jsx
import { Toaster } from "react-hot-toast";

export const ToastProvider = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      style: {
        borderRadius: "12px",
        background: "var(--color-bg-light)",
        color: "var(--color-text)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "10px 16px",
        fontSize: "0.9rem",
      },
      success: { iconTheme: { primary: "#3b82f6", secondary: "white" } },
      error: { iconTheme: { primary: "#ef4444", secondary: "white" } },
    }}
  />
);
