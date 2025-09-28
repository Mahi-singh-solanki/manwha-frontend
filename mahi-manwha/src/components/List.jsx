import { useEffect, useState } from "react";
import apiclient from "../api/Api"
import { useNavigate, useParams } from "react-router-dom";

export const List=()=>{
    const[chapters,setChapters]=useState([])
    const {seriesId}=useParams()
    const fetchList=async ()=>{
        try{
            const response=await apiclient.get(`/series/${seriesId}`);
            const list=await response.data
            console.log(list.chapters)
            setChapters(list.chapters)
        }catch(error){
            console.error(error);
        }
    }
    useEffect(()=>{
        fetchList()
    },[])
    const navigate=useNavigate()
    const handleChapter=(chapter_id)=>{
        navigate(`/chapter/${chapter_id}`)
    }
    return (
  <>
    <div className="bg-gray-800 min-h-screen w-full p-4">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {chapters.map((currelem, index) => {
          return (
            <li
              key={index}
              className="border-2 border-gray-500 rounded-md p-4 flex justify-center items-center"
            >
              <h1
                onClick={() => handleChapter(currelem._id)}
                className="text-white cursor-pointer text-center text-sm sm:text-base md:text-lg lg:text-xl"
              >
                Chapter: {currelem.chapter_number}
              </h1>
            </li>
          );
        })}
      </ul>
    </div>
  </>
);

}