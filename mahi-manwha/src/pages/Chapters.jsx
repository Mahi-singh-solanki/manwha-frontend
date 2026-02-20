import { ArrowLeft, Star, BookOpen, Clock, Heart } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import { motion } from "framer-motion";
// import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import apiclient from "../api/Api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const Chapters = () => {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: series,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["series", seriesId],
    queryFn: async () => {
      const currseries = await apiclient
        .get(`/series/${seriesId}`)
        .then((res) => res.data);
      console.log(currseries);
      return currseries;
    },
  });
  const handleChapter = (chapter_id) => {
    navigate(`/${seriesId}/chapters/${chapter_id}`);
  };
  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      await apiclient.put(`/series/complete/${seriesId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series", seriesId] });
    },
    onError: (err) => {
      console.error("Failed to mark as Completed:", err);
    },
  });
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await apiclient.post(`/chapters/series/${seriesId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series", seriesId] });
    },
    onError: (err) => {
      console.error("Failed to mark all as read:", err);
    },
  });
  if (isLoading) {
    return (
      <div className=" p-5 min-h-screen bg-black text-white text-center loader w-lvw h-1">
        <ThreeDot color="white" size="medium" text="" textColor="" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-5 min-h-screen bg-gray-800 text-red-400 text-center">
        Error: {error.message}
      </div>
    );
  }
  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-[#0B0F19] to-[#111827] pb-24">
      <div
        className="px-10 py-5 flex items-center gap-3 bg-black/40 backdrop-blur-md sticky top-0 z-50"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="cursor-pointer" />
        <span className="text-lg font-medium">Back</span>
      </div>

      <div className="relative px-10 py-14 flex sm:flex-row flex-col gap-12 items-center overflow-hidden">
        <div className="absolute inset-0 blur-3xl" />

        <motion.img
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          src={series.cover_url}
          alt={series.title}
          className="relative w-[130px] sm:w-[260px] rounded-2xl shadow-2xl"
        />

        <div className="relative max-w-3xl">
          <h1 className="text-sm sm:text-5xl font-bold mb-4">{series.title}</h1>

          <div className="grid sm:grid-cols-4 gap-2 sm:gap-6 mb-8">
            <div className="bg-white/5 p-2 px-7 sm:p-5 rounded-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <BookOpen size={16} /> Chapters
              </div>
              <p className="text-sm sm:text-2xl text-center font-bold mt-2">
                {series.chapters.length}
              </p>
            </div>

            <div className="bg-white/5 p-2 px-7 sm:p-5 rounded-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock size={16} /> Status
              </div>
              <p className="text-sm sm:text-2xl text-center font-bold text-blue-400 mt-2">
                {series.status}
              </p>
            </div>

            <div className="bg-white/5 p-2 px-7 sm:p-5 rounded-2xl backdrop-blur-md">
              <div className="text-gray-400 text-sm">Last Update</div>
              <p className="text-lg font-medium mt-2">
                {series.updated_at.slice(0, 10)}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-row flex-col gap-4">
            <button
              className="bg-white/5 sm:px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
              onClick={() => handleChapter(series.chapters[0]._id)}
            >
              Start Reading
            </button>

            <button
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="bg-white/5 sm:px-6 px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-white/10 transition"
            >
              {markAllReadMutation.isPending
                ? "Updating..."
                : "Mark All as Read"}
            </button>
            <button
              onClick={() => markCompleteMutation.mutate()}
              disabled={markCompleteMutation.isPending}
              className="bg-white/5 sm:px-6 px-3 py-3 rounded-xl flex items-center gap-2 hover:bg-white/10 transition"
            >
              {markCompleteMutation.isPending
                ? "Updating..."
                : "Mark as complete"}
            </button>
          </div>
        </div>
      </div>

      <div className="px-10 mt-16">
        <h2 className="text-3xl font-bold mb-10">
          Chapters ({series.chapters.length})
        </h2>

        <div className="flex flex-col gap-6">
          {series.chapters.map((chapter) => (
            <motion.div
              whileHover={{ scale: 1.01 }}
              key={chapter.chapter_number}
              className="flex items-center justify-between bg-white/5 p-6 rounded-2xl backdrop-blur-md border border-white/10"
            >
              <div className="flex items-center gap-6">
                <div>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: chapter.read_status ? "gray" : "white" }}
                  >
                    Chapter {chapter.chapter_number}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {chapter.release_date.slice(0, 10)}
                  </p>
                </div>
              </div>

              <button
                className="bg-purple-600/30 hover:bg-purple-900/50 px-6 py-2 rounded-xl transition"
                onClick={() => handleChapter(chapter._id)}
              >
                Read
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
