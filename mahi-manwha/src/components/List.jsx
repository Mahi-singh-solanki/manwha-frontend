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

  const handleread= async ()=>{
    for(let i=0;i<chapters.length;i++)
    {
      if(chapters[i].read_status==false) await apiclient.patch(`/chapters/${chapters[i]._id}/read`, { read_status:"true" });
    }
    navigate("/")
  }
    const navigate=useNavigate()
    const handleChapter=(chapter_id)=>{
        navigate(`/${seriesId}/chapter/${chapter_id}`)
    }
    return (
  <>
    <div className="bg-gray-800 min-h-screen w-full p-4">
      <button onClick={handleread} className="border-2 border-gray-700 rounded-md p-4 flex justify-center items-center cursor-pointer bg-gray-900 hover:bg-purple-600 hover:border-purple-500 transition-colors mb-5 text-white">Read All</button>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {chapters.map((chapter) => (
          <li
            onClick={() => handleChapter(chapter._id, chapters)}
            key={chapter._id}
            className="border-2 border-gray-700 rounded-md p-4 flex justify-center items-center cursor-pointer bg-gray-900 hover:bg-purple-600 hover:border-purple-500 transition-colors"
          >
            <h2
              style={{ color: chapter.read_status ? 'gray' : 'white' }}
              className="font-semibold text-center text-sm"
            >
              Chapter: {chapter.chapter_number}
            </h2>
          </li>
        ))}
      </ul>
    </div>
  </>
);

}