import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/apiHelper.js";

export const NavbarMobileTop = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // theme state
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  // toggle theme
  const toggleTheme = () => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove("dark");
      setDarkMode(false);
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      setDarkMode(true);
      localStorage.setItem("theme", "dark");
    }
  };

  // load saved theme preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch (err) {
      console.log("Error in logout", err);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 md:hidden">
      <div className="flex items-center justify-between 
      bg-bg-light border-b border-border shadow-md px-4 py-3">
        {/* Logo + Name */}
        <div className="flex items-center gap-2">
          <img
            src="/src/assets/logo_black.webp"
            className="w-7 h-7"
            alt="Xpense logo"
          />
          
          <p className="font-sans text-lg font-semibold text-text">Xpense</p>
        </div>

        {/* Right side: Theme toggle + Profile */}
        <div className="flex items-center gap-3 relative">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-dark 
            hover:bg-bg transition-colors transform hover:scale-105 active:scale-95 duration-200"
          >
            {darkMode ? (
              <img src="/src/assets/sun.svg" className="w-5 h-5" alt="Light mode" />
            ) : (
              <img src="/src/assets/moon.svg" className="w-5 h-5" alt="Dark mode" />
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => setOpen(!open)}
            className="bg-bg-dark w-8 h-8 rounded-lg flex items-center justify-center 
            hover:bg-bg-light transition-colors"
          >
            <img
              src="/src/assets/user-black.svg"
              className="w-5 h-5 rounded-full"
              alt="profile"
            />
          </button>

          {/* Dropdown (logout) */}
          {open && (
            <div className="absolute right-0 top-12 w-36 bg-bg-light border 
            border-border rounded-xl shadow-lg overflow-hidden animate-fadeIn z-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full font-medium px-4 py-2 text-red-600 
                hover:bg-bg-dark transition-colors"
              >
                <img src="/src/assets/logout-black.svg" className="w-4 h-4" alt="logout" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
