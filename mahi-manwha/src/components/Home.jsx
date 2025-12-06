import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient,keepPreviousData } from "@tanstack/react-query";
import apiclient from "../api/Api";
import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { MdDeleteForever } from "react-icons/md";
import { ThreeDot } from "react-loading-indicators";
import { RiBookShelfFill } from "react-icons/ri";


// --- LOGIC HELPERS (OUTSIDE COMPONENT) ---

// Helper 1: Returns the UNREAD COUNT as a NUMBER (0 or more).
// This is used ONLY for logic (filtering/sorting).
const unreadCount = (chapters = []) => {
    return chapters.filter(ch => !ch.read_status).length;
};

// Helper 2: Returns the unread count or an EMPTY STRING.
// This is used ONLY for rendering the badge in JSX.
const unreadForRender = (chapters = []) => {
    const count = unreadCount(chapters);
    return count > 0 ? count : "";
};

const getTopSeriesList = (allSeries) => {
    if (!allSeries || allSeries.length === 0) return [];

    // 1. Separate series with unread chapters (using the NUMERICAL helper)
    const seriesWithUnread = allSeries
        .filter(item => unreadCount(item.chapters) > 0)
        // Sort by unread count (highest first) using NUMERICAL subtraction
        .sort((a, b) => unreadCount(b.chapters) - unreadCount(a.chapters)); 

    // 2. Separate remaining series (no unread chapters)
    const seriesWithoutUnread = allSeries.filter(item => unreadCount(item.chapters) === 0);

    let topList = seriesWithUnread.slice(0, 10);
    
    // 3. If the list is less than 10, fill it with the remaining series
    if (topList.length < 10) {
        const needed = 10 - topList.length;
        topList = topList.concat(seriesWithoutUnread.slice(0, needed));
    }
    
    console.log("Final Top List to be set:", topList); 
    return topList;
};

// --- HOME COMPONENT START ---

