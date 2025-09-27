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
    return <>
    <div className="bg-gray-800 w-lvw h-lvh ">
        <ul>
            {chapters.map((currelem,index)=>{
                return <li key={index}><h1 onClick={()=>handleChapter(currelem._id)} className="text-white cursor-pointer">chapter:{index}</h1></li>
            })}
        </ul>
    </div>
    </>
}