import { Search, Sun, User, Trash, Star, ChevronLeft, ChevronRight, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { ThreeDot } from "react-loading-indicators";
import { useRef } from "react";
import apiclient from "../api/Api";


const unreadCount = (chapters = []) => {
    return chapters.filter(ch => !ch.read_status).length;
};


const unreadForRender = (chapters = []) => {
    const count = unreadCount(chapters);
    return count > 0 ? count : "";
};



const ManhwaCard = ({ item }) => {
    const unread = (chapters = []) => {
        return unreadForRender(chapters);
    };
    const navigate = useNavigate()
    const handleImage = (seriesId) => {
        navigate(`/chapters/${seriesId}`);
    };
    const handledelete = async (seriesId) => {
        if (confirm("Do you wanna delete?")) {
            await apiclient.delete(`/series/${seriesId}`);
        }
    }
    return (
        <motion.div
            whileHover={{ scale: 1.04, y: -5 }}
            onClick={() => handleImage(item._id)}
            className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition"

        >
            <img
                src={item.cover_url}
                alt={item.title}

                className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white  shadow-lg" style={{ background: unread(item.chapters) ? "blue" : "transparent" }}>
                {unread(item.chapters)}
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handledelete(item._id)
                }}
                className="absolute top-3 right-3 bg-black/50 p-2 rounded-full z-1"
            >
                <Trash
                    size={18}
                />
            </button>

            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition duration-300 p-4 flex flex-col justify-end">
                <h3 className="text-white font-semibold text-lg truncate">
                    {item.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                    <span>Ch. {item.last_read}</span>
                    <span
                        className={`px-2 py-0.5 text-xs rounded-full ${item.status === "reading"
                            ? "bg-green-600"
                            : "bg-gray-600"
                            }`}
                    >
                        {item.status}
                    </span>
                </div>

                <div className="mt-3">
                    <div className="w-full h-2 bg-gray-700 rounded-full">
                        <div
                            className="h-2 bg-white rounded-full"
                            style={{ width: `${parseInt(((item.chapters.length-unread(item.chapters)) / item.chapters.length) * 100)}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">
                        {parseInt(((item.chapters.length-unread(item.chapters)) / item.chapters.length) * 100)}%
                    </p>
                </div>
            </div>

            <div className="absolute bottom-3 left-3 bg-red-800 text-white text-xs px-3 py-1 rounded-full">
                Ch. {item.chapters?.length}
            </div>
        </motion.div>
    );
}



export const SearchResult = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);
    const { filter } = useParams();
    const { data: series, isLoading, isError, error } = useQuery({
        queryKey: ["series"],
        queryFn: () => apiclient.get("/series").then(res => res.data),
        staleTime: 15000,
        refetchOnWindowFocus: false,
        retry: false,
        gcTime: 50000000,
        placeholderData: keepPreviousData,
    });
    const filteredSeries = series?.filter((item) =>
        item.title?.toLowerCase().includes(filter?.toLowerCase())
    );
    const navigate = useNavigate();
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!searchRef.current?.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    if (isLoading) {
        return <div className=" p-5 min-h-screen  text-white text-center loader w-lvw h-1"><ThreeDot color="white" size="medium" text="" textColor="" /></div>;
    }
    if (isError) {
        console.log(series)
        return <div className="p-5 min-h-screen  text-red-400 text-center">Error: {error.message}</div>;
    }

    return (
        <div className="min-h-screen text-white pb-24">


            <div className="flex items-center gap-4 px-8 py-5">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl font-bold">
                    <img src="/icon.png" alt="icon" className="rounded-xl" />
                </div>

                <div
                    ref={searchRef}
                    className="relative flex-1"
                >
                    <div className="flex items-center bg-white/10 rounded-full px-5 py-3 border border-white/10">
                        <Search size={18} className="text-gray-400 mr-2" />
                        <input
                            placeholder="Search manhwa..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            className="bg-transparent outline-none w-full text-white placeholder-gray-400"
                        />
                    </div>

                    {showDropdown && searchQuery && filteredSeries?.length > 0 && (
                        <div className="absolute top-full mt-3 w-full bg-[#111] border border-white/10 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50">
                            {filteredSeries.slice(0, 6).map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => {
                                        navigate(`/chapters/${item._id}`);
                                        setShowDropdown(false);
                                        setSearchQuery("");
                                    }}
                                    className="px-4 py-3 hover:bg-white/10 cursor-pointer transition flex items-center gap-3"
                                >
                                    <img
                                        src={item.cover_url}
                                        alt={item.title}
                                        className="w-10 h-14 object-cover rounded-md"
                                    />
                                    <span className="text-sm">{item.title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <Sun className="text-yellow-400 cursor-pointer" />
                <User className="cursor-pointer" onClick={() => navigate("/profile")} />
            </div>

            <section className="px-8 ">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Manwha's</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {filteredSeries?.map((item) => (
                        <ManhwaCard key={item._id} item={item} />
                    ))}
                </div>
            </section>




        </div>
    );
};

