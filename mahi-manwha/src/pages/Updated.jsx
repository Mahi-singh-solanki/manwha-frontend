import { ArrowLeft, Heart, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ThreeDot } from "react-loading-indicators";
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import apiclient from "../api/Api";

export const Updated = () => {
    
    const navigate = useNavigate()
    
    const handleImage = (seriesId) => {
        navigate(`/chapters/${seriesId}`);
    };
    const { data: series, isLoading, isError, error } = useQuery({
    queryKey: ["series"],
    queryFn: async () => {
        const res = await apiclient.get("/series");
        return res.data;
    },
});
const notUpdated = series?.filter(item => {
    const today = new Date();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const updatedAt = new Date(item.updated_at);
    return (
        today.getTime() - updatedAt.getTime() >= thirtyDaysInMs &&
        item.status !== "finished"
    );
});

    if (isLoading) {
        return <div className=" p-5 min-h-screen  text-white text-center loader w-lvw h-1"><ThreeDot color="white" size="medium" text="" textColor="" /></div>;
    }
    if (isError) {
        return <div className="p-5 min-h-screen bg-gray-800 text-red-400 text-center">Error: {error.message}</div>;
    }

    return (
        <div className="min-h-screen  text-white px-10 py-6 pb-20">

            <div className="flex justify-between items-center mb-10">

                <div className="flex items-center gap-4">
                    <ArrowLeft
                        className="cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="text-2xl font-semibold">
                        Not Updated
                    </h1>
                </div>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">

                {notUpdated?.map((item) => (
                    <motion.div
                        key={item._id}
                        onClick={() => handleImage(item._id)}
                        whileHover={{ scale: 1.04, y: -5 }}
                        className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                    >
                        <img

                            src={item.cover_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />




                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition duration-300 p-4 flex items-end">
                            <h3 className="text-white font-medium text-sm mb-7">
                                {item.title}
                            </h3>
                        </div>


                        <div className="absolute bottom-3 left-3  bg-red-800 text-white text-xs px-3 py-1 rounded-full">
                            Ch. {item.chapters.length}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {notUpdated?.length === 0 && (
                <div className="text-center mt-20 text-gray-400">
                    No Updates required yet.
                </div>
            )}
        </div>
    );
}
