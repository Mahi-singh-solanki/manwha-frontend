import { ArrowLeft, Search, Star, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import apiclient from "../Api/Api";

export const AddNew = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [series, setSeries] = useState([]);
    const queryClient = useQueryClient();
    const addSeriesMutation = useMutation({
        mutationFn: async (newSeries) => {
            const result = await apiclient.post("/series/search/new", { name: newSeries })
            localStorage.setItem("series", JSON.stringify(result.data))
            setSeries(result.data)

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["series"] });
        },
        onError: (err) => {
            console.error("Error adding series:", err);
        }
    });
    const addMutation = useMutation({
        mutationFn: async (newSeries) => apiclient.post("/series", { "source_url": newSeries }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["series"] });
        },
        onError: (err) => {
            console.error("Error adding series:", err);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!search) return;
        addSeriesMutation.mutate(search);
        setSearch("");
    };
    if (addSeriesMutation.pending) {
        return <div className=" p-5 min-h-screen bg-black text-white text-center loader w-lvw h-1"><ThreeDot color="white" size="medium" text="" textColor="" /></div>;
    }
    const handleadding = (url) => {
        if (confirm("Do you wanna add this series?")) {
            addMutation.mutate(url);
        }
    }

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white px-8 py-6">

            <div className="flex items-center gap-4 mb-10">
                <ArrowLeft
                    className="cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h1 className="text-2xl font-semibold">Add Manhwa</h1>
            </div>

         
            <div className="relative mb-10 flex gap-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search for manhwa to add..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-gray transition"
                />
                <button
                    className="text-white border-2 border-gray-400 px-4 py-2 rounded-2xl hover:bg-gray  transition disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={addSeriesMutation.isPending}
                >
                    {addSeriesMutation.isPending ? 'searching...' : 'Submit'}
                </button>
            </div>

       
            <div className="flex flex-col gap-8">

                {series?.map((item) => (
                    <motion.div
                        key={item._id}
                        whileHover={{ y: -4 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6 flex gap-6 backdrop-blur-md hover:bg-white/10 transition"
                    >

                        {/* Cover */}
                        <img
                            src={item.img}
                            alt={item.name}
                            className="w-16 h-22 sm:w-32 sm:h-44 rounded-2xl object-cover"
                        />

                        {/* Info */}
                        <div className="flex flex-col justify-between flex-1">

                            <div>
                                <h2 className="text-[10px] sm:text-xl font-bold">{item.name}</h2>

                        <p className="text-[10px] sm:text-3xl"><b>Source:</b>{item.source}</p>
                                <div className="flex items-center gap-6 sm:mt-4 text-sm text-gray-300">

                                    <span>Ch. {item.number}</span>

                                </div>
                            </div>

                            <div className="sm:mt-6 mt-1">
                                <button className="flex items-center gap-2 px-2 sm:px-6 py-1 sm:py-3 rounded-xl bg-gradient-to-r from-green-800 to-green-600 hover:opacity-90 transition text-[10px] sm:text-md sm:font-medium" onClick={()=>handleadding(item.url)}>
                                    <Plus size={18} />
                                    Add to Library
                                </button>
                            </div>

                        </div>

                    </motion.div>
                ))}

            </div>

            {series.length === 0 && (
                <div className="text-center mt-20 text-gray-400">
                    No results found.
                </div>
            )}

        </div>
    );
};
