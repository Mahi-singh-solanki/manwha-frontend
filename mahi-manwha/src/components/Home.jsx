import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiclient from "../api/Api";

export const Home = () => {
    // State for controlled inputs remains in useState
    const [url, setUrl] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    
    // Access the global query client provided in App.jsx
    const queryClient = useQueryClient();

    // --- Data Fetching ---
    const { data: series, isLoading, isError, error } = useQuery({
        // Use a descriptive and unique query key
        queryKey: ["series"],
        // The query function should return the promise
        queryFn: () => apiclient.get("/series").then(res => res.data),
        staleTime:15000,
        refetchOnWindowFocus: false,
        retry: false,
    });

    // --- Mutations (for CUD operations) ---

    // Mutation for adding a new series
    const addSeriesMutation = useMutation({
        mutationFn: (newSeriesUrl) => apiclient.post("/series", { source_url: newSeriesUrl }),
        onSuccess: () => {
            // Invalidate and refetch the series query after a successful post
            queryClient.invalidateQueries({ queryKey: ["series"] });
        },
        onError: (err) => {
            console.error("Error adding series:", err);
            // Optionally: show a toast notification to the user
        }
    });

    // Mutation for refreshing all series
    const refreshAllMutation = useMutation({
        mutationFn: () => apiclient.post("/series/refresh-all"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["series"] });
        },
        onError: (err) => {
            console.error("Error refreshing series:", err);
        }
    });

    // --- Event Handlers ---

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url) return;
        addSeriesMutation.mutate(url);
        setUrl(""); // Reset input field
    };

    const handleImage = (seriesId) => {
        navigate(`/list/${seriesId}`);
    };
    
    // --- Helper Functions ---
    const unread = (chapters = []) => {
        const unreadCount = chapters.filter(ch => !ch.read_status).length;
        return unreadCount > 0 ? unreadCount : "";
    };
    
    // --- Render Logic ---

    // Handle loading and error states first
    if (isLoading) {
        return <div className="p-5 min-h-screen bg-gray-800 text-white text-center">Loading series...</div>;
    }
    if (isError) {
        return <div className="p-5 min-h-screen bg-gray-800 text-red-400 text-center">Error: {error.message}</div>;
    }

    // Filter series only after data has been successfully loaded
    const filteredSeries = series.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-5 min-h-screen bg-gray-800 flex flex-col gap-4">
            <button
                onClick={() => refreshAllMutation.mutate()}
                disabled={refreshAllMutation.isPending}
                className="border-2 border-gray-700 rounded-md p-4 flex justify-center items-center cursor-pointer bg-gray-900 hover:bg-purple-600 hover:border-purple-500 transition-colors w-36 mb-5 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {refreshAllMutation.isPending ? 'Refreshing...' : 'Refresh All'}
            </button>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search for a manhwa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-xl mx-auto block p-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-6">
                <input
                    type="text"
                    className="text-white bg-transparent border-2 rounded-md p-2 w-full sm:w-1/2"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter series URL"
                />
                <button
                    className="text-white border-2 border-white px-4 py-2 rounded-md hover:bg-white hover:text-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={addSeriesMutation.isPending}
                >
                    {addSeriesMutation.isPending ? 'Submitting...' : 'Submit'}
                </button>
            </form>

            <ul className="text-white grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mt-6">
                {filteredSeries.map((currelem) => (
                    <li
                        className="flex flex-col items-center text-center"
                        key={currelem._id}
                    >
                        <div>
                            <div style={{width:"32px", height:"32px", background: unread(currelem.chapters) ? "red" : "transparent", borderRadius: unread(currelem.chapters) ? "100px" : "0px", padding: unread(currelem.chapters) ? "8px" : "0px"}} className="flex justify-center items-center relative top-9 left-27">
                                <p>{unread(currelem.chapters)}</p>
                            </div>
                            <img
                                onClick={() => handleImage(currelem._id)}
                                className="cursor-pointer w-36 h-48 object-cover rounded-md shadow"
                                src={currelem.cover_url}
                                alt={currelem.title}
                            />
                        </div>
                        <p className="mt-2 text-sm sm:text-base">
                            <b>Name: </b>{currelem.title}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};