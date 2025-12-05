import { useEffect,useState } from "react"
import apiclient from "../api/Api";
import { useNavigate } from "react-router-dom";

export const Login=()=>{
    const[loginid,setLoginid]=useState("");
    const[pass,setPass]=useState("");
    const navigate=useNavigate()
    const handlesubmit=async(e)=>{
        try{
        e.preventDefault();
        const res= await apiclient.post("/auth/auth/login",{loginid:loginid,password:pass});
        if(res.data.token){
            localStorage.setItem("Token",`Bearer ${res.data.token}`)
            navigate("/home")
        }
        }catch(err){
            console.error(err)
        }
    }
    useEffect(()=>{
        const token=localStorage.getItem("Token")
        if(token)
        {
            navigate("/home")
        }
    })

    return<>
    <div className="bg-black w-lvw h-lvh text-white flex justify-center items-center ">
        <form className="flex flex-col bg-cyan-800 p-4 rounded-3xl text-center gap-4 w-80 sm:w-100">
        <label htmlFor="loginid">Login Id</label>
        <input type="text" className="outline-0 border-2 rounded-2xl w-35 p-2 self-center" defaultValue={loginid} onChange={(e)=>setLoginid(e.target.value)} id="loginid"/>
        <label htmlFor="pass">Password</label>
        <input type="text" className="outline-0 border-2 rounded-2xl w-35 p-2 self-center" defaultValue={pass} onChange={(e)=>setPass(e.target.value)} id="pass"/>
        <button onClick={handlesubmit} type="submit" className="border-2 w-35 self-center border-gray-700 rounded-md p-4 flex justify-center items-center cursor-pointer bg-gray-900 hover:bg-purple-600 hover:border-purple-500 transition-colors mb-5 text-white disabled:opacity-50 h-5">Submit</button>
    </form>
    </div>
    
    </>
}