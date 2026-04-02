"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send,
  MapPin, Image as ImageIcon, Video, X, ChevronUp, Plus,
  Edit3, Trash2, Flag, EyeOff, Copy, Play, Pause,
  TrendingUp, Calendar, Users, Upload, Building2, GraduationCap,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { timeAgo, formatCount } from "@/lib/utils";
import { roleBadgeColors, roleLabels } from "@/lib/types";
import type { User, SocialPost, Comment, Role } from "@/lib/types";

// ─── Mock data ─────────────────────────────────────────────────────────────

const MOCK_USERS: User[] = [
  {
    id: "u1", firstName: "Sophie", lastName: "Martin", email: "sophie@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    city: "Lausanne", country: "Suisse", roles: ["hote"], activeRole: "hote",
    stats: { followers: 1240, following: 380, properties: 12, reviews: 89, rating: 4.8, transactions: 45, revenue: 125000 },
    bio: "Hôte passionnée", responseTime: "< 1h",
  },
  {
    id: "u2", firstName: "Marc", lastName: "Dubois", email: "marc@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    city: "Genève", country: "Suisse", roles: ["investisseur"], activeRole: "investisseur",
    stats: { followers: 3200, following: 150, properties: 24, reviews: 56, rating: 4.9, transactions: 120, revenue: 890000 },
    bio: "Investisseur immobilier",
  },
  {
    id: "u3", firstName: "Amira", lastName: "El Fassi", email: "amira@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    city: "Marrakech", country: "Maroc", roles: ["agence"], activeRole: "agence",
    stats: { followers: 5600, following: 420, properties: 85, reviews: 230, rating: 4.7, transactions: 300, revenue: 2400000 },
    bio: "Directrice Agence Fassi",
  },
  {
    id: "u4", firstName: "Thomas", lastName: "Weber", email: "thomas@e-dome.ch",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    city: "Zurich", country: "Suisse", roles: ["promoteur"], activeRole: "promoteur",
    stats: { followers: 2100, following: 90, properties: 6, reviews: 34, rating: 4.6, transactions: 18, revenue: 5600000 },
    bio: "Promoteur de projets haut de gamme",
  },
];

