import { keepPreviousData, useQuery } from "@tanstack/react-query"
import apiclient from "../api/Api"
import { ThreeDot } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";
import {  useState } from "react";
export const Section=()=>{
    const[completedseries,setCompleted]=useState([])
    const[notUpdated,setnotUpdated]=useState([])
    const navigate =useNavigate()
    const getseries=async()=>{
        const series=await apiclient.get("/series")
        const completed=series.data.filter(series=>series.status=="finished")
        setCompleted(completed)
        const today = new Date();
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        let notupdated = series.data.filter(item => {
  const updatedAt = new Date(item.updated_at);
  return today.getTime() - updatedAt.getTime() >= thirtyDaysInMs;
});
        notupdated=notupdated.filter(item=>item.status!="finished")
    setnotUpdated(notupdated)
        return series.data
    }
    const handleImage = (seriesId) => {
        navigate(`/list/${seriesId}`);
    };
    let {data,isLoading,isError,error}=useQuery({
        queryKey:["series"],
        queryFn:getseries,
        gcTime:5000,
        placeholderData:keepPreviousData
    })

    if (isLoading) {
        return <div className=" p-5 min-h-screen bg-black text-white text-center loader w-lvw h-1"><ThreeDot color="white" size="medium" text="" textColor="" /></div>;
    }
    if (isError) {
        return <div className="p-5 min-h-screen bg-gray-800 text-red-400 text-center">Error: {error.message}</div>;
    }
    return<>
    <div className="bg-black w-lvw min-h-screen text-white flex flex-col">
        <div className="m-10"><h1 className="font-bold text-2xl">Completed Series</h1>
        <ul className="text-white grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mt-6">
                        {completedseries.map((currelem) => (
                            <li
                                className="flex flex-col items-center text-center"
                                key={currelem._id}
                            >
                                <div>
                                    
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
                    
                            </li>
                        ))}
                    </ul>
        </div>
        <div className="ml-10" ><h1 className="font-bold text-2xl">Not updated</h1>
         <ul className="text-white grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mt-6">
                        {notUpdated.map((currelem) => (
                            <li
                                className="flex flex-col items-center text-center"
                                key={currelem._id}
                            >
                                <div>
                                    
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
                    
                            </li>
                        ))}
                    </ul>
        </div>
    </div>
    </>
}
