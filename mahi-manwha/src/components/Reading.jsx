import { useEffect, useState } from "react";
import apiclient from "../api/Api"; // NOTE: Make sure this path is correct
import { useParams } from "react-router-dom";

export const Reading = () => {
  // 1. Initialize state for a single object as `null`
  const [chapter, setChapter] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { chapterId } = useParams();

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
  }, [chapterId]); // 2. Add chapterId to the dependency array

  // 3. Handle loading and error states first
  if (loading) {
    return <div className="bg-gray-800 text-white min-h-screen text-center p-8">Loading Chapter...</div>;
  }
  if (error) {
    return <div className="bg-gray-800 text-red-500 min-h-screen text-center p-8">Error: {error}</div>;
  }
  // Also handle the case where chapter might not be found
  if (!chapter) {
    return <div className="bg-gray-800 text-white min-h-screen text-center p-8">Chapter not found.</div>;
  }

  // 4. By the time we get here, we know `chapter` and `chapter.images` exist
  return (
    <div className="bg-gray-800 text-white min-h-screen p-2 md:p-4">
      <h1 className="text-center text-xl sm:text-2xl font-bold p-4">
        Chapter: {chapter.chapter_number}
      </h1>

      <div className="flex flex-col items-center">
        {chapter.images && chapter.images.map((imageUrl, index) => (
            <img
              key={index}
              src={`https://manwha-production.up.railway.app/image-proxy?url=${encodeURIComponent(imageUrl)}`}
              alt={`Page ${index + 1}`}
              className="w-full max-w-4xl mb-2" // Added margin-bottom for spacing
            />
        ))}
      </div>
    </div>
  );
};