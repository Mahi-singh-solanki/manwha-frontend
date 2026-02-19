import { X, Home, ChevronLeft, ChevronRight, List } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate,useParams } from "react-router";
import apiclient from "../api/Api";
import { ThreeDot } from "react-loading-indicators";

export const Reading=()=> {
  const navigate = useNavigate();
    const[series,setseries]=useState(null);
  const [chapter, setChapter] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const[chapters,setChapters]=useState([])
  const { chapterId,seriesId } = useParams();
  const [showChapters, setShowChapters] = useState(false);
  // ESto close chapter list
  useEffect(() => {
    // Make sure we don't fetch if there's no ID
    if (!chapterId) return;

    const fetchChapterData = async () => {
      setLoading(true); 
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
            setseries(list)
        }catch(error){
            console.error(error);
        }
    }
    useEffect(()=>{
        fetchList()
    },)
    if (loading) {
        return <div className=" p-5 min-h-screen bg-black text-white text-center loader w-lvw h-1"><ThreeDot color="white" size="medium" text="" textColor="" /></div>;
    }
  if (error) {
    return <div className="bg-gray-800 text-red-500 min-h-screen text-center p-8">Error: {error}</div>;
  }
 
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
      navigate(`/${seriesId}/chapters/${next_chapter._id}`)
    }
    else{
      await apiclient.put(`/series/last/${seriesId}`,{last_read:chapter_number.chapter_number})
      navigate("/home")
    }
  }
  const handlePrev=()=>{
    let chapter_number=chapters.find(ch=>ch._id==chapter._id)
    chapter_number=Number(chapter_number.chapter_number)
    let next_chapter=(chapter_number-1).toString();
    next_chapter=chapters.find(ch=>ch.chapter_number==next_chapter)
    
    if(next_chapter)
    {
      navigate(`/${seriesId}/chapters/${next_chapter._id}`)
    }
    else{
      return;
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      <div className=" fixed top-0 left-0 right-0 p-6 flex items-center bg-black gap-4">
        <X
          className="cursor-pointer"
          onClick={() => navigate(`/chapters/${series._id}`)}
        />
        <div>
          <h1 className="text-xl font-semibold">
            {series?.title}
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center sm:mt-0 mt-25">
    {chapter.images && chapter.images.map((imageUrl, index) => (
      <img
        key={index}
        src={imageUrl}
        onError={(e) => {
          e.target.src = `https://manwha-one.vercel.app/image-proxy?url=${encodeURIComponent(imageUrl)}`;
        }}
        alt={`Page ${index + 1}`}
        className="w-full max-w-4xl "
      />
    ))}
  </div>

      <div className="fixed sm;gap-0 gap-2 bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-4 flex items-center justify-between z-10">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          <Home size={16} />
          Home
        </button>

        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            className="px-2 sm:px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 transition"
          >
            <ChevronLeft size={16} className="inline mr-1" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="px-2 sm:px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 transition"
          >
            Next
            <ChevronRight size={16} className="inline ml-1" />
          </button>
        </div>

        <div className="relative">
  <button
    onClick={() => setShowChapters(!showChapters)}
    className="flex items-center gap-2 px-1 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
  >
    <List size={16} />
    Chapters
  </button>

  <AnimatePresence>
    {showChapters && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: -10 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-14 right-0 w-64 max-h-80 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-y-auto z-50"
      >
        <div className="p-4 flex flex-col gap-2">
          {chapters.map((chapter,index) => (
            <div
              key={index}
              onClick={() => {
                navigate(`/${series._id}/chapters/${chapter._id}`);
                setShowChapters(false);
              }}
              className="px-3 py-2 rounded-md hover:bg-white/10 cursor-pointer transition text-sm"
            >
              Chapter {chapter.chapter_number}
            </div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

      </div>

     
    </div>
  );
}
