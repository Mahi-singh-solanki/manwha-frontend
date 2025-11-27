import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiclient from "../api/Api";
import { ThreeDot } from "react-loading-indicators";

export const List = () => {
    const { seriesId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // --- Data Fetching ---
    const { data: series, isLoading, isError, error } = useQuery({
        // 1. DYNAMIC QUERY KEY: Includes seriesId to make it unique
        queryKey: ["series", seriesId],
        // The query function is cleaner without the unnecessary try/catch
        queryFn: () => apiclient.get(`/series/${seriesId}`).then((res) => res.data),
    });

    // --- Mutation for Marking Chapters as Read ---
    const markAllReadMutation = useMutation({
        mutationFn: async () => {
            // Filter for only unread chapters to update
            const unreadChapters = series.chapters.filter(ch => !ch.read_status);
            
            // Create an array of promises for all PATCH requests
            await apiclient.post(`/chapters/series/${seriesId}/read`)
        },
        onSuccess: () => {
            // 2. On success, invalidate the query to refetch the fresh data
            queryClient.invalidateQueries({ queryKey: ["series", seriesId] });
            // You can optionally still navigate away if that's the desired UX
            // navigate("/");
        },
        onError: (err) => {
            console.error("Failed to mark all as read:", err);
        }
    });

    const handleChapter = (chapter_id) => {
        navigate(`/${seriesId}/chapter/${chapter_id}`);
    };

    // --- Render Logic ---

    // 3. HANDLE LOADING AND ERROR STATES to prevent crashes
    if (isLoading) {
        return <div className=" p-5 min-h-screen bg-black text-white text-center loader w-lvw h-1"><ThreeDot color="white" size="medium" text="" textColor="" /></div>;
    }
    if (isError) {
        return <div className="p-5 min-h-screen bg-gray-800 text-red-400 text-center">Error: {error.message}</div>;
    }

    return (
        <div className="bg-black min-h-screen w-full p-4">
            <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="border-2 border-gray-700 rounded-md p-4 flex justify-center items-center cursor-pointer bg-gray-900 hover:bg-purple-600 hover:border-purple-500 transition-colors mb-5 text-white disabled:opacity-50"
            >
                {markAllReadMutation.isPending ? 'Updating...' : 'Mark All as Read'}
            </button>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* 4. CORRECT DATA MAPPING: Map over series.chapters */}
                {series.chapters.map((chapter) => (
                    <li
                        onClick={() => handleChapter(chapter._id)}
                        key={chapter._id}
                        className="border-2 border-gray-700 rounded-md p-4 flex justify-center items-center cursor-pointer bg-gray-900 hover:bg-gray-600 hover:border-gray-500 transition-colors"
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
    );
};