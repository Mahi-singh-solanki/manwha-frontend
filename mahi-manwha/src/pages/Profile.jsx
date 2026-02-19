import { ArrowLeft, BookOpen, Heart, TrendingUp, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import apiclient from "../api/Api";
import { useEffect, useState } from "react";
import { useQuery,keepPreviousData } from "@tanstack/react-query";
import { ThreeDot } from "react-loading-indicators";

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const { data: series, isLoading, isError, error } = useQuery({
        queryKey: ["series"],
        queryFn: () => apiclient.get("/series").then(res => res.data),
        staleTime: 15000,
        refetchOnWindowFocus: false,
        retry: false,
        gcTime: 50000000,
        placeholderData: keepPreviousData,
    });
  const getUser = async () => {
    try {
      const token = localStorage.getItem("Token");

      const response = await apiclient.get("/auth/auth/me", {
        headers: {
          Authorization: `${token}`,
        },
      });

      setUser(response.data);
      console.log(response.data)
    } catch (error) {
        localStorage.clear("Token")
        navigate("/login")
        console.log(error)
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/login");
  };

 if (isLoading) {
        return <div className=" p-5 min-h-screen  text-white text-center loader w-lvw h-1"><ThreeDot color="white" size="medium" text="" textColor="" /></div>;
    }
    if (isError) {
        console.log(series)
        return <div className="p-5 min-h-screen  text-red-400 text-center">Error: {error.message}</div>;
    }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-10 py-6">

      <div className="flex items-center gap-4 mb-10">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-md shadow-xl">

        <div className="flex items-center gap-6 mb-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl font-bold shadow-lg">
            <img src="./icon.png" alt="" className="rounded-full" />
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              {user?.loginid}
            </h2>
            <p className="text-gray-400 mt-2">
              {user?.loginid}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <motion.div whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
              <BookOpen className="text-purple-400" size={20} />
            </div>
            <h3 className="text-3xl font-bold">
              {series.length}
            </h3>
            <p className="text-gray-400 mt-2">
              In Library
            </p>
          </motion.div>



        </div>
      </div>

      <div className="mt-12">
        <button
          onClick={handleLogout}
          className="w-full border border-red-500 text-red-500 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-500/10 transition text-lg font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};
