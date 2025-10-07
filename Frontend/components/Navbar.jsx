import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <div>
            <nav>
                <Link to="/dashboard" >Dashboard</Link>
                <Link to="/expenses" >Expenses</Link>
                <Link to="/limits" >Limits</Link>
            </nav>
        </div>
    );
}