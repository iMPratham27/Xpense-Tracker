import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../utils/apiHelper.js";
import { useNavigate } from "react-router-dom";

export const GoogleLogin = () => {

    const navigate = useNavigate();

    const responseGoogle = async(authResult) => {
        try{
            if(authResult['code']){
               const result = await googleAuth(authResult['code']);
               navigate("/dashboard");
            }
        }catch(err){
            console.error("Error while requesting google code: ", err);
        }
    }

    // initialize google login
    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code'
    });

    return (
        <div>
            <button 
                onClick={googleLogin} 
                className=" flex justify-center items-center text-white font-bold bg-blue-700 border rounded p-2 " >
                Continue with Google
            </button>
        </div>
    );
}