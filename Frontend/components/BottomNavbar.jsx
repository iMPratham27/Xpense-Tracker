import { Link, useLocation } from "react-router-dom";

export const BottomNavbar = () => {
  const location = useLocation();

  const linkClasses = (path) =>
    `flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-colors ${
      location.pathname === path
        ? "bg-bg-dark text-accent" // active: background + accent color
        : "text-text-muted hover:text-text hover:bg-bg-dark"
    }`;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-bg-light border 
    border-border shadow-lg rounded-2xl flex justify-around py-2 px-4 md:hidden">
      
      <Link to="/dashboard" className={linkClasses("/dashboard")}>
        <img src="/src/assets/dashboard.svg" className="w-6 h-6" alt="Dashboard" />
        <span className="text-[10px] font-medium">Dashboard</span>
      </Link>
      
      <Link to="/expenses" className={linkClasses("/expenses")}>
        <img src="/src/assets/expense.svg" className="w-6 h-6" alt="Expenses" />
        <span className="text-[10px] font-medium">Expenses</span>
      </Link>
      
      <Link to="/limits" className={linkClasses("/limits")}>
        <img src="/src/assets/limits.svg" className="w-6 h-6" alt="Limits" />
        <span className="text-[10px] font-medium">Limits</span>
      </Link>
    </div>
  );
};
