"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Image as ImageIcon, Type, Smile, Home, MapPin, Clock,
  AlignLeft, AlignCenter, AlignRight, Plus, Play, Check, X, Upload,
  Bold, ChevronDown, Trash2, Move,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { LottiePlayer } from "@/components/ui/lottie-player";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TextBlock {
  id: string;
  text: string;
  x: number;
  y: number;
  font: string;
  size: string;
  color: string;
  align: "left" | "center" | "right";
  bg: "none" | "solid" | "blur";
}

interface StickerItem {
  id: string;
  content: string;
  x: number;
  y: number;
  type: "emoji" | "badge";
}

interface PropertyCard {
  id: string;
  title: string;
  price: string;
  image: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GRADIENTS = [
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #4facfe, #00f2fe)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #fa709a, #fee140)",
  "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  "linear-gradient(135deg, #fccb90, #d57eeb)",
  "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
  "linear-gradient(135deg, #f5576c, #ff9a9e)",
  "linear-gradient(135deg, #667eea, #00f2fe)",
  "linear-gradient(135deg, #1e9df1, #e8c9a0)",
  "linear-gradient(135deg, #1a1a2e, #16213e)",
];

const FONTS = ["Inter", "Georgia", "Courier New", "Impact", "Comic Sans MS"];
const SIZES: Record<string, number> = { S: 14, M: 18, L: 24, XL: 32, XXL: 42 };
const TEXT_COLORS = [
  "#ffffff", "#000000", "#1e9df1", "#ef4444", "#f59e0b", "#22c55e",
  "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f97316",
];
const EMOJI_STICKERS = ["🏡", "🏢", "🌴", "🏔", "🔑", "💰", "⭐", "❤️", "🔥", "📈", "🤝", "✅"];
const TEXT_STICKERS = [
  { emoji: "🔥", label: "NOUVEAU" },
  { emoji: "⭐", label: "COUP DE CŒUR" },
  { emoji: "💰", label: "INVESTISSEMENT" },
  { emoji: "🏆", label: "PREMIUM" },
];

const MOCK_PROPERTIES: PropertyCard[] = [
  { id: "prop1", title: "Villa Lac Léman", price: "CHF 2 850 000", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200" },
  { id: "prop2", title: "Penthouse Genève", price: "CHF 4 200 000", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200" },
  { id: "prop3", title: "Chalet Verbier", price: "CHF 3 500 000", image: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=200" },
  { id: "prop4", title: "Appartement Zurich", price: "CHF 1 250 000", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200" },
  { id: "prop5", title: "Loft Lausanne", price: "CHF 890 000", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200" },
  { id: "prop6", title: "Riad Marrakech", price: "MAD 5 500 000", image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=200" },
  { id: "prop7", title: "Studio Montreux", price: "CHF 520 000", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200" },
  { id: "prop8", title: "Maison Neuchâtel", price: "CHF 980 000", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200" },
  { id: "prop9", title: "Villa Crans-Montana", price: "CHF 6 100 000", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200" },
  { id: "prop10", title: "Duplex Bâle", price: "CHF 1 450 000", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200" },
  { id: "prop11", title: "Penthouse Lugano", price: "CHF 3 800 000", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=200" },
  { id: "prop12", title: "Chalet Gstaad", price: "CHF 8 200 000", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200" },
];

const LOCATION_SUGGESTIONS = [
  "Lausanne, Suisse", "Genève, Suisse", "Zurich, Suisse", "Montreux, Suisse",
  "Verbier, Suisse", "Marrakech, Maroc", "Paris, France", "Bâle, Suisse",
];

const DURATIONS = [5, 7, 10, 15];

type Tool = "fond" | "texte" | "sticker" | "bien" | "lieu" | "duree" | null;

// ─── Component ────────────────────────────────────────────────────────────────
export default function CreerStoryPage() {
  const router = useRouter();
  const { addToast } = useToast();

  // Canvas state
  const [background, setBackground] = useState(GRADIENTS[0]);
  const [bgType, setBgType] = useState<"gradient" | "color" | "image">("gradient");
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyCard | null>(null);
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState(7);
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const playRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const addTextBlock = useCallback(() => {
    const newBlock: TextBlock = {
      id: `txt-${Date.now()}`,
      text: "Texte ici",
      x: 50,
      y: 50,
      font: "Inter",
      size: "L",
      color: "#ffffff",
      align: "center",
      bg: "none",
    };
    setTextBlocks((prev) => [...prev, newBlock]);
    setSelectedTextId(newBlock.id);
  }, []);

  const updateTextBlock = useCallback((id: string, updates: Partial<TextBlock>) => {
    setTextBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  }, []);

  const deleteTextBlock = useCallback((id: string) => {
    setTextBlocks((prev) => prev.filter((b) => b.id !== id));
    setSelectedTextId(null);
  }, []);

  const addSticker = useCallback((content: string, type: "emoji" | "badge") => {
    setStickers((prev) => [
      ...prev,
      { id: `stk-${Date.now()}`, content, x: 30 + Math.random() * 40, y: 30 + Math.random() * 40, type },
    ]);
  }, []);

  const removeSticker = useCallback((id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBackground(`url(${url})`);
      setBgType("image");
    }
  }, []);

  const handlePreview = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      if (playRef.current) clearInterval(playRef.current);
      setPlayProgress(0);
      return;
    }
    setIsPlaying(true);
    setPlayProgress(0);
    const interval = 50;
    const totalSteps = (duration * 1000) / interval;
    let step = 0;
    playRef.current = setInterval(() => {
      step++;
      setPlayProgress((step / totalSteps) * 100);
      if (step >= totalSteps) {
        clearInterval(playRef.current!);
        setIsPlaying(false);
        setPlayProgress(0);
      }
    }, interval);
  }, [duration, isPlaying]);

  const handlePublish = useCallback(() => {
    addToast("Story publiee ! Visible pendant 24h.", "success");
    setTimeout(() => router.push("/feed"), 1200);
  }, [addToast, router]);

  const selectedText = textBlocks.find((b) => b.id === selectedTextId) || null;

  const filteredSuggestions = LOCATION_SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(locationInput.toLowerCase())
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      display: "flex",
      flexDirection: "column",
      color: "#fff",
      fontFamily: "var(--font-sans, Inter, sans-serif)",
    }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        <button
          onClick={() => router.push("/feed")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 14,
          }}
        >
          <ArrowLeft size={18} /> Retour
        </button>
        <span style={{ fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <span>📱</span> Creer une story
        </span>
        <div style={{ width: 70 }} />
      </div>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        gap: 16,
        overflow: "auto",
      }}>
        {/* ── Canvas ─────────────────────────────────────────────────────── */}
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: 360,
          aspectRatio: "9/16",
          maxHeight: "80vh",
          borderRadius: 16,
          overflow: "hidden",
          background: bgType === "image"
            ? `center/cover no-repeat ${background}`
            : bgType === "color"
              ? background
              : background,
          ...(bgType === "gradient" ? { backgroundImage: background } : {}),
          boxShadow: "0 0 40px rgba(30, 157, 242,0.15)",
        }}>
          {/* Progress bar */}
          {(isPlaying || playProgress > 0) && (
            <div style={{
              position: "absolute", top: 8, left: 8, right: 8, height: 3,
              background: "rgba(255,255,255,0.3)", borderRadius: 2, zIndex: 20,
            }}>
              <div style={{
                height: "100%", borderRadius: 2, background: "#1e9df1",
                width: `${playProgress}%`, transition: "width 50ms linear",
              }} />
            </div>
          )}

          {/* Duration indicator */}
          <div style={{
            position: "absolute", top: 16, right: 12, zIndex: 10,
            background: "rgba(0,0,0,0.5)", borderRadius: 12, padding: "3px 8px",
            fontSize: 11, color: "#fff", backdropFilter: "blur(4px)",
          }}>
            {duration}s
          </div>

          {/* Text blocks */}
          {textBlocks.map((block) => (
            <div
              key={block.id}
              onClick={(e) => { e.stopPropagation(); setSelectedTextId(block.id); setActiveTool("texte"); }}
              style={{
                position: "absolute",
                left: `${block.x}%`,
                top: `${block.y}%`,
                transform: "translate(-50%, -50%)",
                cursor: "move",
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: SIZES[block.size],
                fontFamily: block.font,
                color: block.color,
                textAlign: block.align,
                background: block.bg === "solid"
                  ? "rgba(0,0,0,0.6)"
                  : block.bg === "blur"
                    ? "rgba(255,255,255,0.15)"
                    : "transparent",
                backdropFilter: block.bg === "blur" ? "blur(8px)" : "none",
                border: selectedTextId === block.id ? "2px solid #1e9df1" : "2px solid transparent",
                minWidth: 40,
                maxWidth: "80%",
                wordBreak: "break-word",
                zIndex: 10,
                userSelect: "none",
              }}
            >
              {block.text}
              {selectedTextId === block.id && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteTextBlock(block.id); }}
                  style={{
                    position: "absolute", top: -10, right: -10,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#ef4444", border: "none", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: 10,
                  }}
                >
                  <X size={10} />
                </button>
              )}
            </div>
          ))}

          {/* Stickers */}
          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              style={{
                position: "absolute",
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                transform: "translate(-50%, -50%)",
                fontSize: sticker.type === "emoji" ? 32 : 13,
                cursor: "move",
                zIndex: 10,
                userSelect: "none",
                ...(sticker.type === "badge"
                  ? {
                      background: "rgba(0,0,0,0.7)",
                      borderRadius: 8,
                      padding: "6px 12px",
                      fontWeight: 700,
                      color: "#fff",
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(30, 157, 242,0.4)",
                    }
                  : {}),
              }}
              onClick={(e) => { e.stopPropagation(); removeSticker(sticker.id); }}
              title="Cliquer pour supprimer"
            >
              {sticker.content}
            </div>
          ))}

