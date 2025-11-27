import { useEffect, useState } from "react";
import apiclient from "../api/Api"; // NOTE: Make sure this path is correct
import { useNavigate, useParams } from "react-router-dom";

import { ThreeDot } from "react-loading-indicators";



export const Reading = () => {
  // 1. Initialize state for a single object as `null`
  const [chapter, setChapter] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const[chapters,setChapters]=useState([])
  const { chapterId,seriesId } = useParams();
  

  
  useEffect(() => {
    // Make sure we don't fetch if there's no ID
    if (!chapterId) return;

    const fetchChapterData = async () => {
      setLoading(true); // Set loading to true when a fetch starts
      try {
        const response = await apiclient.get(`/chapters/${chapterId}`);
        setChapter(response.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChapterData();
  }, [chapterId]); 
  const fetchList=async ()=>{
        try{
            const response=await apiclient.get(`/series/${seriesId}`);
            const list=await response.data
            setChapters(list.chapters)
        }catch(error){
            console.error(error);
        }
    }
    useEffect(()=>{
        fetchList()
    },)
    const navigate=useNavigate()
// 2. Add chapterId to the dependency array

  // 3. Handle loading and error states first
  if (loading) {
        return <div className=" p-5 min-h-screen bg-black text-white text-center loader w-lvw h-1"><ThreeDot color="white" size="medium" text="" textColor="" /></div>;
    }
  if (error) {
    return <div className="bg-gray-800 text-red-500 min-h-screen text-center p-8">Error: {error}</div>;
  }
  // Also handle the case where chapter might not be found
  if (!chapter) {
    return <div className="bg-gray-800 text-white min-h-screen text-center p-8">Chapter not found.</div>;
  }
  const handleNext=async ()=>{
    let chapter_number=chapters.find(ch=>ch._id==chapter._id)
    let chapter_numbers=Number(chapter_number.chapter_number)
    let next_chapter=(chapter_numbers+1).toString();
    next_chapter=chapters.find(ch=>ch.chapter_number==next_chapter)
    const response = await apiclient.patch(`/chapters/${chapter_number._id}/read`, { read_status:"true" });
    if(next_chapter)
    {
      await apiclient.put(`/series/last/${seriesId}`,{last_read:next_chapter.chapter_number})
      navigate(`/${seriesId}/chapter/${next_chapter._id}`)
    }
    else{
      await apiclient.put(`/series/last/${chapter_number._id}`,{last_read:chapter_number})
      navigate("/")
    }
  }
  const handlePrev=()=>{
    let chapter_number=chapters.find(ch=>ch._id==chapter._id)
    chapter_number=Number(chapter_number.chapter_number)
    let next_chapter=(chapter_number-1).toString();
    next_chapter=chapters.find(ch=>ch.chapter_number==next_chapter)
    
    if(next_chapter)
    {
      navigate(`/${seriesId}/chapter/${next_chapter._id}`)
    }
    else{
      return;
    }
  }

  // 4. By the time we get here, we know `chapter` and `chapter.images` exist
  return (
    <div className="bg-black text-white min-h-screen p-2 md:p-4">
  <h1 className="text-center text-xl sm:text-2xl font-bold p-4">
    Chapter: {chapter.chapter_number}
  </h1>

  <div className="flex flex-col items-center">
    {chapter.images && chapter.images.map((imageUrl, index) => (
      <img
        key={index}
        src={`https://manwha-one.vercel.app/image-proxy?url=${encodeURIComponent(imageUrl)}`}
        alt={`Page ${index + 1}`}
        className="w-full max-w-4xl mb-2" // Added margin-bottom for spacing
      />
    ))}
  </div>
      
  {/* --- RESPONSIVE NAVIGATION BUTTONS --- */}
<div className="sticky bottom-4 z-50 w-full flex justify-center px-4">
  {/* The `flex` class ensures the buttons are always in a row. */}
  <div className="flex justify-between items-center gap-4 w-full max-w-md bg-gray-900 bg-opacity-80 backdrop-blur-sm p-2 sm:p-4 rounded-2xl border border-gray-700">
    
    <button 
      onClick={handlePrev} 
      className="bg-gray-500 hover:bg-gray-600 w-full sm:w-40 h-10 sm:h-12 rounded-full font-bold text-sm sm:text-base transition-colors"
    >
      Prev
    </button>
    
    <button 
      onClick={handleNext} 
      className="bg-green-500 hover:bg-green-600 w-full sm:w-40 h-10 sm:h-12 rounded-full font-bold text-sm sm:text-base transition-colors"
    >
      Next
    </button>

  </div>
</div>
  {/* ------------------------------------- */}

</div>
  );
};