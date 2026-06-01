"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Upload, Play, Pause, Scissors, Type, Image as ImageIcon,
  Check, X, Hash, Eye, EyeOff, MessageCircle, MessageCircleOff,
  Link2, ChevronRight, Film, Clock, FileVideo,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { LottiePlayer } from "@/components/ui/lottie-player";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;
type Visibility = "public" | "abonnes";
type CommentsSetting = "open" | "closed";

interface TrimState {
  start: number;
  end: number;
}

interface Caption {
  text: string;
  position: "top" | "center" | "bottom";
  startTime: number;
  endTime: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SAMPLE_THUMBNAIL = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=711&fit=crop";
const SAMPLE_DURATION = 32;

const STEP_LABELS = ["Upload", "Edition", "Publication"];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CreerReelPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step
  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [hasVideo, setHasVideo] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Step 2
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTool2, setActiveTool2] = useState<"decouper" | "legende" | "couverture" | null>(null);
  const [trim, setTrim] = useState<TrimState>({ start: 0, end: 100 });
  const [caption, setCaption] = useState<Caption>({ text: "", position: "bottom", startTime: 0, endTime: 100 });
  const [coverFrame, setCoverFrame] = useState(25);

  // Step 3
  const [description, setDescription] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [comments, setComments] = useState<CommentsSetting>("open");
  const [lienApporteur, setLienApporteur] = useState(false);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const simulateUpload = useCallback((fileName: string) => {
    addToast("Traitement video disponible en production", "info");
    setVideoName(fileName);
    setVideoDuration(SAMPLE_DURATION);
    setHasVideo(true);
    setTrim({ start: 0, end: 100 });
    setCaption({ text: "", position: "bottom", startTime: 0, endTime: 100 });
  }, [addToast]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file.name);
    }
  }, [simulateUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      simulateUpload(file.name);
    }
  }, [simulateUpload]);

  const handleBrowseInformations = useCallback(() => {
    simulateUpload("demo_reel_edome.mp4");
  }, [simulateUpload]);

  const addHashtag = useCallback(() => {
    const tag = hashtagInput.trim().replace(/^#/, "");
    if (tag && !hashtags.includes(tag) && hashtags.length < 30) {
      setHashtags((prev) => [...prev, tag]);
      setHashtagInput("");
    }
  }, [hashtagInput, hashtags]);

  const removeHashtag = useCallback((tag: string) => {
    setHashtags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handlePublish = useCallback(() => {
    addToast("Reel publie !", "success");
    setTimeout(() => router.push("/feed"), 1200);
  }, [addToast, router]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ─── Shared styles ───────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: "var(--bg-secondary, var(--hover-bg))",
    borderRadius: 16,
    padding: 20,
    border: "1px solid var(--border, var(--hover-bg))",
  };

  const goldBtnStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 6,
    padding: "10px 24px", borderRadius: 12, fontSize: 14,
    background: "#1e9df1", color: "#fff", border: "none",
    cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
    boxShadow: "0 4px 15px rgba(30, 157, 242,0.3)",
  };

  const outlineBtnStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 6,
    padding: "10px 24px", borderRadius: 12, fontSize: 14,
    background: "transparent", color: "var(--foreground)",
    border: "1px solid var(--border, var(--card-border))",
    cursor: "pointer", fontWeight: 500, transition: "all 0.2s",
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary, #0a0a0a)",
      color: "var(--foreground)",
      fontFamily: "var(--font-sans, Inter, sans-serif)",
    }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid var(--border, var(--hover-bg))",
      }}>
        <button
          onClick={() => step > 1 ? setStep((step - 1) as Step) : router.push("/feed")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", color: "var(--foreground)",
            cursor: "pointer", fontSize: 14,
          }}
        >
          <ArrowLeft size={18} /> {step > 1 ? "Retour" : "Retour"}
        </button>
        <span style={{ fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <Film size={18} color="#1e9df1" /> Creer un Reel
        </span>
        <div style={{ width: 70 }} />
      </div>

      {/* ── Step indicator ─────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8, padding: "16px 20px",
      }}>
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                background: step >= s ? "#1e9df1" : "var(--hover-bg)",
                color: step >= s ? "#fff" : "var(--text-muted, #666)",
                transition: "all 0.3s",
              }}>
                {step > s ? <Check size={14} /> : s}
              </div>
              <span style={{
                fontSize: 12, fontWeight: step === s ? 600 : 400,
                color: step >= s ? "var(--foreground)" : "var(--text-muted, #666)",
                display: "none",
              }}
              className="step-label"
              >
                {STEP_LABELS[s - 1]}
              </span>
            </div>
            {s < 3 && (
              <div style={{
                width: 40, height: 2, borderRadius: 1,
                background: step > s ? "#1e9df1" : "var(--divider)",
                transition: "background 0.3s",
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 16px 100px" }}>

        {/* ═══ STEP 1: Upload ══════════════════════════════════════════════ */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {!hasVideo ? (
              <>
                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    aspectRatio: "9/16",
                    maxHeight: "60vh",
                    borderRadius: 16,
                    border: `2px dashed ${isDragging ? "#1e9df1" : "var(--card-border)"}`,
                    background: isDragging ? "rgba(30, 157, 242,0.08)" : "var(--hover-bg)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.3s", gap: 16,
                  }}
                >
                  <LottiePlayer src="/lottie/lottieflow-multimedia-8-5-000000-easey.json" width={80} height={80} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                      Glissez votre video ici
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted, #888)" }}>
                      ou cliquez pour parcourir
                    </div>
                  </div>
                  <div style={{
                    fontSize: 11, color: "var(--text-muted, #666)",
                    display: "flex", gap: 12,
                  }}>
                    <span>MP4, MOV</span>
                    <span>|</span>
                    <span>Max 60s</span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {/* Alternative buttons */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    ...outlineBtnStyle,
                    justifyContent: "center", width: "100%",
                  }}
                >
                  <FileVideo size={16} /> Ou choisir un fichier
                </button>
                <button
                  onClick={handleBrowseInformations}
                  style={{
                    ...outlineBtnStyle,
                    justifyContent: "center", width: "100%",
                    borderColor: "rgba(30, 157, 242,0.3)", color: "#1e9df1",
                  }}
                >
                  <Film size={16} /> Parcourir le dossier informations
                </button>
              </>
            ) : (
              /* Video uploaded state */
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{
                  position: "relative", borderRadius: 16, overflow: "hidden",
                  aspectRatio: "9/16", maxHeight: "55vh",
                  background: "#111",
                }}>
                  <img
                    src={SAMPLE_THUMBNAIL}
                    alt="Video preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {/* Play overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(0,0,0,0.3)",
                  }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%",
                      background: "rgba(30, 157, 242,0.9)", display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <Play size={24} color="#fff" style={{ marginLeft: 3 }} />
                    </div>
                  </div>
                  {/* Duration badge */}
                  <div style={{
                    position: "absolute", bottom: 12, right: 12,
                    background: "rgba(0,0,0,0.7)", borderRadius: 8,
                    padding: "4px 10px", fontSize: 13, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 4,
                    backdropFilter: "blur(4px)",
                  }}>
                    <Clock size={12} /> {formatTime(SAMPLE_DURATION)}
                  </div>
                </div>

                {/* File info */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 16px", borderRadius: 12,
                  background: "var(--hover-bg)",
                  border: "1px solid var(--hover-bg)",
                }}>
                  <FileVideo size={18} color="#1e9df1" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{videoName}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted, #888)" }}>
                      {formatTime(SAMPLE_DURATION)} · Demo
                    </div>
                  </div>
                  <button
                    onClick={() => { setHasVideo(false); setVideoName(""); }}
                    style={{
                      background: "rgba(239,68,68,0.15)", border: "none",
                      borderRadius: 8, padding: "6px 8px", cursor: "pointer",
                      color: "#ef4444", display: "flex", alignItems: "center",
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>

                <button
                  onClick={() => setStep(2)}
                  style={{ ...goldBtnStyle, justifyContent: "center", width: "100%" }}
                >
                  Continuer <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══ STEP 2: Edit ═══════════════════════════════════════════════ */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Video preview */}
            <div style={{
              position: "relative", borderRadius: 16, overflow: "hidden",
              aspectRatio: "9/16", maxHeight: "50vh", background: "#111",
            }}>
              <img
                src={SAMPLE_THUMBNAIL}
                alt="Video preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Caption overlay */}
              {caption.text && (
                <div style={{
                  position: "absolute",
                  left: 12, right: 12,
                  ...(caption.position === "top" ? { top: 40 } :
                    caption.position === "center" ? { top: "50%", transform: "translateY(-50%)" } :
                      { bottom: 40 }),
                  textAlign: "center",
                  padding: "8px 16px", borderRadius: 8,
                  background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                  fontSize: 15, fontWeight: 600, color: "#fff",
                }}>
                  {caption.text}
                </div>
              )}
              {/* Play/pause button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  position: "absolute", bottom: 12, left: 12,
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(0,0,0,0.6)", border: "none",
                  color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
              </button>
            </div>

            {/* Timeline scrubber */}
            <div style={{ ...cardStyle, padding: 14 }}>
              <div style={{ fontSize: 11, color: "var(--text-muted, #888)", marginBottom: 6 }}>
                Timeline
              </div>
              <div style={{
                position: "relative", height: 32, borderRadius: 8,
                background: "var(--hover-bg)", overflow: "hidden",
              }}>
                {/* Trim region */}
                <div style={{
                  position: "absolute",
                  left: `${trim.start}%`, width: `${trim.end - trim.start}%`,
                  top: 0, bottom: 0,
                  background: "rgba(30, 157, 242,0.25)",
                  borderLeft: "2px solid #1e9df1",
                  borderRight: "2px solid #1e9df1",
                }} />
                {/* Playhead */}
                <div style={{
                  position: "absolute",
                  left: `${currentTime}%`, top: 0, bottom: 0,
                  width: 2, background: "#fff",
                  transition: "left 0.1s",
                }} />
                {/* Clickable area */}
                <input
                  type="range"
                  min={0} max={100} value={currentTime}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  style={{
                    position: "absolute", inset: 0, width: "100%",
                    opacity: 0, cursor: "pointer",
                  }}
                />
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 11, color: "var(--text-muted, #888)", marginTop: 4,
              }}>
                <span>{formatTime((currentTime / 100) * SAMPLE_DURATION)}</span>
                <span>{formatTime(SAMPLE_DURATION)}</span>
              </div>
            </div>

            {/* Tools */}
            <div style={{ display: "flex", gap: 8 }}>
              {([
                { key: "decouper" as const, icon: <Scissors size={16} />, label: "Decouper" },
                { key: "legende" as const, icon: <Type size={16} />, label: "Legende" },
                { key: "couverture" as const, icon: <ImageIcon size={16} />, label: "Couverture" },
              ]).map((tool) => (
                <button
                  key={tool.key}
                  onClick={() => setActiveTool2(activeTool2 === tool.key ? null : tool.key)}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 500,
                    cursor: "pointer", transition: "all 0.2s",
                    background: activeTool2 === tool.key ? "rgba(30, 157, 242,0.2)" : "var(--hover-bg)",
                    color: activeTool2 === tool.key ? "#1e9df1" : "var(--foreground)",
                    border: activeTool2 === tool.key ? "1px solid #1e9df1" : "1px solid var(--border, var(--divider))",
                  }}
                >
                  {tool.icon} {tool.label}
                </button>
              ))}
            </div>

            {/* Tool panels */}
            {activeTool2 && (
              <div style={cardStyle}>
                {/* Decouper */}
                {activeTool2 === "decouper" && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1e9df1" }}>
                      Decouper la video
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 12, color: "var(--text-muted, #888)", display: "block", marginBottom: 4 }}>
                          Debut ({formatTime((trim.start / 100) * SAMPLE_DURATION)})
                        </label>
                        <input
                          type="range" min={0} max={trim.end - 5} value={trim.start}
                          onChange={(e) => setTrim({ ...trim, start: Number(e.target.value) })}
                          style={{ width: "100%", accentColor: "#1e9df1" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: "var(--text-muted, #888)", display: "block", marginBottom: 4 }}>
                          Fin ({formatTime((trim.end / 100) * SAMPLE_DURATION)})
                        </label>
                        <input
                          type="range" min={trim.start + 5} max={100} value={trim.end}
                          onChange={(e) => setTrim({ ...trim, end: Number(e.target.value) })}
                          style={{ width: "100%", accentColor: "#1e9df1" }}
                        />
                      </div>
                      <div style={{
                        fontSize: 12, color: "var(--text-muted, #888)", textAlign: "center",
                        padding: "6px 0", borderRadius: 8,
                        background: "rgba(30, 157, 242,0.1)",
                      }}>
                        Duree : {formatTime(((trim.end - trim.start) / 100) * SAMPLE_DURATION)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Legende */}
                {activeTool2 === "legende" && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1e9df1" }}>
                      Legende video
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <input
                        type="text"
                        placeholder="Texte de la legende..."
                        value={caption.text}
                        onChange={(e) => setCaption({ ...caption, text: e.target.value })}
                        style={{
                          width: "100%", padding: "10px 14px", borderRadius: 10,
                          background: "var(--hover-bg)",
                          border: "1px solid var(--border, var(--divider))",
                          color: "var(--foreground)", fontSize: 14, outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                      <div>
                        <label style={{ fontSize: 12, color: "var(--text-muted, #888)", display: "block", marginBottom: 6 }}>
                          Position
                        </label>
                        <div style={{ display: "flex", gap: 6 }}>
                          {(["top", "center", "bottom"] as const).map((pos) => (
                            <button
                              key={pos}
                              onClick={() => setCaption({ ...caption, position: pos })}
                              style={{
                                flex: 1, padding: "8px 0", borderRadius: 8,
                                fontSize: 12, fontWeight: 500, cursor: "pointer",
                                background: caption.position === pos ? "#1e9df1" : "var(--hover-bg)",
                                color: caption.position === pos ? "#fff" : "var(--text-muted, #aaa)",
                                border: "none", transition: "all 0.2s",
                              }}
                            >
                              {pos === "top" ? "Haut" : pos === "center" ? "Centre" : "Bas"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Couverture */}
                {activeTool2 === "couverture" && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#1e9df1" }}>
                      Image de couverture
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted, #888)", marginBottom: 8 }}>
                      Selectionnez une image de la video
                    </div>
                    <input
                      type="range" min={0} max={100} value={coverFrame}
                      onChange={(e) => setCoverFrame(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#1e9df1", marginBottom: 8 }}
                    />
                    <div style={{
                      display: "flex", gap: 6, justifyContent: "center",
                    }}>
                      {[0, 25, 50, 75, 100].map((f) => (
                        <div
                          key={f}
                          onClick={() => setCoverFrame(f)}
                          style={{
                            width: 48, height: 72, borderRadius: 6, overflow: "hidden",
                            cursor: "pointer",
                            border: coverFrame === f ? "2px solid #1e9df1" : "2px solid transparent",
                            opacity: coverFrame === f ? 1 : 0.6,
                            transition: "all 0.2s",
                          }}
                        >
                          <img
                            src={SAMPLE_THUMBNAIL}
                            alt={`Frame ${f}%`}
                            style={{
                              width: "100%", height: "100%", objectFit: "cover",
                              filter: `brightness(${0.7 + (f / 200)})`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div style={{
                      textAlign: "center", fontSize: 11,
                      color: "var(--text-muted, #888)", marginTop: 6,
                    }}>
                      Position : {coverFrame}% ({formatTime((coverFrame / 100) * SAMPLE_DURATION)})
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Next button */}
            <button
              onClick={() => setStep(3)}
              style={{ ...goldBtnStyle, justifyContent: "center", width: "100%" }}
            >
              Continuer <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ═══ STEP 3: Publish info ══════════════════════════════════════ */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Preview thumbnail */}
            <div style={{
              display: "flex", gap: 14, padding: 14, borderRadius: 14,
              background: "var(--hover-bg)",
              border: "1px solid var(--border, var(--hover-bg))",
            }}>
              <div style={{
                width: 80, height: 120, borderRadius: 10, overflow: "hidden", flexShrink: 0,
              }}>
                <img
                  src={SAMPLE_THUMBNAIL}
                  alt="Cover"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{videoName || "demo_reel.mp4"}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted, #888)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={11} /> {formatTime(SAMPLE_DURATION)}
                </div>
                {caption.text && (
                  <div style={{ fontSize: 11, color: "#1e9df1" }}>
                    Legende : &quot;{caption.text}&quot;
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div style={cardStyle}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
                placeholder="Decrivez votre Reel..."
                rows={4}
                style={{
                  width: "100%", padding: "12px", borderRadius: 10,
                  background: "var(--hover-bg)",
                  border: "1px solid var(--border, var(--divider))",
                  color: "var(--foreground)", fontSize: 14, outline: "none",
                  resize: "vertical", fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
              <div style={{
                textAlign: "right", fontSize: 11,
                color: description.length > 1800 ? "#ef4444" : "var(--text-muted, #888)",
                marginTop: 4,
              }}>
                {description.length}/2000
              </div>
            </div>

            {/* Hashtags */}
            <div style={cardStyle}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                Hashtags
              </label>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHashtag(); } }}
                  placeholder="Ajouter un hashtag..."
                  style={{
                    flex: 1, padding: "8px 12px", borderRadius: 8,
                    background: "var(--hover-bg)",
                    border: "1px solid var(--border, var(--divider))",
                    color: "var(--foreground)", fontSize: 13, outline: "none",
                  }}
                />
                <button
                  onClick={addHashtag}
                  style={{
                    padding: "8px 14px", borderRadius: 8, fontSize: 13,
                    background: "#1e9df1", color: "#fff", border: "none",
                    cursor: "pointer", fontWeight: 600,
                  }}
                >
                  <Hash size={14} />
                </button>
              </div>
              {hashtags.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {hashtags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "4px 10px", borderRadius: 20, fontSize: 12,
                        background: "rgba(30, 157, 242,0.15)", color: "#1e9df1",
                        border: "1px solid rgba(30, 157, 242,0.3)",
                      }}
                    >
                      #{tag}
                      <X
                        size={10}
                        style={{ cursor: "pointer" }}
                        onClick={() => removeHashtag(tag)}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div style={cardStyle}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Parametres</div>
              {/* Visibility */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Eye size={16} color="#1e9df1" />
                  <span style={{ fontSize: 13 }}>Visibilite</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {(["public", "abonnes"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVisibility(v)}
                      style={{
                        padding: "5px 12px", borderRadius: 8, fontSize: 12,
                        cursor: "pointer", fontWeight: 500,
                        background: visibility === v ? "#1e9df1" : "var(--hover-bg)",
                        color: visibility === v ? "#fff" : "var(--text-muted, #aaa)",
                        border: "none", transition: "all 0.2s",
                      }}
                    >
                      {v === "public" ? "Public" : "Abonnes"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <MessageCircle size={16} color="#1e9df1" />
                  <span style={{ fontSize: 13 }}>Commentaires</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {(["open", "closed"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setComments(c)}
                      style={{
                        padding: "5px 12px", borderRadius: 8, fontSize: 12,
                        cursor: "pointer", fontWeight: 500,
                        background: comments === c ? "#1e9df1" : "var(--hover-bg)",
                        color: comments === c ? "#fff" : "var(--text-muted, #aaa)",
                        border: "none", transition: "all 0.2s",
                      }}
                    >
                      {c === "open" ? "Ouverts" : "Fermes"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lien apporteur */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Link2 size={16} color="#1e9df1" />
                  <span style={{ fontSize: 13 }}>Lien apporteur</span>
                </div>
                <button
                  onClick={() => setLienApporteur(!lienApporteur)}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: "none",
                    cursor: "pointer", position: "relative",
                    background: lienApporteur ? "#1e9df1" : "var(--card-border)",
                    transition: "background 0.3s",
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: "#fff", position: "absolute", top: 3,
                    left: lienApporteur ? 23 : 3,
                    transition: "left 0.3s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }} />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => addToast("Apercu du Reel", "info")}
                style={{ ...outlineBtnStyle, flex: 1, justifyContent: "center" }}
              >
                <Play size={16} /> Apercu
              </button>
              <button
                onClick={handlePublish}
                style={{ ...goldBtnStyle, flex: 1, justifyContent: "center" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1583c9")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1e9df1")}
              >
                <Check size={16} /> Publier le Reel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile step labels (CSS in JSX) ────────────────────────────────── */}
      <style>{`
        @media (min-width: 480px) {
          .step-label { display: inline !important; }
        }
      `}</style>
    </div>
  );
}
