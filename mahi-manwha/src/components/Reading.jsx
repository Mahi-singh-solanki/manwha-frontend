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
    return <>
    <div className="bg-gray-800 text-white">
        <h1 className="flex justify-center items-center text-2xl font-bold">Chapter:{chapter.chapter_number}</h1>
        <ul className="flex flex-col justify-center items-center">
            {chapter.images.map((currelem,index)=>{
               return <li key={index}><img src={currelem} alt={index+1} /></li>
            })}
        </ul>
    </div>
    </>
}