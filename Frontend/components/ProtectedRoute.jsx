import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getCurrUser } from "../utils/apiHelper.js";

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
        return <p className=" flex justify-center items-center text-3xl font-bold " >Loading....</p>
    }

    return authenticated ? children : <Navigate to="/login" replace />
}