"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send,
  MapPin, Video, X, ChevronUp, Plus,
  Edit3, Trash2, Flag, EyeOff, Copy, Play, Pause,
  TrendingUp, Calendar, Users, Building2, GraduationCap,
  UserPlus,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { LottiePlayer } from "@/components/ui/lottie-player";
import { StoryViewer } from "@/components/ui/story-viewer";
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

// Stories regroupées par hôte — alimentent le composant <StoryViewer />.
// Chaque user possède 2 à 4 stories (mix images Unsplash haute résolution
// 9:16 + miniatures vidéos pour la démo). Les URLs Unsplash sont déjà
// utilisées ailleurs dans la démo, donc le navigateur les met en cache.
import type { Story as StoryItem } from "@/components/ui/story-viewer";

const MOCK_STORY_FEEDS: Array<{
  user: User;
  timestamp: string;
  stories: StoryItem[];
}> = [
  {
    user: MOCK_USERS[0], // Sophie — hôte Lausanne
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    stories: [
      { id: "sophie-1", type: "image", src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=720&h=1280&fit=crop" },
      { id: "sophie-2", type: "image", src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=720&h=1280&fit=crop" },
      { id: "sophie-3", type: "image", src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=720&h=1280&fit=crop" },
    ],
  },
  {
    user: MOCK_USERS[1], // Marc — investisseur Genève
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    stories: [
      { id: "marc-1", type: "image", src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=720&h=1280&fit=crop" },
      { id: "marc-2", type: "image", src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=720&h=1280&fit=crop" },
    ],
  },
  {
    user: MOCK_USERS[2], // Amira — agence Marrakech
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    stories: [
      { id: "amira-1", type: "image", src: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=720&h=1280&fit=crop" },
      { id: "amira-2", type: "image", src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=720&h=1280&fit=crop" },
      { id: "amira-3", type: "image", src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=720&h=1280&fit=crop" },
      { id: "amira-4", type: "image", src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=720&h=1280&fit=crop" },
    ],
  },
  {
    user: MOCK_USERS[3], // Thomas — promoteur Zurich
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    stories: [
      { id: "thomas-1", type: "image", src: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=720&h=1280&fit=crop" },
      { id: "thomas-2", type: "image", src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=720&h=1280&fit=crop" },
    ],
  },
];

const generatePosts = (count: number, startId: number = 1): SocialPost[] =>
  Array.from({ length: count }, (_, i) => {
    // Avoid duplicate Sophie posts: index 4 uses Amira instead of cycling back to Sophie
    const user = i % MOCK_USERS.length === 0 && i > 0 ? MOCK_USERS[2] : MOCK_USERS[i % MOCK_USERS.length];
    const id = `p${startId + i}`;
    const contents = [
      `Nouvelle villa exceptionnelle disponible en #location-courte-duree à ${user.city}! \n\nVue panoramique, piscine privée et finitions haut de gamme. Idéal pour un séjour de luxe. @${MOCK_USERS[(i + 1) % MOCK_USERS.length].firstName.toLowerCase()} qu'en penses-tu ? \n\n#immobilier #luxe #${user.city.toLowerCase()}`,
      `Le marché immobilier en ${user.country} continue de montrer des signes positifs. Les investissements dans le #luxe restent solides avec un rendement moyen de 6.2%. @${MOCK_USERS[(i + 2) % MOCK_USERS.length].firstName.toLowerCase()} intéressant non ? \n\n#investissement #immobilier #tendances`,
      `Visite exclusive de ce penthouse au cœur de ${user.city}. 280m², terrasse de 60m², vue à 360°. Un bien d'exception. \n\n#penthouse #immobilier #${user.city.toLowerCase()} #luxe`,
      `Formation sur la gestion locative optimisée. Apprenez à maximiser vos revenus tout en offrant un service 5 étoiles à vos locataires. \n\n#formation #gestionlocative #revenus`,
      `Nouveau riad disponible à la vente en Médina ! 200m², patio central, 4 suites, hammam privé. Rentabilité locative exceptionnelle : 9.5% brut. #riad #marrakech #investissement`,
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
    return {
      id,
      author: user,
      content: contents[i % contents.length],
      media: mediaOptions[i % mediaOptions.length],
      type: "post" as const,
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
        // Pre-loaded contextual comment per post
        ...(i === 0 ? [{
          id: `c${id}-3`,
          author: MOCK_USERS[1], // Marc Dubois
          content: "Belle propriété ! La vue lac est un argument de vente redoutable \uD83C\uDFAF",
          createdAt: new Date(Date.now() - (hoursAgo - 2.5) * 3600000).toISOString(),
          likes: 14,
        }] : i === 2 ? [{
          id: `c${id}-3`,
          author: MOCK_USERS[3], // Thomas Weber
          content: "Marrakech affiche des rendements imbattables en ce moment. À surveiller \uD83D\uDD25",
          createdAt: new Date(Date.now() - (hoursAgo - 2.5) * 3600000).toISOString(),
          likes: 22,
        }] : []),
      ],
      createdAt: date,
      location: `${user.city}, ${user.country}`,
      property: i === 0
        ? {
            id: "prop1",
            title: "Appartement Lausanne",
            description: "Appartement moderne avec vue sur le lac",
            type: "appartement",
            transactionType: "vente",
            price: 1450000,
            currency: "CHF",
            location: { city: "Lausanne", country: "Suisse" },
            images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"],
            host: user,
            bedrooms: 3,
            bathrooms: 2,
            area: 135,
            amenities: [],
            rating: 4.8,
            reviewCount: 24,
            analytics: {
              rendementBrut: 5.2,
              rendementNet: 3.8,
              prixM2: 10741,
              dpe: "B",
              etatGeneral: "Excellent",
              anneeConstruction: 2020,
              potentielPlusValue: 15,
              roi5ans: 30,
              roi10ans: 68,
              tauxOccupation: 92,
            },
          }
        : (i % 3 === 0 && i !== 3)
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
      formation: i === 3
        ? { id: "form-002", title: "Gestion locative avancée", instructor: "Amina El Idrissi", price: 199, students: 890, thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop" }
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

const FONDATEUR_NUMBERS: Record<string, number> = { "Léo": 1, "Sophie": 2, "Marc": 3, "Amira": 4, "Thomas": 5 };

const CURRENT_USER_ID = "u1";

export default function FeedPage() {
  const { formatPrice, toggleFollow, isFollowing, activeRole } = useApp();
  const [posts, setPosts] = useState<SocialPost[]>(() => generatePosts(5));
  const [activeTab, setActiveTab] = useState<"pour-vous" | "suivis">("pour-vous");
  // Le composant <StoryViewer /> gère lui-même son état (viewer ouvert,
  // index courant, vues, progression, pause, sourdine, swipe). Plus besoin
  // des states custom showStoryViewer / storyProgress / viewedStories.
  const [showStoryUpload, setShowStoryUpload] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [storyGradient, setStoryGradient] = useState("linear-gradient(135deg, #f6d365, #fda085)");

  // POST_GRADIENTS reste utilisé par le modal de création de story (overlay
  // showStoryUpload). Les states du composer post (newPostContent,
  // newPostLocation, showLocationInput, selectedGradient) ainsi que la
  // fonction createPost ont été supprimés en même temps que le composer.
  const POST_GRADIENTS = [
    { name: "Beige E-Dome", value: "linear-gradient(135deg, #f5f0e8, #e8dcc8)" },
    { name: "Or Premium", value: "linear-gradient(135deg, #f6d365, #fda085)" },
    { name: "Bleu Ciel", value: "linear-gradient(135deg, #84fab0, #8fd3f4)" },
    { name: "Nuit", value: "linear-gradient(135deg, #0c0c0c, #1a1a2e)" },
    { name: "Coucher de soleil", value: "linear-gradient(135deg, #fa709a, #fee140)" },
    { name: "Vert Nature", value: "linear-gradient(135deg, #43e97b, #38f9d7)" },
    { name: "Violet Royal", value: "linear-gradient(135deg, #667eea, #764ba2)" },
    { name: "Rose Luxe", value: "linear-gradient(135deg, #f093fb, #f5576c)" },
  ];

  // Post interactions
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [replyTo, setReplyTo] = useState<Record<string, string>>({});
  const [shareMenuPost, setShareMenuPost] = useState<string | null>(null);
  const [moreMenuPost, setMoreMenuPost] = useState<string | null>(null);
  const [feedToast, setFeedToast] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Infinite scroll
  const [loadingMore, setLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

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
    if (activeTab === "suivis") return posts.filter((p) => isFollowing(p.author.id));
    return posts;
  }, [posts, activeTab, isFollowing]);

  const renderContent = (content: string) => {
    return content.split(/([@#]\S+)/g).map((part, i) => {
      if (part.startsWith("@")) {
        return (
          <span key={i} className="text-[#1e9df1] cursor-pointer hover:underline">
            {part}
          </span>
        );
      }
      if (part.startsWith("#")) {
        return (
          <Link key={i} href={`/recherche?q=${encodeURIComponent(part)}`} className="text-[#1e9df1] hover:underline">
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-3xl mx-auto relative">
      {/* Toast */}
      {feedToast && (
        <div className="fixed top-6 right-6 z-[60] px-5 py-3 rounded-xl bg-green-600 text-white text-sm font-medium shadow-lg animate-fade-in">
          ✓ {feedToast}
        </div>
      )}
      {/* Stories bar — composant <StoryViewer /> shadcn-style.
          Chaque user a son propre StoryViewer (thumbnail anneau segmenté
          + viewer modal complet : progress bars par story, swipe, hold
          to pause, mute video, navigation clavier, sortie au glisser bas).
          Le bouton "Votre story" reste custom car il déclenche le modal
          de création (showStoryUpload) qui est une feature distincte. */}
      <div className="mb-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 pb-2 items-start">
          {/* Your story — bouton de création, ouvre le modal upload */}
          <button
            type="button"
            onClick={() => setShowStoryUpload(true)}
            className="relative flex flex-col items-center gap-2 shrink-0 group"
            aria-label="Créer votre story"
          >
            <div className="w-[72px] h-[72px] rounded-full p-1">
              <div className="w-full h-full rounded-full flex items-center justify-center border-2 border-dashed border-muted-foreground/40 bg-muted/30 group-hover:border-[#1e9df1]/60 group-hover:bg-muted/50 transition-all duration-200">
                <Plus className="w-7 h-7 text-muted-foreground/60" strokeWidth={2} />
              </div>
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-[80px]">
              Votre story
            </span>
          </button>

          {MOCK_STORY_FEEDS.map((feed) => (
            <StoryViewer
              key={feed.user.id}
              stories={feed.stories}
              username={feed.user.firstName}
              avatar={feed.user.avatar}
              timestamp={feed.timestamp}
              className="shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Story creator overlay */}
      {showStoryUpload && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowStoryUpload(false)}>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl w-full max-w-lg p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Créer une story</h3>
              <button
                onClick={() => setShowStoryUpload(false)}
                className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Background selector */}
            <div className="mb-4">
              <p className="text-xs text-[var(--text-muted)] mb-2">Arrière-plan</p>
              <div className="flex items-center gap-2 flex-wrap">
                {POST_GRADIENTS.map((g) => (
                  <button
                    key={g.name}
                    onClick={() => setStoryGradient(g.value)}
                    className={`w-9 h-9 rounded-full border-2 transition-all shrink-0 ${storyGradient === g.value ? "border-[#1e9df1] scale-110 ring-2 ring-[#1e9df1]/30" : "border-transparent hover:border-[#1e9df1]/40"}`}
                    style={{ background: g.value }}
                    title={g.name}
                  />
                ))}
              </div>
            </div>

            {/* Preview area (9:16 aspect ratio) */}
            <div
              className="relative mx-auto rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                background: storyGradient,
                aspectRatio: "9 / 16",
                maxHeight: "420px",
                width: "auto",
              }}
            >
              {/* Text overlay on the story */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <p
                  className="text-center font-bold text-lg leading-relaxed break-words max-w-full"
                  style={{
                    color: storyGradient.includes("#0c0c0c") || storyGradient.includes("#667eea") || storyGradient.includes("#f5576c") ? "#ffffff" : "#1a1a1a",
                    textShadow: "0 1px 4px rgba(0,0,0,0.15)",
                  }}
                >
                  {storyText || "Votre texte ici..."}
                </p>
              </div>
              {/* E-Dome watermark */}
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className="text-[10px] font-medium opacity-40" style={{
                  color: storyGradient.includes("#0c0c0c") || storyGradient.includes("#667eea") || storyGradient.includes("#f5576c") ? "#ffffff" : "#1a1a1a",
                }}>
                  E-Dome
                </span>
              </div>
            </div>

            {/* Text input */}
            <div className="mt-4">
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Écrivez le texte de votre story..."
                maxLength={200}
                rows={2}
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--card-border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#1e9df1]/50 transition-colors text-sm resize-none"
              />
              <p className="text-[10px] text-[var(--text-muted)] text-right mt-1">{storyText.length}/200</p>
            </div>

            {/* Publish button */}
            <button
              onClick={() => {
                setShowStoryUpload(false);
                setStoryText("");
                setFeedToast("Story publiée ! (démonstration)");
                setTimeout(() => setFeedToast(null), 3000);
              }}
              className="w-full mt-3 py-3 rounded-xl bg-[#1e9df1] hover:bg-[var(--gold-hover)] text-white font-medium transition-colors"
            >
              Publier la story
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Main feed column */}
        <div className="flex-1 min-w-0">
          {/* Feed tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--card)] border border-[var(--card-border)]">
            {(["pour-vous", "suivis"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-[#1e9df1] text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab === "pour-vous" ? "Pour vous" : "Suivis"}
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
                /* Style inspiré du composant PostCard : grand rayon de
                   bordure, bordure quasi invisible (l'accent bleu à 10 %
                   d'opacité), ombre douce. Plus de padding intérieur que
                   l'ancienne version pour respirer. */
                className="rounded-3xl border border-[#1e9df1]/10 bg-[var(--card)] shadow-xl shadow-black/10 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Post header */}
                <div className="flex items-start justify-between p-5 pb-0">
                  <div className="flex items-center gap-3">
                    <Link href={`/profil/${post.author.id}`}>
                      <img
                        src={post.author.avatar}
                        alt={post.author.firstName}
                        className="w-11 h-11 rounded-full object-cover hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
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
                        {FONDATEUR_NUMBERS[post.author.firstName] && (
                          /* Badge Membre Fondateur — palette ambre sémantique
                             au lieu du gradient or orphelin. */
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold tracking-wide bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30">
                            #{FONDATEUR_NUMBERS[post.author.firstName]}
                          </span>
                        )}
                      </div>
                      {/* @handle · localisation · temps — pattern Twitter-like
                          sous le nom. Plus dense que l'ancienne version qui
                          avait juste localisation + temps. */}
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                        <span className="opacity-80">@{post.author.firstName.toLowerCase()}</span>
                        {post.location && (
                          <>
                            <span>·</span>
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[140px]">{post.location}</span>
                          </>
                        )}
                        <span>·</span>
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
                <div className="px-5 pt-3 pb-1">
                  {editingPost === post.id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        maxLength={2000}
                        rows={4}
                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-3 text-sm text-[var(--foreground)] outline-none resize-none focus:border-[#1e9df1]"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => saveEdit(post.id)}
                          className="px-4 py-2 rounded-lg bg-[#1e9df1] hover:bg-[#1583c9] text-white text-sm font-medium transition-colors"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => setEditingPost(null)}
                          className="px-4 py-2 rounded-lg bg-[var(--hover-bg)] text-[var(--text-secondary)] text-sm transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[15px] text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">
                      {renderContent(post.content)}
                    </p>
                  )}
                </div>

                {/* Media grid — image inline avec marge latérale et coin
                    arrondi (style PostCard). Single = full width, multi =
                    grille 2 colonnes carrée. */}
                {post.media.filter((s) => !s.startsWith("youtube:")).length > 0 && (
                  <div
                    className={`mx-5 mt-3 rounded-2xl overflow-hidden grid gap-0.5 ${
                      post.media.filter((s) => !s.startsWith("youtube:")).length === 1 ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {post.media.filter((s) => !s.startsWith("youtube:")).map((src, mi) => (
                      <div key={mi} className="relative aspect-video bg-[var(--background)]">
                        {src.includes("video") ? (
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
                  <div className="mx-5 mt-3 rounded-2xl border border-[var(--card-border)] overflow-hidden hover:border-[#1e9df1]/30 transition-colors">
                    <Link href={`/explorer/${post.property.id}`} className="flex gap-3 p-3">
                      <img
                        src={post.property.images[0]}
                        alt=""
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--foreground)] truncate">
                          {post.property.title}
                        </p>
                        <p className="text-sm font-bold text-[#1e9df1] mt-1 tabular-nums">
                          {formatPrice(post.property.price, post.property.currency)}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {post.property.bedrooms} ch · {post.property.area}m²
                        </p>
                        {post.property.transactionType === "vente" && post.property.analytics && (
                          <p className="text-xs text-emerald-400 mt-1 tabular-nums">
                            Rendement : {post.property.analytics.rendementBrut.toFixed(1)} % brut
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                )}

                {/* Formation link card */}
                {post.formation && (
                  <div className="mx-5 mt-3 rounded-2xl border border-[var(--card-border)] overflow-hidden hover:border-[#1e9df1]/30 transition-colors">
                    <Link href={`/formations/${post.formation.id}`} className="flex gap-3 p-3">
                      <img
                        src={post.formation.thumbnail}
                        alt=""
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-[#1e9df1]/20 text-[#1e9df1] text-[10px] font-medium rounded-full">Formation</span>
                        </div>
                        <p className="text-sm font-medium text-[var(--foreground)] truncate">
                          {post.formation.title}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {post.formation.instructor} · {post.formation.students} étudiants
                        </p>
                        <p className="text-sm font-bold text-[#1e9df1] mt-1 tabular-nums">
                          {formatPrice(post.formation.price)}
                        </p>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Engagement bar — 4 boutons de largeur égale (Like /
                    Commenter / Partager / Enregistrer) inspirés du
                    composant PostCard. Chaque bouton prend `flex grow`,
                    icône + label, hover bg subtil. Labels masqués sous
                    sm pour rester compact mobile. États actifs colorés :
                    rouge pour Like, bleu accent pour Save. */}
                <div className="mt-4 flex items-center gap-1 px-3 py-2 border-t border-[var(--card-border)]">
                  {/* Like */}
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex grow items-center justify-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-[var(--hover-bg)]"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        likedPosts.has(post.id)
                          ? "fill-rose-500 text-rose-500"
                          : "text-[var(--text-muted)]"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium tabular-nums max-sm:hidden ${
                        likedPosts.has(post.id) ? "text-rose-500" : "text-[var(--foreground)]/85"
                      }`}
                    >
                      {formatCount(post.likes)}
                    </span>
                  </button>

                  {/* Comment */}
                  <button
                    onClick={() =>
                      setExpandedComments((prev) => {
                        const next = new Set(prev);
                        if (next.has(post.id)) next.delete(post.id);
                        else next.add(post.id);
                        return next;
                      })
                    }
                    className="flex grow items-center justify-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-[var(--hover-bg)]"
                  >
                    <MessageCircle
                      className={`w-5 h-5 transition-colors ${
                        expandedComments.has(post.id)
                          ? "text-[#1e9df1]"
                          : "text-[var(--text-muted)]"
                      }`}
                    />
                    <span className="text-sm font-medium tabular-nums max-sm:hidden text-[var(--foreground)]/85">
                      {formatCount(post.comments.length)}
                    </span>
                  </button>

                  {/* Share */}
                  <div className="relative grow flex">
                    <button
                      onClick={() =>
                        setShareMenuPost(shareMenuPost === post.id ? null : post.id)
                      }
                      className="flex grow items-center justify-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-[var(--hover-bg)]"
                    >
                      <Share2 className="w-5 h-5 text-[var(--text-muted)]" />
                      <span className="text-sm font-medium max-sm:hidden text-[var(--foreground)]/85">
                        Partager
                      </span>
                    </button>
                    {shareMenuPost === post.id && (
                      <div className="absolute left-0 bottom-12 w-44 rounded-xl border border-[var(--card-border)] bg-[var(--card)] shadow-xl z-20 animate-scale-in overflow-hidden">
                        {[
                          { label: "Republier", icon: Share2 },
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

                  {/* Save */}
                  <button
                    onClick={() => toggleSave(post.id)}
                    className="flex grow items-center justify-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-[var(--hover-bg)]"
                  >
                    <Bookmark
                      className={`w-5 h-5 transition-colors ${
                        savedPosts.has(post.id)
                          ? "fill-[#1e9df1] text-[#1e9df1]"
                          : "text-[var(--text-muted)]"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium max-sm:hidden ${
                        savedPosts.has(post.id)
                          ? "text-[#1e9df1]"
                          : "text-[var(--foreground)]/85"
                      }`}
                    >
                      {savedPosts.has(post.id) ? "Enregistré" : "Enregistrer"}
                    </span>
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
                            <span className="text-xs text-[#1e9df1]">
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
                            className="flex-1 px-3 py-2 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] outline-none focus:border-[#1e9df1]"
                          />
                          <button
                            onClick={() => addComment(post.id)}
                            className="p-2 rounded-lg bg-[#1e9df1] text-white hover:bg-[var(--gold-hover)] transition-colors disabled:opacity-40"
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
              <LottiePlayer src="/lottie/lottieflow-scrolling-07-1-000000-easey.json" width={40} height={40} />
            )}
          </div>
        </div>

        {/* Right sidebar — desktop only.
            Allégée : 2 widgets (Suggestions max 3 + Tendances max 5).
            Le widget "Événements à venir" a été retiré (doublon avec
            la page /evenements). Le Lottie animé en tête de Suggestions
            a été remplacé par une icône lucide statique pour gagner en
            sobriété et réduire le bruit visuel. */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-5">
          {/* Suggestions */}
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#1e9df1]" />
                Suggestions
              </h3>
              <Link href="/recherche" className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[#1e9df1] transition-colors">
                Voir tout
              </Link>
            </div>
            <div className="space-y-3">
              {MOCK_USERS.slice(1, 4).map((user) => (
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
                        : "bg-[#1e9df1] text-white hover:bg-[#1583c9]"
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
              <TrendingUp className="w-4 h-4 text-[#1e9df1]" />
              Tendances
            </h3>
            <div className="space-y-3">
              {TRENDING_HASHTAGS.slice(0, 5).map((item) => (
                <Link
                  key={item.tag}
                  href={`/recherche?q=${encodeURIComponent(item.tag)}`}
                  className="flex items-center justify-between group"
                >
                  <span className="text-sm text-[#1e9df1] group-hover:underline">{item.tag}</span>
                  <span className="text-xs text-[var(--text-muted)] tabular-nums">{formatCount(item.count)}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 md:bottom-8 right-6 z-30 w-10 h-10 rounded-full bg-[#1e9df1] text-white flex items-center justify-center shadow-lg hover:bg-[var(--gold-hover)] transition-colors animate-scale-in"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
