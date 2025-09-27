import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import apiclient from "../api/Api";

export const Home=()=>{
    const[series,setSeries]=useState([]);
    const[url,setUrl]=useState("")
    const postSeries=async (e)=>{
        e.preventDefault(); // Prevent the form from reloading the page
    if (!url) return;
        try {
      // Send the POST request with the URL in the body
      const response = await apiclient.post("/series", { source_url: url });
      
      // Add the new series returned from the backend to our existing list
      setSeries((prevSeries) => [...prevSeries, response.data]);
      
      setUrl(""); // Clear the input field on success
    } catch (error) {
      console.error(error);
      
    }
    }
    const fetchSeries=async ()=>{
        try{
            const response=await apiclient.get("/series");
            const series=await response.data;
            setSeries(series)
            console.log(series)
        }catch(error){
            console.error(error);
        }
    }
    useEffect(()=>{
        fetchSeries()
    },[])
    const navigate=useNavigate()
    const handleImage=(seriesId)=>{
        navigate(`/list/${seriesId}`)
    }
    return <>
    <div className="p-5 w-100% h-lvh bg-gray-800 flex flex-col">
        <ul className="text-white grid grid-cols-4 justify-center items-center">
            {series.map((currelem)=>{
                return <li className="flex flex-col  w-80 h-120 " key={currelem._id}>
                    <img onClick={()=>{
                        handleImage(currelem._id)
                    }} className="cursor-pointer h-105 w-80" src={currelem.cover_url} alt={currelem.title} />
                    <h1 className="text-4xl"><b>Name:-</b>{currelem.title}</h1>
                </li>
            })}
        </ul>
        <form onSubmit={postSeries} className="flex flex-col mt-25">
            <input type="text" className="text-white" value={url} onChange={(e)=>{setUrl(e.target.value)}}/>
            <button className="text-white" type="submit">Submit</button>
        </form>
    </div>
    </>
}