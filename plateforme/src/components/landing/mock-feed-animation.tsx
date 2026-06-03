"use client";

import { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Home, Search, Plus, User, Bell } from "lucide-react";

const stories = [
  { name: "Votre story", color: "from-[#1262b3] to-[#1262b3]", initials: "+" },
  { name: "Sophie M.", color: "from-pink-500 to-rose-500", initials: "SM" },
  { name: "Marc D.", color: "from-blue-500 to-cyan-500", initials: "MD" },
  { name: "Amira F.", color: "from-purple-500 to-violet-500", initials: "AF" },
  { name: "Thomas W.", color: "from-[#1262b3] to-green-500", initials: "TW" },
];

const posts = [
  {
    author: "Sophie Martin",
    initials: "SM",
    role: "Hôte",
    roleColor: "bg-[#1262b3]/20 text-[#1262b3]",
    time: "2h",
    text: "Nouvelle villa disponible à Lausanne ! Vue lac imprenable, 4 chambres, piscine. Rendement locatif estimé à 6.2%",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=70",
    likes: 124,
    comments: 18,
    hashtags: ["#Lausanne", "#Investissement", "#VueLac"],
  },
  {
    author: "Marc Dubois",
    initials: "MD",
    role: "Investisseur",
    roleColor: "bg-[#1262b3]/20 text-[#1262b3]",
    time: "5h",
    text: "Mon analyse du marché immobilier genevois Q1 2026 : les prix se stabilisent, opportunités en périphérie",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=70",
    likes: 89,
    comments: 32,
    hashtags: ["#Genève", "#Analyse", "#Marché"],
  },
];

