import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../utils/apiHelper.js";
import { useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";

export const GoogleLogin = () => {
  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"]);
        <FadeLoader color="hsl(145, 70%, 45%)" />
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Error while requesting google code: ", err);
    }
  };

  // initialize google login
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (

    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-md text-center p-4 md:p-6 animate-fadeIn">
        <img
          src="/logo_black.webp"
          alt="Xpense Logo"
          className="mx-auto w-16 md:w-20 mb-6"
        />

        <h1 className="font-sans text-3xl md:text-4xl font-semibold text-black">
          Xpense Tracker
        </h1>

        <p className="font-sans mt-3 text-gray-600 text-sm md:text-base">
          Your finances,{" "}
          <span className="text-[#34C759] font-medium">simplified!</span>
        </p>

        <button 
          onClick={googleLogin} 
          className="mt-10 w-full cursor-pointer flex items-center justify-center gap-3 bg-white border border-gray-300 shadow-sm rounded-xl px-5 py-3 md:py-4 text-base font-medium text-gray-700 hover:shadow-md hover:translate-y-[-1px] active:scale-95 transition-all duration-200">
          <img
            src="/google-icon.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};
