import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logoutUser } from "../utils/apiHelper.js";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const html = document.documentElement;
    if(darkMode){
      html.classList.remove("dark");
      setDarkMode(false);
      localStorage.setItem("theme", "light");
    }else{
      html.classList.add("dark");
      setDarkMode(true);
      localStorage.setItem("theme", "dark");
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if(saved == "dark"){
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, [])

  const handleLogout = async() => {
    try{
        await logoutUser();
        navigate("/login", {replace: true})

    }catch(err){
        console.log("Error in logout", err);
    }
  }

  // active link styling
  const linkClasses = (path) =>
    `px-4 py-2 rounded-lg transition-colors ${
      location.pathname === path
        ? "bg-bg-dark text-text font-semibold"
        : "text-text-muted hover:bg-bg-dark hover:text-text"
    }`;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between bg-bg-light 
      shadow-md border border-border rounded-2xl px-6 py-3">
        {/* Logo + Name */}
        <div className="flex items-center gap-2">
          <img
            className="w-8 h-8"
            src="/src/assets/logo_black.webp"
            alt="Xpense Tracker logo"
          />

          <p className="font-sans text-2xl font-semibold text-text">
            XpenseTracker
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-2 font-sans font-medium text-base">
          <Link to="/dashboard" className={linkClasses("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/expenses" className={linkClasses("/expenses")}>
            Expenses
          </Link>
          <Link to="/limits" className={linkClasses("/limits")}>
            Limits
          </Link>
        </div>

        {/* Theme toggle + Profile */}
        <div className=" flex items-center gap-4 relative " >
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-bg-dark 
            hover:bg-bg transition-colors transform hover:scale-105 active:scale-95 duration-200"
          >
            {darkMode ? 
              (<img
                src="/src/assets/sun.svg" 
                className="w-5 h-5 transition-all duration-300 ease-in-out transform scale-100 opacity-100"
                alt="Light mode"  
              />) : 
              (<img
                src="/src/assets/moon.svg" 
                className="w-5 h-5 transition-all duration-300 ease-in-out transform scale-100 opacity-100"
                alt="Dark mode"  
              />)
            }
          </button>

          <div>
            <button
              onClick={() => setOpen(!open)}
              className=" bg-bg-dark w-10 h-10 px-2 py-1 rounded-lg 
                    cursor-pointer hover:bg-bg-light hover:shadow-sm 
                    transition-colors duration-200"
            >
              <img
                className="w-6 h-6 rounded-full"
                src="/src/assets/user-black.svg"
                alt="profile"
              />
              
            </button>

            {open && (
              <div
                className="absolute right-0 mt-2 w-30 bg-bg-light border border-border 
                          rounded-xl shadow-lg overflow-hidden animate-fadeIn z-50"
              >
                <button
                  onClick={handleLogout}
                  className=" flex items-center justify-evenly gap-2 cursor-pointer w-full 
                  font-medium px-4 py-2 text-red-600 hover:bg-bg-dark transition-colors"
                >
                  <img className="w-4 h-4" src="/src/assets/logout-black.svg" />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
        

      </div>
    </div>
  );
};