export function MockFeedAnimation() {
  const [activeStory, setActiveStory] = useState(-1);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [visiblePost, setVisiblePost] = useState(0);
  const [showNotif, setShowNotif] = useState(false);

  // Auto-cycle stories
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % stories.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-like first post
  useEffect(() => {
    const t1 = setTimeout(() => setLikedPosts([0]), 3000);
    const t2 = setTimeout(() => setShowNotif(true), 4500);
    const t3 = setTimeout(() => setShowNotif(false), 7000);
    const t4 = setTimeout(() => setVisiblePost(1), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  // Reset animation loop
  useEffect(() => {
    const loop = setInterval(() => {
      setLikedPosts([]);
      setVisiblePost(0);
      setShowNotif(false);
      setTimeout(() => setLikedPosts([0]), 3000);
      setTimeout(() => setShowNotif(true), 4500);
      setTimeout(() => setShowNotif(false), 7000);
      setTimeout(() => setVisiblePost(1), 5000);
    }, 10000);
    return () => clearInterval(loop);
  }, []);

  return (
    <div className="w-full h-full bg-white chamfer overflow-hidden relative flex flex-col" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 text-[#6b7280] text-[10px]">
        <span>9:41</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 border border-white/30 chamfer-xs relative">
            <div className="absolute inset-[1px] right-[2px] bg-emerald-400 chamfer-xs" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-[#1a1a1a] font-bold text-sm">E-<span className="text-[#1262b3]">Dome</span></span>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell size={16} className="text-[#4b5563]" />
            {showNotif && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#1262b3] chamfer-lg animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Stories bar */}
      <div className="flex gap-4 px-4 py-4 overflow-hidden">
        {stories.map((story, i) => (
          <div key={story.name} className="flex flex-col items-center gap-2 shrink-0">
            <div
              className={`w-12 h-12 chamfer-lg flex items-center justify-center text-[10px] font-bold text-[#1a1a1a] transition-all duration-500 ${
                activeStory === i ? "scale-110 ring-2 ring-[#1262b3]" : ""
              }`}
              style={{
                background: i === 0 ? "#1a1a1a" : undefined,
                border: i === 0 ? "2px dashed rgba(30, 157, 242,0.5)" : undefined,
              }}
            >
              {i === 0 ? (
                <Plus size={16} className="text-[#1262b3]" />
              ) : (
                <div className={`w-full h-full chamfer-lg bg-gradient-to-br ${story.color} flex items-center justify-center`}>
                  {story.initials}
                </div>
              )}
            </div>
            <span className="text-[#6b7280] text-[8px] truncate w-12 text-center">{story.name}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#f9fafb] mx-4" />

      {/* Feed */}
      <div className="flex-1 overflow-hidden px-0">
        {posts.map((post, i) => (
          <div
            key={post.author}
            className="transition-all duration-700"
            style={{
              opacity: i <= visiblePost ? 1 : 0,
              transform: i <= visiblePost ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {/* Post header */}
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="w-8 h-8 chamfer-lg bg-gradient-to-br from-[#1262b3] to-[#1262b3] flex items-center justify-center text-[9px] font-bold text-black">
                {post.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[#1a1a1a] text-xs font-medium">{post.author}</span>
                  <span className={`text-[8px] px-2 py-0 chamfer-lg ${post.roleColor}`}>{post.role}</span>
                </div>
                <span className="text-[#9ca3af] text-[9px]">{post.time}</span>
              </div>
              <MoreHorizontal size={14} className="text-[#9ca3af]" />
            </div>

            {/* Post text */}
            <p className="text-[#374151] text-[10px] leading-relaxed px-4 mb-2">{post.text}</p>

            {/* Hashtags */}
            <div className="flex gap-2 px-4 mb-2">
              {post.hashtags.map((tag) => (
                <span key={tag} className="text-[#1262b3]/60 text-[9px]">{tag}</span>
              ))}
            </div>

            {/* Post image */}
            <div className="relative mx-2 chamfer-sm overflow-hidden mb-2">
              <img src={post.image} alt="" className="w-full h-28 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 px-4 py-2">
              <button className="flex items-center gap-2">
                <Heart
                  size={14}
                  className={`transition-all duration-300 ${
                    likedPosts.includes(i) ? "text-red-500 fill-red-500 scale-125" : "text-[#6b7280]"
                  }`}
                />
                <span className={`text-[10px] ${likedPosts.includes(i) ? "text-[#6b7280]" : "text-[#6b7280]"}`}>
                  {post.likes + (likedPosts.includes(i) ? 1 : 0)}
                </span>
              </button>
              <button className="flex items-center gap-2">
                <MessageCircle size={14} className="text-[#6b7280]" />
                <span className="text-[#6b7280] text-[10px]">{post.comments}</span>
              </button>
              <button><Share2 size={14} className="text-[#6b7280]" /></button>
              <div className="flex-1" />
              <button><Bookmark size={14} className="text-[#6b7280]" /></button>
            </div>

            <div className="h-px bg-[#f9fafb] mx-4" />
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-around py-2 border-t border-white/5 bg-white">
        <Home size={16} className="text-[#1262b3]" />
        <Search size={16} className="text-[#9ca3af]" />
        <div className="w-8 h-8 chamfer-lg bg-[#1262b3] flex items-center justify-center -mt-4 shadow-lg shadow-[#1262b3]/20">
          <Plus size={16} className="text-black" />
        </div>
        <MessageCircle size={16} className="text-[#9ca3af]" />
        <User size={16} className="text-[#9ca3af]" />
      </div>

      {/* Notification toast */}
      {showNotif && (
        <div
          className="absolute top-12 left-3 right-3 chamfer-sm p-4 flex items-center gap-4 animate-slide-up"
          style={{ background: "rgba(30, 157, 242, 0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(30, 157, 242,0.3)" }}
        >
          <div className="w-8 h-8 chamfer-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-[9px] font-bold text-[#1a1a1a] shrink-0">AF</div>
          <div className="flex-1 min-w-0">
            <p className="text-[#1a1a1a] text-[10px] font-medium">Amira F. a aimé votre bien</p>
            <p className="text-[#6b7280] text-[8px]">Villa Lausanne — il y a 2 min</p>
          </div>
          <Heart size={12} className="text-[#6b7280] fill-[#6b7280] shrink-0" />
        </div>
      )}
    </div>
  );
}
