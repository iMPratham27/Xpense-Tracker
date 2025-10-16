import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export const BottomNavbar = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    // update from existing saved value on mount
    const saved = localStorage.getItem("theme");
    if (saved) setDarkMode(saved === "dark");

    // listen for storage (other tabs)
    const onStorage = (e) => {
      if (e.key === "theme") setDarkMode(e.newValue === "dark");
    };
    window.addEventListener("storage", onStorage);

    // observe class changes on html (same tab toggles)
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("storage", onStorage);
      observer.disconnect();
    };
  }, []);

  const linkClasses = (path) =>
  `flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-colors ${
    location.pathname === path
      ? "bg-[hsla(0,0%,100%,0.12)] text-text dark:bg-[hsla(0,0%,100%,0.18)] dark:text-[hsl(0,0%,98%)]"
      : "text-text-muted hover:text-text hover:bg-[hsla(0,0%,100%,0.08)]"
  }`;



  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-bg-light border border-border shadow-lg rounded-2xl flex justify-around py-2 px-4 md:hidden">
      <Link to="/dashboard" className={linkClasses("/dashboard")}>
        <img src={darkMode ? "/src/assets/dashboard-white.svg" : "/src/assets/dashboard-black.svg"} className="w-6 h-6" alt="Dashboard" />
        <span className="text-[10px] font-medium">Dashboard</span>
      </Link>
      <Link to="/expenses" className={linkClasses("/expenses")}>
        <img src={darkMode ? "/src/assets/expense-white.svg" : "/src/assets/expense-black.svg"} className="w-6 h-6" alt="Expenses" />
        <span className="text-[10px] font-medium">Expenses</span>
      </Link>
      <Link to="/limits" className={linkClasses("/limits")}>
        <img src={darkMode ? "/src/assets/limits-white.svg" : "/src/assets/limits-black.svg"} className="w-6 h-6" alt="Limits" />
        <span className="text-[10px] font-medium">Limits</span>
      </Link>
    </div>
  );
};