import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar.jsx";
import { BottomNavbar } from "./BottomNavbar.jsx";
import { NavbarMobileTop } from "./NavbarMobileTop.jsx";

export const Layout = ({ toggleTheme, darkMode }) => {
  return (
    <div className="min-h-screen bg-bg">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <div className="md:hidden">
        <NavbarMobileTop toggleTheme={toggleTheme} darkMode={darkMode} />
      </div>

      <main className="pt-20 pb-20 px-4">
        <Outlet />
      </main>

      <div className="md:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
};