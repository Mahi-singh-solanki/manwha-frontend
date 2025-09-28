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
    <div className="p-5 min-h-screen bg-gray-800 flex flex-col gap-4">
  <ul className="text-white 
               grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 
               gap-4">
  {series.map((currelem) => {
    return (
      <li
        className="flex flex-col items-center text-center"
        key={currelem._id}
      >
        <img
          onClick={() => handleImage(currelem._id)}
          className="cursor-pointer w-36 h-48 object-cover rounded-md shadow"
          src={currelem.cover_url}
          alt={currelem.title}
        />
        <p className="mt-2 text-sm sm:text-base">
          <b>Name: </b>{currelem.title}
        </p>
      </li>
    );
  })}
</ul>


  <form
    onSubmit={postSeries}
    className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-6"
  >
    <input
      type="text"
      className="text-white bg-transparent border-2 rounded-md p-2 w-full sm:w-1/2"
      value={url}
      onChange={(e) => {
        setUrl(e.target.value);
      }}
    />
    <button
      className="text-white border-2 border-white px-4 py-2 rounded-md hover:bg-white hover:text-gray-800 transition"
      type="submit"
    >
      Submit
    </button>
  </form>
</div>

    </>
}