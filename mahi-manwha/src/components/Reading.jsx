import apiclient from "../api/Api"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Reading = () => {
    const[chapter,setChapter]=useState({})
    const [loading, setLoading] = useState(true);
    const {chapterId}=useParams()
    const fetchList=async ()=>{
        try{
            const response=await apiclient.get(`/chapters/${chapterId}`);
            const list=await response.data
            console.log(list)
            setChapter(list)
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchList()
    },[])
    if(loading) return <p>Loading.....</p>
    return (
  <>
    <div className="bg-gray-800 text-white min-h-screen p-4">
      <h1 className="flex justify-center items-center text-xl sm:text-2xl md:text-3xl font-bold mb-6">
        Chapter: {chapter.chapter_number}
      </h1>

      <ul className="flex flex-col justify-center items-center gap-6">
        {chapter.images.map((currelem, index) => {
          return (
            <li key={index} className="w-full flex justify-center">
              <img
          // --- THIS IS THE CHANGE ---
          // Point the src to your backend proxy and pass the real URL as a parameter
          src={`https://manwha-production.up.railway.app/image-proxy?url=${encodeURIComponent(currelem)}`}
          // --------------------------
          alt={`Page ${index + 1}`}
          className="w-full max-w-3xl rounded-md shadow-lg object-contain"
        />
            </li>
          );
        })}
      </ul>
    </div>
  </>
);

}