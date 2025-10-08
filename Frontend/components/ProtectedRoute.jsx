import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getCurrUser } from "../utils/apiHelper.js";
import { FadeLoader } from "react-spinners";

export const ProtectedRoute = ({children}) => {

    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async() => {
            try{
                await getCurrUser();
                setAuthenticated(true);
            }catch(err){
                setAuthenticated(false);
            }finally{
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    if(loading){
        return <div className="flex justify-center items-center h-screen" ><FadeLoader color="hsl(145, 70%, 45%)" /></div>
    }

    return authenticated ? children : <Navigate to="/login" replace />
}