import { Home, Heart, Plus, Clock, User,BookCheck  } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";

export const Footer=()=> {
  const [active, setActive] = useState("Home");
    const navigate=useNavigate()
  const handleClick=(name)=>{
    navigate(`/${name}`)
}
  const tabs = [
    { name: "Home", icon: Home,link:"" },
    { name: "Completed", icon: BookCheck,link:"completed" },
    { name: "Add", icon: Plus,link:"add" },
    { name: "Updates", icon: Clock,link:"updated" },
    { name: "Profile", icon: User,link:"profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#1a1416] border-t border-white/10 backdrop-blur-lg z-2">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.name;

          return (
            <motion.button
              key={tab.name}
              whileTap={{ scale: 0.9 }}
              onClick={() => {setActive(tab.name)
                handleClick(tab.link)
              }}
              className="relative flex flex-col items-center text-sm"
            >
              
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -top-2 w-1 h-1 rounded-full bg-purple-500"
                />
              )}

              <Icon
                size={22}
                className={`transition-colors duration-300 ${
                  isActive
                    ? "text-purple-500"
                    : "text-gray-400 hover:text-white"
                }`}
              />

              <span
                className={`mt-1 text-xs transition-colors duration-300 ${
                  isActive
                    ? "text-purple-400"
                    : "text-gray-400"
                }`}
              >
                {tab.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
