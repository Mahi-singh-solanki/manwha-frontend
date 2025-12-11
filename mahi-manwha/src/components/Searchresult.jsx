import { ThreeDot } from "react-loading-indicators";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { useState,useEffect } from "react";
import apiclient from "../api/Api";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { RiBookShelfFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { HiH1 } from "react-icons/hi2";
import { FaHome } from "react-icons/fa";


export const SearchResult=()=>{
    const [url, setUrl] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [add,setAdd]=useState(false);
    const [searchbtn,handlesearchbtn]=useState(false);
    const [series,setSeries]=useState([]);
    const queryClient = useQueryClient();
    const navigate=useNavigate();
    const refreshAllMutation = useMutation({
        mutationFn: () => apiclient.post("/series/refresh-all"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["series"] });
        },
        onError: (err) => {
            console.error("Error refreshing series:", err);
        }
    });
     const handleplus=()=>{
        setAdd(!add);
    }
    useEffect(()=>{
        if(localStorage.getItem("series"))
        {
            setSeries(JSON.parse(localStorage.getItem("series")))
        }
        console.log(series)
    },[])

    const addSeriesMutation = useMutation({
        mutationFn: async(newSeries) => {const result=await apiclient.post("/series/search/new", { name: newSeries })
    localStorage.setItem("series",JSON.stringify(result.data))
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
        mutationFn: async(newSeries) =>apiclient.post("/series", { "source_url":newSeries }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["series"] });
        },
        onError: (err) => {
            console.error("Error adding series:", err);
        }
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url) return;
        addSeriesMutation.mutate(url);
        setUrl(""); // Reset input field
    };
    if (addSeriesMutation.pending) {
        return <div className=" p-5 min-h-screen bg-black text-white text-center loader w-lvw h-1"><ThreeDot color="white" size="medium" text="" textColor="" /></div>;
    }
    const handleSection=()=>{
        navigate("/section")
    }
    const handleadding=(url)=>{
         addMutation.mutate(url);
    }
    const filteredSeries = series.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handlehome=()=>{
        navigate("/home")
    }
    return<>
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
                            !add?<div className="invert mt-3.5 sm:mt-7 scale-120 sm:scale-150 " onClick={handleplus}>
                            <FaPlus />
                        </div>:<div className="invert mt-3.5 scale-120 sm:mt-7 sm:scale-150 z-1" onClick={handleplus}>
                            <ImCross />
                        </div>
                        }
                        <div onClick={()=>handlesearchbtn(!searchbtn)} className="sm:ml-280 cursor-pointer sm:scale-200 sm:mt-8.5 invert scale-150 mt-4.5 ml-3"><CiSearch /></div>
                        <div className="invert mt-4.5 scale-150 sm:mt-8 sm:scale-180   hover:cursor-pointer"  onClick={handleSection}><RiBookShelfFill /></div>
                        <div className="invert mt-4.5 scale-150 sm:mt-8 sm:scale-180   hover:cursor-pointer"  onClick={handlehome}><FaHome /></div>
                        
                    </div>
        
                    {searchbtn?<div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search for a manhwa..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 sm:h-13 max-w-xl mx-auto block p-3 -mt-4 sm:-mt-0 bg-gray-900 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-white transition"
                        />
                    </div>:<></>}
        
                    {add?<form onSubmit={handleSubmit} className="flex flex-row items-center justify-center gap-2 -mt-6 mb-5 sm:mt-6">
                        <input
                            type="text"
                            className="text-white bg-transparent border-2 rounded-md p-2 w-50 sm:w-1/2"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter series"
                        />
                        <button
                            className="text-white border-2 border-white px-4 py-2 rounded-md hover:bg-white hover:text-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={addSeriesMutation.isPending}
                        >
                            {addSeriesMutation.isPending ? 'searching...' : 'Submit'}
                        </button>
                    </form>:<></>}
        <div>
            {series[0]?<ul className="flex flex-col gap-2">
                {
                    filteredSeries?.map((currresult,index)=>{
                        return <li key={index}>
                            <div className="flex w-100% h-20 border border-gray-500 p-2 sm:h-50 rounded-md gap-2">
                                <img onError={(e) => {
          e.target.src = `https://manwha-one.vercel.app/image-proxy?url=${encodeURIComponent(currresult.img)}`;
        }} className="object-cover rounded-md shadow" src={currresult.img} alt="" />
                                <div className="text-white flex flex-col">
                                    <p className="text-[10px] sm:text-3xl"><b>Title:</b>{currresult.name}</p>
                                    <p className="text-[10px] sm:text-3xl"><b>Chapter:</b>{currresult.number}</p>
                                    <div className="flex gap-1 sm:flex-col"><p className="text-[10px] sm:text-3xl"><b>Source:</b>{currresult.source}</p>
                                    <button onClick={()=>handleadding(currresult.url)} className="text-[8px] sm:text-3xl w-18 hover:cursor-pointer sm:w-52 sm:p-3 bg-blue-900 rounded-md p-0.5">Add to library</button></div>
                                </div>
                            </div>
                        </li>
                    })
                }
            </ul>:<h1 className="text-gray-400">Search for results....</h1>}
        </div>
    </div>
    </>
}