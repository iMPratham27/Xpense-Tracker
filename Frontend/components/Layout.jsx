import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar.jsx";

export const Layout = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
}