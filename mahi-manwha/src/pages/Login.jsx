import { Mail, Lock, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import apiclient from "../Api/Api";
import { useState,useEffect } from "react";

export const Login=()=> {
    const navigate=useNavigate();
    const[loginid,setLoginid]=useState("");
    const[pass,setPass]=useState("");
    const handleLogin=async(e)=>{
        try{
        e.preventDefault();
        const res= await apiclient.post("/auth/auth/login",{loginid:loginid,password:pass});
        if(res.data.token){
            localStorage.setItem("Token",`Bearer ${res.data.token}`)
            navigate("/")
        }
        }catch(err){
            console.error(err)
        }
    }
    useEffect(()=>{
        const token=localStorage.getItem("Token")
        if(token)
        {
            navigate("/")
        }
    })
  return (
    <div className="relative min-h-screen flex bg-[#111123] items-center justify-center overflow-hidden">
      
      <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl top-[-100px] left-[-100px]" />
      <div className="absolute w-[500px] h-[500px]  rounded-full blur-3xl bottom-[-100px] right-[-100px]" />


      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
      
        <div className="flex flex-col items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 to-gray-400 shadow-lg"
          >
            <BookOpen size={32} className="text-white" />
          </motion.div>

          <h1 className="mt-4 text-3xl font-bold text-purple-900">
            Mahi Manwha
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track. Read. Stay Updated.
          </p>
        </div>


        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
          
      
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">
              Login ID
            </label>
            <div className="flex items-center bg-white/10 border border-white/10 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-gray-500 transition">
              <Mail size={18} className="text-gray-400 mr-3" />
              <input
                
                placeholder="login id"
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                defaultValue={loginid} onChange={(e)=>setLoginid(e.target.value)} id="loginid"
              />
            </div>
          </div>

      
          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">
              Password
            </label>
            <div className="flex items-center bg-white/10 border border-white/10 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-gray-500 transition">
              <Lock size={18} className="text-gray-400 mr-3" />
              <input
                type="password"
                placeholder="••••••••"
                className="bg-transparent outline-none w-full text-white placeholder-gray-500"
                defaultValue={pass} onChange={(e)=>setPass(e.target.value)} id="pass"
              />
            </div>
          </div>

        
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="w-full py-3 rounded-xl bg-gradient-to-r bg-violet-950 text-white font-semibold shadow-lg hover:shadow-blue-800/30 transition-all duration-300"
            onClick={handleLogin}
          >
            Login
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