export const Home = () => {
    // State for controlled inputs remains in useState
    const [url, setUrl] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [add,setAdd]=useState(false);
    // Renamed 'addtop' to 'setTopSeries' for clarity
    const [topSeries,setTopSeries]=useState([]); 
    // Access the global query client provided in App.jsx
    const queryClient = useQueryClient();

    // --- Data Fetching ---
    const { data: series, isLoading, isError, error } = useQuery({
        queryKey: ["series"],
        queryFn: () => apiclient.get("/series").then(res => res.data),
        staleTime:15000,
        refetchOnWindowFocus: false,
        retry: false,
        gcTime:50000000,
        placeholderData:keepPreviousData,
    });

    // --- EFFECT: Calculate topSeries when 'series' data changes ---
    useEffect(() => {
        // Run ONLY when 'series' data from react-query is available
        if (series) {
            const calculatedTopSeries = getTopSeriesList(series);
            // Set the final calculated array ONCE
            setTopSeries(calculatedTopSeries); 
        }
    }, [series]); 
    // The console.log(topSeries) inside the useEffect was removed as it shows the stale state.

    // --- Mutations (for CUD operations) ---

    // Mutation for adding a new series
    const addSeriesMutation = useMutation({
        mutationFn: (newSeriesUrl) => apiclient.post("/series", { source_url: newSeriesUrl }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["series"] });
        },
        onError: (err) => {
            console.error("Error adding series:", err);
        }
    });

    // Mutation for refreshing all series
    const refreshAllMutation = useMutation({
        mutationFn: () => apiclient.post("/series/refresh-all"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["series"] });
        },
        onError: (err) => {
            console.error("Error refreshing series:", err);
        }
    });

    // --- Event Handlers ---
    const handleplus=()=>{
        setAdd(!add);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url) return;
        addSeriesMutation.mutate(url);
        setUrl(""); // Reset input field
    };

    const handleImage = (seriesId) => {
        navigate(`/list/${seriesId}`);
    };
    const handledelete=async(seriesId)=>{
        await apiclient.delete(`/series/${seriesId}`);
    }
    
    // --- Helper Functions (for rendering) ---
    // This wrapper ensures we use the correct rendering helper defined above
    const unread = (chapters = []) => {
        return unreadForRender(chapters);
    };

    const fetchList=async (seriesId)=>{
        try{
            const response=await apiclient.get(`/series/${seriesId}`);
            const list=await response.data
            return list.chapters
        }catch(error){
            console.error(error);
        }
    }
    const handlelast=async (ch_no,seriesId)=>{
        const chapters=await fetchList(seriesId)
        console.log(chapters)
        const chapter=chapters.find(ch=>ch.chapter_number==ch_no);
        navigate(`/${seriesId}/chapter/${chapter._id}`)
    }
    
    // --- Render Logic ---

    // Handle loading and error states first
    if (isLoading) {
        return <div className=" p-5 min-h-screen bg-black text-white text-center loader w-lvw h-1"><ThreeDot color="white" size="medium" text="" textColor="" /></div>;
    }
    if (isError) {
        return <div className="p-5 min-h-screen bg-gray-800 text-red-400 text-center">Error: {error.message}</div>;
    }
    const handleSection=()=>{
        navigate("/section")
    }
    // Filter ALL series only after data has been successfully loaded
    const filteredSeries = series.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`p-5 min-h-screen bg-black flex flex-col gap-4`}>
           
           
            <div className="flex gap-8">
                <button
                    onClick={() => refreshAllMutation.mutate()}
                    disabled={refreshAllMutation.isPending}
                    className="border-2 border-gray-700 rounded-md p-2 sm:p-4 flex justify-center items-center cursor-pointer bg-gray-900 hover:bg-purple-600 hover:border-purple-500 transition-colors text-[11px] sm:text-[18px] h-10 sm:h-15 w-20 sm:w-38 mb-5 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {refreshAllMutation.isPending ? 'Refreshing...' : 'Refresh All'}
                </button>
                {
                    !add?<div className="invert mt-3.5 sm:mt-7 scale-120 sm:scale-150" onClick={handleplus}>
                    <FaPlus />
                </div>:<div className="invert mt-3.5 scale-120 sm:mt-7 sm:scale-150 z-1" onClick={handleplus}>
                    <ImCross />
                </div>
                }
                <div className="invert mt-4.5 scale-150 sm:mt-8 sm:scale-180 sm:ml-290 ml-30 hover:cursor-pointer"  onClick={handleSection}><RiBookShelfFill /></div>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search for a manhwa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 sm:h-13 max-w-xl mx-auto block p-3 -mt-4 sm:-mt-0 bg-gray-900 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-white transition"
                />
            </div>

            {add?<form onSubmit={handleSubmit} className="flex flex-row items-center justify-center gap-2 -mt-6 mb-5 sm:mt-6">
                <input
                    type="text"
                    className="text-white bg-transparent border-2 rounded-md p-2 w-50 sm:w-1/2"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter series URL"
                />
                <button
                    className="text-white border-2 border-white px-4 py-2 rounded-md hover:bg-white hover:text-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={addSeriesMutation.isPending}
                >
                    {addSeriesMutation.isPending ? 'Submitting...' : 'Submit'}
                </button>
            </form>:<></>}

           <ul className="text-white flex flex-row flex-nowrap overflow-x-auto sm:-space-x-6 -space-x-11 pb-4  -mt-17 sm:-mt-0 px-5 custom-scrollbar h-55">
                {topSeries.map((currelem) => (
                    <li
                        className="flex-shrink-0 w-[calc(45%-1rem)] sm:w-[calc(20%-0.8rem)] md:w-36 h-37 flex flex-col items-center text-center p-2 rounded-lg shadow-lg  transition duration-200 "
                        key={currelem._id}
                        
                    >
                        <div >
                            {/* Rendering logic using the 'unread' (render) helper */}
                            <div style={{width:"21px", height:"21px", background: unread(currelem.chapters) ? "red" : "transparent", borderRadius: unread(currelem.chapters) ? "100px" : "0px", padding: unread(currelem.chapters) ? "12px" : "0px"}} className="flex justify-center items-center translate-y-10.5 translate-x-11.5 z-0 -top-2 -right-2 text-[9px] ">
                                <p>{unread(currelem.chapters)}</p>
                            </div>
                            <div onClick={()=>handledelete(currelem._id)} className="self-end translate-y-5"><MdDeleteForever /></div>
                            <img
                                className="sm:w-full w-18 h-27 object-cover rounded-md shadow cursor-pointer"
                                src={currelem.cover_url}
                                alt={currelem.title}
                                onClick={() => handleImage(currelem._id)}
                            />
                            
                        </div>
                        <p className="mt-2 text-sm sm:text-[12px] text-[7px] text-nowrap overflow-x-clip text-center w-17 sm:w-25 px-1">
                            <b>{currelem.title}</b>
                        </p>
                        <button className="border-2 border-gray-700 rounded-md p-3 sm:p-4 flex justify-center items-center cursor-pointer bg-gray-900 hover:bg-gray-600 hover:border-gray-500 transition-colors text-[9px] h-0.5 mt-1 sm:text-sm w-16 sm:h-2 sm:w-22 text-sm">chapter:{currelem.last_read}</button>
                    </li>
                ))}
            </ul>
 <h2 className="text-white text-xl border-b-2 border-gray-700 pb-2 -mt-5 sm:mt-8"></h2>

            {/* --- All Series List (Original Code) --- */}
            <ul className="text-white grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 -mt-12 sm:mt-6 -space-y-10 sm:-space-y-0">
                {filteredSeries.map((currelem) => (
                    <li
                        className="flex flex-col items-center text-center"
                        key={currelem._id}
                    >
                        <div>
                            <div style={{width:"32px", height:"32px", background: unread(currelem.chapters) ? "red" : "transparent", borderRadius: unread(currelem.chapters) ? "100px" : "0px", padding: unread(currelem.chapters) ? "8px" : "0px"}} className="flex justify-center items-center relative top-13 left-24 sm:left-27">
                                <p className="text-sm">{unread(currelem.chapters)}</p>
                                
                            </div>
                            <div onClick={()=>handledelete(currelem._id)} className="self-end translate-y-5"><MdDeleteForever /></div>
                            <img
                                onClick={() => handleImage(currelem._id)}
                                className="cursor-pointer w-36 h-48 object-cover rounded-md shadow"
                                src={currelem.cover_url}
                                alt={currelem.title}
                            />
                        </div>
                        <p className="mt-2 text-sm sm:text-base">
                            <b>Name: </b>{currelem.title}
                        </p>
                        <button onClick={()=>handlelast(currelem.last_read,currelem._id)} className="border-2 sm:text-base border-gray-700 rounded-md mt-2 p-4 flex justify-center items-center cursor-pointer bg-gray-900 hover:bg-gray-600 hover:border-gray-500 transition-colors h-2 w-22 text-sm">chapter:{currelem.last_read}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};