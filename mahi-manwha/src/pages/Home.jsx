import {
  Search,
  Sun,
  User,
  Trash,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { ThreeDot } from "react-loading-indicators";
import { useRef } from "react";
import apiclient from "../api/Api";

const heroSlides = [
  {
    id: 1,
    title: "The Beginning After The End",
    description: "A king reborn into a world of magic and mystery.",
    image:
      "https://imgs.search.brave.com/3gp7VKRVEW6lcANFqR8thVbD--MZHUHM211mCP2wipY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtd2l4bXAtZWQz/MGE4NmI4YzRjYTg4/Nzc3MzU5NGMyLndp/eG1wLmNvbS9mLzZj/MTMwODQ4LTQ3MzMt/NDQ2OS05MmYzLWRl/ZDMwMjhmMzljZi9k/ZWwxNWwwLWFlNDBi/MjExLTJmMmUtNGI1/ZC1hN2FlLWRmMTRk/OTIxODFjNy5qcGc_/dG9rZW49ZXlKMGVY/QWlPaUpLVjFRaUxD/SmhiR2NpT2lKSVV6/STFOaUo5LmV5Snpk/V0lpT2lKMWNtNDZZ/WEJ3T2pkbE1HUXhP/RGc1T0RJeU5qUXpO/ek5oTldZd1pEUXhO/V1ZoTUdReU5tVXdJ/aXdpYVhOeklqb2lk/WEp1T21Gd2NEbzNa/VEJrTVRnNE9UZ3lN/alkwTXpjellUVm1N/R1EwTVRWbFlUQmtN/alpsTUNJc0ltOWlh/aUk2VzF0N0luQmhk/R2dpT2lJdlppODJZ/ekV6TURnME9DMDBO/ek16TFRRME5qa3RP/VEptTXkxa1pXUXpN/REk0WmpNNVkyWXZa/R1ZzTVRWc01DMWha/VFF3WWpJeE1TMHla/akpsTFRSaU5XUXRZ/VGRoWlMxa1pqRTBa/RGt5TVRneFl6Y3Vh/bkJuSW4xZFhTd2lZ/WFZrSWpwYkluVnli/anB6WlhKMmFXTmxP/bVpwYkdVdVpHOTNi/bXh2WVdRaVhYMC5f/SGszVmItOW1zdl9u/M3VfS2pHd1FoRkhG/aFdZWUxfT2JJa2hq/NUJDbWpF?q=80&w=1600",
  },
  {
    id: 2,
    title: "Tower of God",
    description: "Enter the tower and fight for your destiny.",
    image:
      "https://imgs.search.brave.com/M0B4SXet3p_OsRNLv-WwLgoUu-tpLuu2fK0HcC7FX4E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvNjM4/MjQ1MC5qcGc?q=80&w=1600",
  },
  {
    id: 3,
    title: "Omniscient Reader",
    description: "The world becomes a novel — and he knows the ending.",
    image:
      "https://imgs.search.brave.com/8qJms2bWHlldMnOBpc5Uk8fp8vntdWafLGhCl2tpZZc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzY5L2Qz/L2E1LzY5ZDNhNTU4/Nzg1NzJhZTZmMTU0/NjQ3YmI1Y2I5YzY2/LmpwZw?q=80&w=1600",
  },
];

const unreadCount = (chapters = []) => {
  return chapters.filter((ch) => !ch.read_status).length;
};

const unreadForRender = (chapters = []) => {
  const count = unreadCount(chapters);
  return count > 0 ? count : "";
};

const getTopSeriesList = (allSeries) => {
  if (!allSeries || allSeries.length === 0) return [];

  const seriesWithUnread = allSeries
    .filter((item) => unreadCount(item.chapters) > 0)
    .sort((a, b) => unreadCount(b.chapters) - unreadCount(a.chapters));

  const seriesWithoutUnread = allSeries.filter(
    (item) => unreadCount(item.chapters) === 0
  );

  let topList = seriesWithUnread.slice(0, 15);

  if (topList.length < 15) {
    const needed = 15 - topList.length;
    topList = topList.concat(seriesWithoutUnread.slice(0, needed));
  }

  console.log("Final Top List to be set:", topList);
  return topList;
};

const ManhwaCard = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const unread = (chapters = []) => {
    return unreadForRender(chapters);
  };
  const navigate = useNavigate();
  const handleImage = (seriesId) => {
    navigate(`/chapters/${seriesId}`);
  };
  const handledelete = async (seriesId) => {
    if (confirm("Do you wanna delete?")) {
      await apiclient.delete(`/series/${seriesId}`);
    }
  };
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -5 }}
      onClick={() => handleImage(item._id)}
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition"
    >
      <img
        src={item.cover_url}
        alt={item.title}
        className="w-full h-full object-cover"
      />
      <div
        className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white  shadow-lg"
        style={{ background: unread(item.chapters) ? "blue" : "transparent" }}
      >
        {unread(item.chapters)}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handledelete(item._id);
        }}
        className="absolute top-3 right-3 bg-black/50 p-2 rounded-full z-1"
      >
        <Trash size={18} />
      </button>

      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition duration-300 p-4 flex flex-col justify-end">
        <h3 className="text-white font-semibold text-lg truncate">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
          <span>Ch. {item.last_read}</span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${
              item.status === "reading" ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            {item.status}
          </span>
        </div>

        <div className="mt-3">
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div
              className="h-2 bg-white rounded-full"
              style={{
                width: `${parseInt(
                  ((item.chapters.length - unread(item.chapters)) /
                    item.chapters.length) *
                    100
                )}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">
            {parseInt(
              ((item.chapters.length - unread(item.chapters)) /
                item.chapters.length) *
                100
            )}
            %
          </p>
        </div>
      </div>

      <div className="absolute bottom-3 left-3 bg-red-800 text-white text-xs px-3 py-1 rounded-full">
        Ch. {item.chapters?.length}
      </div>
    </motion.div>
  );
};

const TopTenCard = ({ item, index }) => {
  const unread = (chapters = []) => {
    return unreadForRender(chapters);
  };
  const navigate = useNavigate();
  const handleImage = (seriesId) => {
    navigate(`/chapters/${seriesId}`);
  };
  const handledelete = async (seriesId) => {
    if (confirm("Do you wanna delete?")) {
      await apiclient.delete(`/series/${seriesId}`);
    }
  };
  return (
    <motion.div
      onClick={() => handleImage(item._id)}
      whileHover={{ scale: 1.05, y: -4 }}
      className="relative min-w-[70px] h-[120px] sm:min-w-[220px] sm:h-[320px] rounded-2xl overflow-hidden cursor-pointer group"
    >
      <img
        src={item.cover_url}
        alt={item.title}
        className="w-full h-full object-cover"
      />

      <div
        className="absolute top-3 left-1 sm:left-3 sm:w-9 sm:h-9 w-5 h-5 rounded-full flex items-center justify-center text-[5px] sm:text-[10px] font-bold text-white  shadow-lg"
        style={{ background: unread(item.chapters) ? "blue" : "transparent" }}
      >
        {unread(item.chapters)}
      </div>

      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition duration-300 p-4 flex flex-col justify-end">
        <h3 className="text-white font-semibold text-base truncate">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
          <span>Ch. {item.chapters?.length}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              item.status === "reading" ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            {item.status}
          </span>
        </div>

        <div className="mt-3">
          <div className="w-full h-1.5 bg-gray-700 rounded-full">
            <div
              className="h-1.5 bg-white rounded-full"
              style={{
                width: `${parseInt(
                  ((item.chapters.length - unread(item.chapters)) /
                    item.chapters.length) *
                    100
                )}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 text-right">
            {parseInt(
              ((item.chapters.length - unread(item.chapters)) /
                item.chapters.length) *
                100
            )}
            %
          </p>
        </div>
      </div>

      <div className="absolute bottom-3 left-1 sm:left-3 bg-red-800 text-white text-[5px] sm:text-xs px-1 sm:px-3 py-1 rounded-full">
        Ch. {item.chapters?.length}
      </div>
    </motion.div>
  );
};

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [current, setCurrent] = useState(0);
  const [topSeries, setTopSeries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // const queryClient = useQueryClient();
  const {
    data: series,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["series"],
    queryFn: () => apiclient.get("/series").then((res) => res.data),
    staleTime: 15000,
    refetchOnWindowFocus: false,
    retry: false,
    gcTime: 50000000,
    placeholderData: keepPreviousData,
  });
  const filteredSeries = series?.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const navigate = useNavigate();
  const nextSlide = () => setCurrent((prev) => (prev + 1) % heroSlides.length);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  const getUser = async () => {
    try {
      const token = localStorage.getItem("Token");

      const response = await apiclient.get("/auth/auth/me", {
        headers: {
          Authorization: `${token}`,
        },
      });
    } catch (error) {
      localStorage.clear("Token");
      navigate("/login");
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
      if (series) {
        const calculatedTopSeries = getTopSeriesList(series);
        setTopSeries(calculatedTopSeries);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [series]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!searchRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchList = async (seriesId) => {
    try {
      const response = await apiclient.get(`/series/${seriesId}`);
      const list = await response.data;
      return list.chapters;
    } catch (error) {
      console.error(error);
    }
  };
  const handlelast = async (ch_no, seriesId) => {
    const chapters = await fetchList(seriesId);
    console.log(chapters);
    const chapter = chapters.find((ch) => ch.chapter_number == ch_no);
    navigate(`/${seriesId}/chapter/${chapter._id}`);
  };
  if (isLoading) {
    return (
      <div className=" p-5 min-h-screen  text-white text-center loader w-lvw h-1">
        <ThreeDot color="white" size="medium" text="" textColor="" />
      </div>
    );
  }
  if (isError) {
    console.log(series);
    return (
      <div className="p-5 min-h-screen  text-red-400 text-center">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pb-24">
      <div className="flex items-center gap-4 px-8 py-5">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl font-bold">
          <img src="./icon.png" alt="" className="rounded-xl" />
        </div>

        <div ref={searchRef} className="relative flex-1">
          <div className="flex items-center bg-white/10 rounded-full px-5 py-3 border border-white/10">
            <Search size={18} className="text-gray-400 mr-2" />
            <form
              onSubmit={() => navigate(`/search/${searchQuery}`)}
              className="flex"
            >
              <input
                placeholder="manhwa..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="bg-transparent outline-none w-full text-white placeholder-gray-400"
              />
              <button type="submit" className="absolute end pr-5 "></button>
            </form>
          </div>

          {showDropdown && searchQuery && filteredSeries?.length > 0 && (
            <div className="absolute top-full mt-3 w-full bg-[#111] border border-white/10 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50">
              {filteredSeries.slice(0, 6).map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/chapters/${item._id}`);
                    setShowDropdown(false);
                    setSearchQuery("");
                  }}
                  className="px-2 sm:px-4 py-1 sm:py-3 hover:bg-white/10 cursor-pointer transition flex items-center gap-3"
                >
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="sm:w-10 sm:h-14 w-5 h-9 object-cover rounded-md"
                  />
                  <span className="text-[7px] sm:text-sm">{item.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Sun className="text-yellow-400 cursor-pointer" />
        <User className="cursor-pointer" onClick={() => navigate("/profile")} />
      </div>

      <div className="relative mx-4 sm:mx-6 lg:mx-8 h-[260px] sm:h-[380px] md:h-[480px] rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={heroSlides[current].id}
            src={heroSlides[current].image}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent flex items-center px-6 sm:px-12">
          <div className="max-w-xs sm:max-w-md">
            <h1 className="text-2xl sm:text-4xl font-bold leading-tight">
              {heroSlides[current].title}
            </h1>

            <p className="text-gray-300 mt-3 text-sm sm:text-base">
              {heroSlides[current].description}
            </p>

            <button className="mt-5 bg-white text-black px-5 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base">
              Continue Reading
            </button>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-black/50 p-2 sm:p-3 rounded-full"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-black/50 p-2 sm:p-3 rounded-full"
        >
          <ChevronRight />
        </button>
      </div>
      <section className="px-8 mt-2 sm:mt-16">
        <h2 className="text-sm sm:text-3xl font-bold mb-2 sm:mb-8 flex items-center gap-3">
          Recent Read's
        </h2>

        <div className="flex gap-2 sm:gap-6 overflow-x-auto sm:pb-4 scrollbar-hide">
          {topSeries?.map((item, index) => (
            <TopTenCard key={item._id} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="px-8 mt-2 sm:mt-14">
        <div className="flex justify-between items-center mb-2 sm:mb-8">
          <h2 className="text-sm sm:text-3xl font-bold">Manwha's</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {filteredSeries?.map((item) => (
            <ManhwaCard key={item._id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};
