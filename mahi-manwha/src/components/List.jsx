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
        queryKey: ["series", seriesId],
        queryFn: async() => {const currseries=await apiclient.get(`/series/${seriesId}`).then((res) => res.data)
    console.log(currseries)
return currseries
},
    });
    const markCompleteMutation=useMutation({
        mutationFn:async ()=>{
            await apiclient.put(`/series/complete/${seriesId}`)
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["series",seriesId]});
        },
        onError: (err) => {
            console.error("Failed to mark as Completed:", err);
        }
    })


    const markAllReadMutation = useMutation({
        mutationFn: async () => {
            await apiclient.post(`/chapters/series/${seriesId}/read`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["series", seriesId] });
        },
        onError: (err) => {
            console.error("Failed to mark all as read:", err);
        }
    });

    const handleChapter = (chapter_id) => {
        navigate(`/${seriesId}/chapter/${chapter_id}`);
    };

    if (isLoading) {
        return <div className=" p-5 min-h-screen bg-black text-white text-center loader w-lvw h-1"><ThreeDot color="white" size="medium" text="" textColor="" /></div>;
    }
    if (isError) {
        return <div className="p-5 min-h-screen bg-gray-800 text-red-400 text-center">Error: {error.message}</div>;
    }

    return (
        <div className="bg-black min-h-screen w-full p-4">
            <div className="flex text-white gap-5">
                <img className="w-30 rounded-md h-40 sm:w-100 sm:h-120" src={series.cover_url} alt={series.title} />
                <div>
                    <h1 className="text-[13px] sm:text-6xl"><b>Name : </b>{series.title}</h1>
                    <p className="text-[13px] sm:text-6xl"><b>Total Chapter : </b>{series.chapters[series.chapters.length-1].chapter_number}</p>
                    <div className="flex-col sm:gap-297 mt-1">
                <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="border-2 border-gray-700 rounded-md p-1 sm:w-80 sm:text-4xl sm:mt-5 sm:p-4 flex justify-center items-center cursor-pointer bg-gray-900 hover:bg-purple-600 hover:border-purple-500 w-25 text-[12px] transition-colors mb-5 text-white disabled:opacity-50"
            >
                {markAllReadMutation.isPending ? 'Updating...' : 'Mark All as Read'}
            </button>
            <button
                onClick={() => markCompleteMutation.mutate()}
                disabled={markCompleteMutation.isPending}
                className="border-2 border-gray-700 -mt-3 rounded-md p-1 text-[12px] w-27 sm:w-80 sm:text-4xl sm:mt-5 sm:p-4 flex justify-center items-center cursor-pointer bg-gray-900 hover:bg-purple-600 hover:border-purple-500 transition-colors mb-5 text-white disabled:opacity-50"
            >
                {markCompleteMutation.isPending ? 'Updating...' : 'Mark as complete'}
            </button>
            </div>
                </div>
            </div>
            
            <ul className="grid grid-cols-2 sm:grid-cols-3 mt-4 md:grid-cols-4 lg:grid-cols-5 gap-4">
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