const MOCK_STORIES = [
  { id: "s1", user: MOCK_USERS[0], image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400", viewed: false },
  { id: "s2", user: MOCK_USERS[1], image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400", viewed: false },
  { id: "s3", user: MOCK_USERS[2], image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400", viewed: true },
  { id: "s4", user: MOCK_USERS[3], image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400", viewed: false },
];

const generatePosts = (count: number, startId: number = 1): SocialPost[] =>
  Array.from({ length: count }, (_, i) => {
    const user = MOCK_USERS[i % MOCK_USERS.length];
    const id = `p${startId + i}`;
    const contents = [
      `Nouvelle villa exceptionnelle disponible en #location-courte-duree à ${user.city}! \n\nVue panoramique, piscine privée et finitions haut de gamme. Idéal pour un séjour de luxe. @${MOCK_USERS[(i + 1) % MOCK_USERS.length].firstName.toLowerCase()} qu'en penses-tu ? \n\n#immobilier #luxe #${user.city.toLowerCase()}`,
      `Le marché immobilier en ${user.country} continue de montrer des signes positifs. Les investissements dans le #luxe restent solides avec un rendement moyen de 6.2%. @${MOCK_USERS[(i + 2) % MOCK_USERS.length].firstName.toLowerCase()} intéressant non ? \n\n#investissement #immobilier #tendances`,
      `Visite exclusive de ce penthouse au cœur de ${user.city}. 280m², terrasse de 60m², vue à 360°. Un bien d'exception. \n\n#penthouse #immobilier #${user.city.toLowerCase()} #luxe`,
      `Formation sur la gestion locative optimisée. Apprenez à maximiser vos revenus tout en offrant un service 5 étoiles à vos locataires. \n\n#formation #gestionlocative #revenus`,
      `Retour d'expérience : comment j'ai augmenté mon taux d'occupation de 65% à 92% en 3 mois grâce à E-Dome. Thread \n\n#AirbnbSuisse #LocationCourte #Conseils`,
    ];
    const mediaOptions = [
      ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
      ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"],
      ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
      [],
      ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"],
    ];
    const hoursAgo = (i + 1) * 3 + Math.floor(Math.random() * 10);
    const date = new Date(Date.now() - hoursAgo * 3600000).toISOString();
    const isReel = i % 5 === 2; // Every 5th post (index 2) is a reel
    return {
      id,
      author: user,
      content: contents[i % contents.length],
      media: isReel ? ["youtube:_DtWLPqqnwU"] : mediaOptions[i % mediaOptions.length],
      type: isReel ? "reel" as const : "post" as const,
      likes: Math.floor(Math.random() * 500) + 10,
      comments: [
        {
          id: `c${id}-1`,
          author: MOCK_USERS[(i + 1) % MOCK_USERS.length],
          content: "Magnifique bien ! Très intéressé.",
          createdAt: new Date(Date.now() - (hoursAgo - 1) * 3600000).toISOString(),
          likes: Math.floor(Math.random() * 20),
        },
        {
          id: `c${id}-2`,
          author: MOCK_USERS[(i + 2) % MOCK_USERS.length],
          content: "Superbe opportunité, je partage !",
          createdAt: new Date(Date.now() - (hoursAgo - 2) * 3600000).toISOString(),
          likes: Math.floor(Math.random() * 15),
        },
      ],
      createdAt: date,
      location: `${user.city}, ${user.country}`,
      property: i % 3 === 0
        ? {
            id: `prop${((i / 3) % 14) + 1}`,
            title: `Villa de luxe à ${user.city}`,
            description: "Villa exceptionnelle",
            type: "villa",
            transactionType: "vente",
            price: 1200000 + i * 150000,
            currency: "CHF",
            location: { city: user.city, country: user.country },
            images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"],
            host: user,
            bedrooms: 4 + (i % 3),
            bathrooms: 2 + (i % 2),
            area: 200 + i * 30,
            amenities: [],
            rating: 4.5 + (i % 5) * 0.1,
            reviewCount: 10 + i,
            analytics: {
              rendementBrut: 5.2 + (i % 3) * 0.3,
              rendementNet: 3.8 + (i % 3) * 0.2,
              prixM2: 6000 + i * 200,
              dpe: "B",
              etatGeneral: "Excellent",
              anneeConstruction: 2018 + (i % 5),
              potentielPlusValue: 12 + i,
              roi5ans: 28 + i * 2,
              roi10ans: 65 + i * 3,
              tauxOccupation: 85 + (i % 10),
            },
          }
        : undefined,
    };
  });

const TRENDING_HASHTAGS = [
  { tag: "#immobilier", count: 12400 },
  { tag: "#investissement", count: 8900 },
  { tag: "#luxe", count: 7200 },
  { tag: "#location", count: 5600 },
  { tag: "#suisse", count: 4300 },
];

const UPCOMING_EVENTS = [
  { id: "e1", title: "Salon immobilier Genève", date: "15 avril 2026", location: "Palexpo, Genève" },
  { id: "e2", title: "Webinar investissement", date: "22 avril 2026", location: "En ligne" },
];

const CURRENT_USER_ID = "u1";

export default function FeedPage() {
  const { formatPrice, toggleFollow, isFollowing, activeRole } = useApp();
  const [posts, setPosts] = useState<SocialPost[]>(() => generatePosts(5));
  const [activeTab, setActiveTab] = useState<"pour-vous" | "suivis" | "tendances">("pour-vous");
  const [showStoryViewer, setShowStoryViewer] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [viewedStories, setViewedStories] = useState<Set<string>>(() => new Set(MOCK_STORIES.filter((s) => s.viewed).map((s) => s.id)));
  const [showStoryUpload, setShowStoryUpload] = useState(false);

  // Create post
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostLocation, setNewPostLocation] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [newPostType, setNewPostType] = useState<"post" | "reel">("post");

  // Post interactions
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyTo, setReplyTo] = useState<Record<string, string>>({});
  const [shareMenuPost, setShareMenuPost] = useState<string | null>(null);
  const [moreMenuPost, setMoreMenuPost] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Infinite scroll
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Story viewer — mark as viewed + auto-close after 5s
  useEffect(() => {
    if (showStoryViewer === null) return;
    const story = MOCK_STORIES[showStoryViewer];
    if (story) {
      setViewedStories((prev) => new Set([...prev, story.id]));
    }
    setStoryProgress(0);
    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          setShowStoryViewer(null);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [showStoryViewer]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setPosts((prev) => [...prev, ...generatePosts(3, prev.length + 1)]);
            setLoadingMore(false);
          }, 800);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadingMore]);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + (likedPosts.has(postId) ? -1 : 1) } : p
      )
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const addComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    const newComment: Comment = {
      id: `c-new-${Date.now()}`,
      author: MOCK_USERS[0],
      content: replyTo[postId] ? `@${replyTo[postId]} ${text}` : text,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    setReplyTo((prev) => {
      const next = { ...prev };
      delete next[postId];
      return next;
    });
    setExpandedComments((prev) => new Set([...prev, postId]));
  };

  const createPost = () => {
    if (!newPostContent.trim()) return;
    const newPost: SocialPost = {
      id: `p-new-${Date.now()}`,
      author: MOCK_USERS[0],
      content: newPostContent,
      media: [],
      type: newPostType,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      location: newPostLocation || undefined,
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent("");
    setNewPostLocation("");
    setShowLocationInput(false);
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setMoreMenuPost(null);
  };

  const saveEdit = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, content: editContent } : p))
    );
    setEditingPost(null);
    setEditContent("");
  };

  // ─── Tab filtering ──────────────────────────────────────────────────────
  const filteredPosts = useMemo(() => {
    if (activeTab === "pour-vous") return posts;
    if (activeTab === "suivis") return posts.filter((p) => isFollowing(p.author.id));
    if (activeTab === "tendances") return [...posts].sort((a, b) => b.likes - a.likes);
    return posts;
  }, [posts, activeTab, isFollowing]);

  const renderContent = (content: string) => {
    return content.split(/([@#]\S+)/g).map((part, i) => {
      if (part.startsWith("@")) {
        return (
          <span key={i} className="text-[#C4956A] cursor-pointer hover:underline">
            {part}
          </span>
        );
      }
      if (part.startsWith("#")) {
        return (
          <Link key={i} href={`/recherche?q=${encodeURIComponent(part)}`} className="text-[#C4956A] hover:underline">
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-3xl mx-auto relative">
      {/* Stories bar */}
      <div className="mb-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 pb-2">
          {/* Your story */}
          <button
            onClick={() => setShowStoryUpload(true)}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[var(--text-muted)] flex items-center justify-center bg-[var(--card)] hover:border-[#C4956A] transition-colors">
              <Plus className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <span className="text-xs text-[var(--text-muted)]">Votre story</span>
          </button>
          {MOCK_STORIES.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => setShowStoryViewer(idx)}
              className="flex flex-col items-center gap-1.5 shrink-0"
            >
              <div
                className={`w-16 h-16 rounded-full p-0.5 ${
                  viewedStories.has(story.id) ? "bg-[var(--text-muted)]" : "bg-gradient-to-br from-[#C4956A] to-[#e8c89e]"
                }`}
              >
                <img
                  src={story.user.avatar}
                  alt={story.user.firstName}
                  className="w-full h-full rounded-full object-cover border-2 border-[var(--background)]"
                />
              </div>
              <span className="text-xs text-[var(--text-secondary)] truncate w-16 text-center">
                {story.user.firstName}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story viewer */}
      {showStoryViewer !== null && MOCK_STORIES[showStoryViewer] && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setShowStoryViewer(null)}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>
          {/* Progress bar */}
          <div className="absolute top-2 left-4 right-4 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{ width: `${storyProgress}%` }}
            />
          </div>
          {/* User info */}
          <div className="absolute top-6 left-4 flex items-center gap-3">
            <img
              src={MOCK_STORIES[showStoryViewer].user.avatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-white text-sm font-medium">
              {MOCK_STORIES[showStoryViewer].user.firstName} {MOCK_STORIES[showStoryViewer].user.lastName}
            </span>
          </div>
          {/* Story image */}
          <img
            src={MOCK_STORIES[showStoryViewer].image}
            alt=""
            className="max-h-[80vh] max-w-full object-contain rounded-xl"
          />
        </div>
      )}

      {/* Story upload overlay */}
      {showStoryUpload && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl w-[90vw] max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Créer une story</h3>
              <button
                onClick={() => setShowStoryUpload(false)}
                className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative border-2 border-dashed border-[var(--card-border)] rounded-xl p-10 text-center hover:border-[#C4956A]/50 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-sm font-medium text-[var(--foreground)] mb-1">
                Glissez une image ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-[var(--text-muted)]">JPG, PNG ou WEBP — max 10 Mo</p>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={() => setShowStoryUpload(false)}
              />
            </div>
            <button
              onClick={() => setShowStoryUpload(false)}
              className="w-full mt-4 py-3 rounded-xl bg-[#C4956A] hover:bg-[var(--gold-hover)] text-white font-medium transition-colors"
            >
              Publier la story
            </button>
          </div>
        </div>
      )}

      {/* Create post */}
      <div className="mb-6 p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
        <div className="flex gap-3">
          <img
            src={MOCK_USERS[0].avatar}
            alt=""
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Partagez une actualité, un bien, une idée..."
              maxLength={2000}
              rows={3}
              className="w-full bg-transparent text-[var(--foreground)] placeholder:text-[var(--text-muted)] resize-none outline-none text-sm"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)] transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)] transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowLocationInput(!showLocationInput)}
                  className={`p-2 rounded-lg transition-colors ${
                    showLocationInput ? "bg-[#C4956A]/10 text-[#C4956A]" : "hover:bg-[var(--hover-bg)] text-[var(--text-muted)]"
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                </button>
                {/* Post type selector */}
                <select
                  value={newPostType}
                  onChange={(e) => setNewPostType(e.target.value as "post" | "reel")}
                  className="text-xs bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg px-2 py-1 text-[var(--text-secondary)] outline-none"
                >
                  <option value="post">Post</option>
                  <option value="reel">Reel</option>
                </select>
                {/* Role-based options */}
                {(activeRole === "hote" || activeRole === "agence" || activeRole === "promoteur") && (
                  <button
                    className="flex items-center gap-1 p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)] transition-colors"
                    title="Attacher un bien"
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-xs hidden sm:inline">Bien</span>
                  </button>
                )}
                {activeRole === "formateur" && (
                  <button
                    className="flex items-center gap-1 p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)] transition-colors"
                    title="Attacher une formation"
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-xs hidden sm:inline">Formation</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-muted)]">
                  {newPostContent.length}/2000
                </span>
                <button
                  onClick={createPost}
                  disabled={!newPostContent.trim()}
                  className="px-4 py-2 rounded-xl bg-[#C4956A] hover:bg-[var(--gold-hover)] text-white text-sm font-medium transition-colors disabled:opacity-40"
                >
                  Publier
                </button>
              </div>
            </div>
            {showLocationInput && (
              <input
                type="text"
                value={newPostLocation}
                onChange={(e) => setNewPostLocation(e.target.value)}
                placeholder="Ajouter un lieu..."
                className="mt-2 w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A]"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main feed column */}
        <div className="flex-1 min-w-0">
          {/* Feed tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
            {(["pour-vous", "suivis", "tendances"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-[#C4956A] text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab === "pour-vous" ? "Pour vous" : tab === "suivis" ? "Suivis" : "Tendances"}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                <p className="text-sm text-[var(--text-secondary)]">
                  {activeTab === "suivis"
                    ? "Vous n'êtes abonné à personne pour le moment. Abonnez-vous à des utilisateurs pour voir leurs publications ici."
                    : "Aucune publication à afficher."}
                </p>
              </div>
            )}
            {filteredPosts.map((post, idx) => (
              <article
                key={post.id}
                className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] overflow-hidden animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Post header */}
                <div className="flex items-start justify-between p-4 pb-0">
                  <div className="flex items-center gap-3">
                    <Link href={`/profil/${post.author.id}`}>
                      <img
                        src={post.author.avatar}
                        alt={post.author.firstName}
                        className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/profil/${post.author.id}`}
                          className="text-sm font-semibold text-[var(--foreground)] hover:underline"
                        >
                          {post.author.firstName} {post.author.lastName}
                        </Link>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            roleBadgeColors[post.author.activeRole]
                          }`}
                        >
                          {roleLabels[post.author.activeRole]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        {post.location && (
                          <>
                            <MapPin className="w-3 h-3" />
                            <span>{post.location}</span>
                            <span>·</span>
                          </>
                        )}
                        <span>{timeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {/* More menu */}
                  <div className="relative">
                    <button
                      onClick={() => setMoreMenuPost(moreMenuPost === post.id ? null : post.id)}
                      className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-muted)] transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {moreMenuPost === post.id && (
                      <div className="absolute right-0 top-10 w-48 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl z-20 animate-scale-in overflow-hidden">
                        {post.author.id === CURRENT_USER_ID ? (
                          <>
                            <button
                              onClick={() => {
                                setEditingPost(post.id);
                                setEditContent(post.content);
                                setMoreMenuPost(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                            >
                              <Edit3 className="w-4 h-4" /> Modifier
                            </button>
                            <button
                              onClick={() => deletePost(post.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-[var(--hover-bg)] transition-colors"
                            >
                              <Trash2 className="w-4 h-4" /> Supprimer
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setMoreMenuPost(null)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                            >
                              <Flag className="w-4 h-4" /> Signaler
                            </button>
                            <button
                              onClick={() => setMoreMenuPost(null)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                            >
                              <EyeOff className="w-4 h-4" /> Ne plus afficher
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Post content */}
                <div className="px-4 py-3">
                  {editingPost === post.id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        maxLength={2000}
                        rows={4}
                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-3 text-sm text-[var(--foreground)] outline-none resize-none focus:border-[#C4956A]"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => saveEdit(post.id)}
                          className="px-4 py-2 rounded-lg bg-[#C4956A] text-white text-sm font-medium"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => setEditingPost(null)}
                          className="px-4 py-2 rounded-lg bg-[var(--hover-bg)] text-[var(--text-secondary)] text-sm"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--foreground)] whitespace-pre-line leading-relaxed">
                      {renderContent(post.content)}
                    </p>
                  )}
                </div>

                {/* Media grid */}
                {post.media.length > 0 && (
                  <div
                    className={`grid gap-0.5 ${
                      post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {post.media.map((src, mi) => (
                      <div key={mi} className="relative aspect-video bg-[var(--background)]">
                        {src.startsWith("youtube:") ? (
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${src.replace("youtube:", "")}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : src.includes("video") ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <video src={src} className="w-full h-full object-cover" />
                            <button className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-12 h-12 text-white" />
                            </button>
                          </div>
                        ) : (
                          <img src={src} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Property link card */}
                {post.property && (
                  <div className="mx-4 my-3 rounded-xl border border-[var(--card-border)] overflow-hidden hover:border-[#C4956A]/30 transition-colors">
                    <Link href={`/explorer/${post.property.id}`} className="flex gap-3 p-3">
                      <img
                        src={post.property.images[0]}
                        alt=""
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--foreground)] truncate">
                          {post.property.title}
                        </p>
                        <p className="text-sm font-bold text-[#C4956A] mt-1">
                          {formatPrice(post.property.price, post.property.currency)}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {post.property.bedrooms} ch · {post.property.area}m²
                        </p>
                        {post.property.transactionType === "vente" && post.property.analytics && (
                          <p className="text-xs text-green-400 mt-1">
                            Rendement: {post.property.analytics.rendementBrut.toFixed(1)}% brut
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                )}

                {/* Engagement bar */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--card-border)]">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                        likedPosts.has(post.id)
                          ? "text-red-400 bg-red-400/10"
                          : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                      <span className="text-sm">{formatCount(post.likes)}</span>
                    </button>
                    <button
                      onClick={() =>
                        setExpandedComments((prev) => {
                          const next = new Set(prev);
                          if (next.has(post.id)) next.delete(post.id);
                          else next.add(post.id);
                          return next;
                        })
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--hover-bg)] transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments.length}</span>
                    </button>
                    {/* Share */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShareMenuPost(shareMenuPost === post.id ? null : post.id)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--hover-bg)] transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      {shareMenuPost === post.id && (
                        <div className="absolute left-0 bottom-10 w-44 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl z-20 animate-scale-in overflow-hidden">
                          {[
                            { label: "Republier", icon: Share2 },
                            { label: "WhatsApp", icon: Send },
                            { label: "Email", icon: Send },
                            { label: "Copier le lien", icon: Copy },
                          ].map(({ label, icon: Icon }) => (
                            <button
                              key={label}
                              onClick={() => setShareMenuPost(null)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--hover-bg)] transition-colors"
                            >
                              <Icon className="w-4 h-4" />
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSave(post.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      savedPosts.has(post.id)
                        ? "text-[#C4956A] bg-[#C4956A]/10"
                        : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${savedPosts.has(post.id) ? "fill-current" : ""}`} />
                  </button>
                </div>

                {/* Comments */}
                {expandedComments.has(post.id) && (
                  <div className="px-4 pb-4 border-t border-[var(--card-border)] animate-fade-in">
                    <div className="space-y-3 pt-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2.5">
                          <img
                            src={comment.author.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/profil/${comment.author.id}`}
                                className="text-xs font-semibold text-[var(--foreground)] hover:underline"
                              >
                                {comment.author.firstName}
                              </Link>
                              <span className="text-xs text-[var(--text-muted)]">
                                {timeAgo(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                              {renderContent(comment.content)}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <button className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)]">
                                {comment.likes > 0 && `${comment.likes} `}J&apos;aime
                              </button>
                              <button
                                onClick={() =>
                                  setReplyTo((prev) => ({
                                    ...prev,
                                    [post.id]: comment.author.firstName,
                                  }))
                                }
                                className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)]"
                              >
                                Répondre
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Comment input */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--card-border)]">
                      <img
                        src={MOCK_USERS[0].avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 relative">
                        {replyTo[post.id] && (
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-xs text-[#C4956A]">
                              @{replyTo[post.id]}
                            </span>
                            <button
                              onClick={() =>
                                setReplyTo((prev) => {
                                  const next = { ...prev };
                                  delete next[post.id];
                                  return next;
                                })
                              }
                              className="text-[var(--text-muted)]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ""}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => e.key === "Enter" && addComment(post.id)}
                            placeholder="Écrire un commentaire..."
                            className="flex-1 px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#C4956A]"
                          />
                          <button
                            onClick={() => addComment(post.id)}
                            className="p-2 rounded-lg bg-[#C4956A] text-white hover:bg-[var(--gold-hover)] transition-colors disabled:opacity-40"
                            disabled={!commentInputs[post.id]?.trim()}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Infinite scroll loader */}
          <div ref={loaderRef} className="py-8 flex justify-center">
            {loadingMore && (
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#C4956A] animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar - desktop only */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          {/* Suggestions */}
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Suggestions</h3>
            <div className="space-y-3">
              {MOCK_USERS.slice(1).map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Link href={`/profil/${user.id}`}>
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/profil/${user.id}`}
                      className="text-sm font-medium text-[var(--foreground)] hover:underline truncate block"
                    >
                      {user.firstName} {user.lastName}
                    </Link>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {roleLabels[user.activeRole]}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                      isFollowing(user.id)
                        ? "bg-[var(--hover-bg)] text-[var(--text-secondary)]"
                        : "bg-[#C4956A] text-white"
                    }`}
                  >
                    {isFollowing(user.id) ? "Suivi" : "Suivre"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending hashtags */}
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C4956A]" />
              Tendances
            </h3>
            <div className="space-y-3">
              {TRENDING_HASHTAGS.map((item) => (
                <Link
                  key={item.tag}
                  href={`/recherche?q=${encodeURIComponent(item.tag)}`}
                  className="flex items-center justify-between group"
                >
                  <span className="text-sm text-[#C4956A] group-hover:underline">{item.tag}</span>
                  <span className="text-xs text-[var(--text-muted)]">{formatCount(item.count)}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming events */}
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C4956A]" />
              Événements à venir
            </h3>
            <div className="space-y-3">
              {UPCOMING_EVENTS.map((event) => (
                <div key={event.id} className="group cursor-pointer">
                  <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[#C4956A] transition-colors">
                    {event.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {event.date} · {event.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 md:bottom-8 right-6 z-30 w-10 h-10 rounded-full bg-[#C4956A] text-white flex items-center justify-center shadow-lg hover:bg-[var(--gold-hover)] transition-colors animate-scale-in"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