          {/* Location badge */}
          {location && (
            <div
              style={{
                position: "absolute", bottom: selectedProperty ? 100 : 16, left: 12,
                background: "rgba(0,0,0,0.6)", borderRadius: 20, padding: "5px 12px",
                fontSize: 12, color: "#fff", display: "flex", alignItems: "center", gap: 4,
                backdropFilter: "blur(4px)", zIndex: 10, cursor: "pointer",
              }}
              onClick={() => setLocation("")}
              title="Cliquer pour supprimer"
            >
              <MapPin size={12} color="#1e9df1" /> {location}
            </div>
          )}

          {/* Property card */}
          {selectedProperty && (
            <div
              style={{
                position: "absolute", bottom: 12, left: 12, right: 12,
                background: "rgba(0,0,0,0.7)", borderRadius: 12, padding: 10,
                display: "flex", alignItems: "center", gap: 10,
                backdropFilter: "blur(8px)", zIndex: 10, cursor: "pointer",
                border: "1px solid rgba(30, 157, 242,0.3)",
              }}
              onClick={() => setSelectedProperty(null)}
              title="Cliquer pour supprimer"
            >
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedProperty.title}</div>
                <div style={{ fontSize: 12, color: "#1e9df1" }}>{selectedProperty.price}</div>
              </div>
              <span style={{ fontSize: 12, color: "#1e9df1" }}>Voir →</span>
            </div>
          )}
        </div>

        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", gap: 8, overflowX: "auto", padding: "4px 0",
          width: "100%", maxWidth: 400, justifyContent: "center", flexWrap: "wrap",
        }}>
          {([
            { key: "fond" as Tool, icon: "🖼", label: "Fond" },
            { key: "texte" as Tool, icon: "✏️", label: "Texte" },
            { key: "sticker" as Tool, icon: "😀", label: "Sticker" },
            { key: "bien" as Tool, icon: "🏠", label: "Bien" },
            { key: "lieu" as Tool, icon: "📍", label: "Lieu" },
            { key: "duree" as Tool, icon: "⏱", label: "Duree" },
          ]).map((tool) => (
            <button
              key={tool.key}
              onClick={() => setActiveTool(activeTool === tool.key ? null : tool.key)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: "8px 14px", borderRadius: 12,
                background: activeTool === tool.key ? "rgba(30, 157, 242,0.2)" : "rgba(255,255,255,0.08)",
                border: activeTool === tool.key ? "1px solid #1e9df1" : "1px solid rgba(255,255,255,0.1)",
                color: activeTool === tool.key ? "#1e9df1" : "#fff",
                cursor: "pointer", fontSize: 12, fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 18 }}>{tool.icon}</span>
              {tool.label}
            </button>
          ))}
        </div>

        {/* ── Tool Panels ──────────────────────────────────────────────────── */}
        {activeTool && (
          <div style={{
            width: "100%", maxWidth: 400,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 16, padding: 16,
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            {/* ─ Fond ───────────────────────────────────────────────────────── */}
            {activeTool === "fond" && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1e9df1" }}>
                  Arriere-plan
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
                  {GRADIENTS.map((g, i) => (
                    <div
                      key={i}
                      onClick={() => { setBackground(g); setBgType("gradient"); }}
                      style={{
                        aspectRatio: "1", borderRadius: 10, cursor: "pointer",
                        backgroundImage: g,
                        border: background === g && bgType === "gradient"
                          ? "2px solid #1e9df1"
                          : "2px solid transparent",
                        transition: "border 0.2s",
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontSize: 12, color: "#aaa" }}>Couleur unie :</label>
                  <input
                    type="color"
                    defaultValue="#1a1a2e"
                    onChange={(e) => { setBackground(e.target.value); setBgType("color"); }}
                    style={{ width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer", background: "none" }}
                  />
                  <label
                    style={{
                      marginLeft: "auto", display: "flex", alignItems: "center", gap: 4,
                      padding: "6px 12px", borderRadius: 8, fontSize: 12,
                      background: "rgba(30, 157, 242,0.15)", color: "#1e9df1",
                      cursor: "pointer", border: "1px solid rgba(30, 157, 242,0.3)",
                    }}
                  >
                    <LottiePlayer src="/lottie/lottieflow-multimedia-8-5-000000-easey.json" width={20} height={20} /> Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                  </label>
                </div>
              </div>
            )}

            {/* ─ Texte ──────────────────────────────────────────────────────── */}
            {activeTool === "texte" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1e9df1" }}>Texte</span>
                  <button
                    onClick={addTextBlock}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      padding: "6px 12px", borderRadius: 8, fontSize: 12,
                      background: "#1e9df1", color: "#fff", border: "none",
                      cursor: "pointer", fontWeight: 600,
                    }}
                  >
                    <Plus size={12} /> Ajouter
                  </button>
                </div>
                {selectedText && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input
                      type="text"
                      value={selectedText.text}
                      onChange={(e) => updateTextBlock(selectedText.id, { text: e.target.value })}
                      style={{
                        background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 14, outline: "none",
                      }}
                    />
                    {/* Font select */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {FONTS.map((f) => (
                        <button
                          key={f}
                          onClick={() => updateTextBlock(selectedText.id, { font: f })}
                          style={{
                            padding: "4px 8px", borderRadius: 6, fontSize: 11,
                            fontFamily: f, cursor: "pointer",
                            background: selectedText.font === f ? "#1e9df1" : "rgba(255,255,255,0.1)",
                            color: "#fff", border: "none",
                          }}
                        >
                          {f.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                    {/* Size */}
                    <div style={{ display: "flex", gap: 6 }}>
                      {Object.keys(SIZES).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateTextBlock(selectedText.id, { size: s })}
                          style={{
                            padding: "4px 10px", borderRadius: 6, fontSize: 12,
                            cursor: "pointer",
                            background: selectedText.size === s ? "#1e9df1" : "rgba(255,255,255,0.1)",
                            color: "#fff", border: "none", fontWeight: 600,
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {/* Color */}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {TEXT_COLORS.map((c) => (
                        <div
                          key={c}
                          onClick={() => updateTextBlock(selectedText.id, { color: c })}
                          style={{
                            width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer",
                            border: selectedText.color === c ? "2px solid #1e9df1" : "2px solid rgba(255,255,255,0.2)",
                          }}
                        />
                      ))}
                    </div>
                    {/* Align & Background */}
                    <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {(["left", "center", "right"] as const).map((a) => (
                          <button
                            key={a}
                            onClick={() => updateTextBlock(selectedText.id, { align: a })}
                            style={{
                              padding: "4px 8px", borderRadius: 6, cursor: "pointer",
                              background: selectedText.align === a ? "#1e9df1" : "rgba(255,255,255,0.1)",
                              color: "#fff", border: "none",
                            }}
                          >
                            {a === "left" ? <AlignLeft size={14} /> : a === "center" ? <AlignCenter size={14} /> : <AlignRight size={14} />}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {(["none", "solid", "blur"] as const).map((bg) => (
                          <button
                            key={bg}
                            onClick={() => updateTextBlock(selectedText.id, { bg })}
                            style={{
                              padding: "4px 8px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                              background: selectedText.bg === bg ? "#1e9df1" : "rgba(255,255,255,0.1)",
                              color: "#fff", border: "none",
                            }}
                          >
                            {bg === "none" ? "Sans" : bg === "solid" ? "Fond" : "Flou"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {!selectedText && textBlocks.length === 0 && (
                  <p style={{ fontSize: 13, color: "#888", textAlign: "center" }}>
                    Cliquez sur &quot;Ajouter&quot; pour creer un bloc de texte
                  </p>
                )}
                {!selectedText && textBlocks.length > 0 && (
                  <p style={{ fontSize: 13, color: "#888", textAlign: "center" }}>
                    Cliquez sur un texte dans le canvas pour le modifier
                  </p>
                )}
              </div>
            )}

            {/* ─ Sticker ────────────────────────────────────────────────────── */}
            {activeTool === "sticker" && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1e9df1" }}>Stickers</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 16 }}>
                  {EMOJI_STICKERS.map((e) => (
                    <button
                      key={e}
                      onClick={() => addSticker(e, "emoji")}
                      style={{
                        fontSize: 24, background: "rgba(255,255,255,0.08)", borderRadius: 10,
                        border: "none", cursor: "pointer", padding: "8px 0",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(ev) => (ev.currentTarget.style.background = "rgba(30, 157, 242,0.2)")}
                      onMouseLeave={(ev) => (ev.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>Badges texte</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {TEXT_STICKERS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => addSticker(`${s.emoji} ${s.label}`, "badge")}
                      style={{
                        padding: "8px 14px", borderRadius: 8, fontSize: 13,
                        background: "rgba(255,255,255,0.08)", color: "#fff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        cursor: "pointer", textAlign: "left", fontWeight: 600,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(ev) => {
                        ev.currentTarget.style.background = "rgba(30, 157, 242,0.2)";
                        ev.currentTarget.style.borderColor = "rgba(30, 157, 242,0.4)";
                      }}
                      onMouseLeave={(ev) => {
                        ev.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        ev.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      }}
                    >
                      {s.emoji} {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─ Bien ───────────────────────────────────────────────────────── */}
            {activeTool === "bien" && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1e9df1" }}>
                  Associer un bien
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, maxHeight: 280, overflowY: "auto" }}>
                  {MOCK_PROPERTIES.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProperty(selectedProperty?.id === p.id ? null : p)}
                      style={{
                        borderRadius: 10, overflow: "hidden", cursor: "pointer",
                        border: selectedProperty?.id === p.id
                          ? "2px solid #1e9df1"
                          : "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.05)",
                        transition: "all 0.2s",
                      }}
                    >
                      <img src={p.image} alt={p.title} style={{ width: "100%", height: 70, objectFit: "cover" }} />
                      <div style={{ padding: "6px 8px" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{p.title}</div>
                        <div style={{ fontSize: 10, color: "#1e9df1" }}>{p.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─ Lieu ───────────────────────────────────────────────────────── */}
            {activeTool === "lieu" && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1e9df1" }}>Lieu</div>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Rechercher un lieu..."
                    value={locationInput}
                    onChange={(e) => { setLocationInput(e.target.value); setShowLocationSuggestions(true); }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 10,
                      background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
                    }}
                  />
                  {showLocationSuggestions && filteredSuggestions.length > 0 && (
                    <div style={{
                      position: "absolute", top: "100%", left: 0, right: 0,
                      background: "rgba(30,30,30,0.98)", borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.1)",
                      marginTop: 4, zIndex: 20, maxHeight: 180, overflowY: "auto",
                    }}>
                      {filteredSuggestions.map((s) => (
                        <div
                          key={s}
                          onClick={() => {
                            setLocation(s);
                            setLocationInput(s);
                            setShowLocationSuggestions(false);
                          }}
                          style={{
                            padding: "10px 14px", cursor: "pointer", fontSize: 13,
                            display: "flex", alignItems: "center", gap: 6,
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                          onMouseEnter={(ev) => (ev.currentTarget.style.background = "rgba(30, 157, 242,0.15)")}
                          onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
                        >
                          <MapPin size={12} color="#1e9df1" /> {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {location && (
                  <div style={{
                    marginTop: 10, display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 12px", borderRadius: 20,
                    background: "rgba(30, 157, 242,0.15)", border: "1px solid rgba(30, 157, 242,0.3)",
                    fontSize: 13, width: "fit-content",
                  }}>
                    <MapPin size={12} color="#1e9df1" /> {location}
                    <X
                      size={12}
                      style={{ cursor: "pointer", marginLeft: 4 }}
                      onClick={() => { setLocation(""); setLocationInput(""); }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ─ Duree ──────────────────────────────────────────────────────── */}
            {activeTool === "duree" && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1e9df1" }}>
                  Duree de la story
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      style={{
                        flex: 1, padding: "12px 0", borderRadius: 10, fontSize: 15,
                        fontWeight: 700, cursor: "pointer",
                        background: duration === d ? "#1e9df1" : "rgba(255,255,255,0.08)",
                        color: duration === d ? "#fff" : "#aaa",
                        border: duration === d ? "1px solid #1e9df1" : "1px solid rgba(255,255,255,0.1)",
                        transition: "all 0.2s",
                      }}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
                {/* Mini progress preview */}
                <div style={{ marginTop: 12, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
                  <div style={{
                    height: "100%", width: `${(duration / 15) * 100}%`, background: "#1e9df1",
                    borderRadius: 2, transition: "width 0.3s",
                  }} />
                </div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4, textAlign: "center" }}>
                  Visible pendant {duration} secondes
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Footer buttons ─────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 12, padding: "12px 16px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        justifyContent: "center",
      }}>
        <button
          onClick={handlePreview}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 24px", borderRadius: 12, fontSize: 14,
            background: "rgba(255,255,255,0.1)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)",
            cursor: "pointer", fontWeight: 500, transition: "all 0.2s",
          }}
        >
          <Play size={16} /> {isPlaying ? "Arreter" : "Apercu"}
        </button>
        <button
          onClick={handlePublish}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 24px", borderRadius: 12, fontSize: 14,
            background: "#1e9df1", color: "#fff", border: "none",
            cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
            boxShadow: "0 4px 15px rgba(30, 157, 242,0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#b8845a")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1e9df1")}
        >
          <Check size={16} /> Publier la story
        </button>
      </div>
    </div>
  );
}
