import { useState, useEffect } from "react";
import { getCurrUser } from "../utils/apiHelper.js";

export const DashboardPage = () => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async() => {
            try{
                const userInfo = await getCurrUser();
                setUser(userInfo);
            }catch(err){
                console.error("Error in fetching the user: ", err);
            }
        }

        fetchUser();
    }, []);

    if(!user) return <p className=" flex justify-center items-center text-3xl font-bold " >Loading user info....</p>

    return (
    //   <div className=" flex flex-col justify-center items-center text-2xl ">
    //     <h2>Welcome: {user.data.name}</h2>
    //     <h3>Email: {user.data.email}</h3>
    //     <img src={user.data.photo} alt="profile" width="100px" />
    //     <button
    //       className=" text-white font-bold bg-blue-700 border rounded p-2 m-2 "
    //       onClick={handleLogout}
    //     >
    //       Logout
    //     </button>
    //   </div>
        <div>
            Dashboard page
        </div>
    );
}