"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Camera, Home, MapPin, Hash, AtSign, BarChart3,
  Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  X, Plus, ChevronDown, ChevronUp, Eye, Save, Send,
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Image as ImageIcon, Trash2, Check,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { LottiePlayer } from "@/components/ui/lottie-player";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PollOption {
  id: string;
  text: string;
}

interface AttachedProperty {
  id: string;
  title: string;
  price: string;
  image: string;
  location: string;
  bedrooms: number;
  area: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const GOLD = "#1e9df1";

// Fond du post hardcodé en noir basique. Le sélecteur de fond (11
// gradients + upload image custom) a été retiré pour rester sobre :
// un seul rendu, pas de personnalisation possible.
const POST_BG_COLOR = "#000000";

const FONTS = [
  { label: "Classique", value: "system-ui, sans-serif" },
  { label: "Élégant", value: "Georgia, 'Times New Roman', serif" },
  { label: "Bold", value: "'Arial Black', Gadget, sans-serif" },
  { label: "Moderne", value: "'Segoe UI', Tahoma, Geneva, sans-serif" },
  { label: "Manuscrit", value: "'Brush Script MT', cursive" },
];

const FONT_SIZES: Record<string, string> = { S: "14px", M: "16px", L: "20px", XL: "26px" };

const TEXT_COLORS = [
  "#000000", "#ffffff", "#1e9df1", "#ef4444", "#f59e0b", "#22c55e",
  "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280", "#0f172a", "#78350f",
];

const HASHTAG_SUGGESTIONS = [
  "#immobilier", "#investissement", "#luxe", "#suisse", "#location",
  "#villa", "#appartement", "#marché", "#rendement", "#architecture",
  "#design", "#maison", "#genève", "#lausanne", "#zurich",
];

const USER_SUGGESTIONS = [
  { name: "Sophie Martin", handle: "sophie.martin" },
  { name: "Marc Dubois", handle: "marc.dubois" },
  { name: "Amira El Fassi", handle: "amira.elfassi" },
  { name: "Thomas Weber", handle: "thomas.weber" },
  { name: "Julie Blanc", handle: "julie.blanc" },
];

const CITY_SUGGESTIONS = [
  "Genève, Suisse", "Lausanne, Suisse", "Zurich, Suisse", "Berne, Suisse",
  "Montreux, Suisse", "Marrakech, Maroc", "Paris, France", "Lyon, France",
  "Dubai, EAU", "Londres, Royaume-Uni",
];

const MOCK_PROPERTIES: AttachedProperty[] = Array.from({ length: 12 }, (_, i) => ({
  id: `prop${i + 1}`,
  title: [
    "Villa Panorama", "Penthouse Royal", "Chalet Alpin", "Loft Urbain",
    "Mas Provençal", "Riad Medina", "Duplex Standing", "Studio Design",
    "Maison de Maître", "Appartement Vue Lac", "Villa Bord de Mer", "Cottage Champêtre",
  ][i],
  price: `${(800 + i * 150).toLocaleString("fr-CH")} 000 CHF`,
  image: `https://images.unsplash.com/photo-${
    ["1600596542815-ffad4c1539a9", "1600585154340-be6161a56a0c", "1613490493576-7fde63acd811",
     "1512917774080-9991f1c4c750", "1600607687939-ce8a6c25118c", "1560518883-ce09059eeffa",
     "1600566753190-17f0baa2a6c3", "1600573472550-8090b5e0745e", "1600047509807-ba8f99d2cdde",
     "1600566753086-7f3e1f5e37d3", "1600585154526-990dced4db0d", "1600566752355-35792bedcfea"][i]
  }?w=400`,
  location: ["Genève", "Lausanne", "Zurich", "Montreux", "Berne", "Marrakech",
    "Genève", "Lausanne", "Zurich", "Montreux", "Berne", "Marrakech"][i],
  bedrooms: 2 + (i % 5),
  area: 80 + i * 30,
}));

// ─── Component ──────────────────────────────────────────────────────────────

export default function CreerPostPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editor state
  const [content, setContent] = useState("");
  const [selectedFont, setSelectedFont] = useState(0);
  const [fontSize, setFontSize] = useState("M");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  // Couleur de texte par défaut blanche puisque le fond est noir.
  const [textColor, setTextColor] = useState("#ffffff");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");

  // Media & attachments
  const [photos, setPhotos] = useState<string[]>([]);
  const [attachedProperty, setAttachedProperty] = useState<AttachedProperty | null>(null);
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);

  // Poll
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: "po1", text: "" },
    { id: "po2", text: "" },
  ]);
  const [pollDuration, setPollDuration] = useState("24h");

  // Active attachment panel
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [mentionInput, setMentionInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);

  // Publication options
  const [showOptions, setShowOptions] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "abonnes" | "moi">("public");
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [includeReferral, setIncludeReferral] = useState(false);

  // Mobile tab
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  // Preview mode
  const [previewMode, setPreviewMode] = useState<"feed" | "profil">("feed");

  // ─── Helpers ────────────────────────────────────────────────────────────
  // Fond hardcodé noir. effectiveTextColor utilise simplement la couleur
  // de texte choisie par l'utilisateur (par défaut blanche pour contraste).
  const bgStyle = { background: POST_BG_COLOR };
  const effectiveTextColor = textColor;

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 10 - photos.length;
    const newPhotos: string[] = [];
    Array.from(files).slice(0, remaining).forEach((file) => {
      newPhotos.push(URL.createObjectURL(file));
    });
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  }, [photos.length]);

  const removePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addHashtag = useCallback((tag: string) => {
    const clean = tag.startsWith("#") ? tag : `#${tag}`;
    if (!hashtags.includes(clean)) {
      setHashtags((prev) => [...prev, clean]);
    }
    setTagInput("");
  }, [hashtags]);

  const addMention = useCallback((handle: string) => {
    const clean = handle.startsWith("@") ? handle : `@${handle}`;
    if (!mentions.includes(clean)) {
      setMentions((prev) => [...prev, clean]);
    }
    setMentionInput("");
  }, [mentions]);

  const addPollOption = useCallback(() => {
    if (pollOptions.length < 4) {
      setPollOptions((prev) => [...prev, { id: `po${Date.now()}`, text: "" }]);
    }
  }, [pollOptions.length]);

  const updatePollOption = useCallback((id: string, text: string) => {
    setPollOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  }, []);

  const removePollOption = useCallback((id: string) => {
    if (pollOptions.length > 2) {
      setPollOptions((prev) => prev.filter((o) => o.id !== id));
    }
  }, [pollOptions.length]);

  const handlePublish = useCallback(() => {
    if (!content.trim() && photos.length === 0 && !attachedProperty && !showPoll) {
      addToast("Ajoutez du contenu avant de publier", "warning");
      return;
    }
    addToast("Post publié avec succès !", "success");
    setTimeout(() => router.push("/feed"), 800);
  }, [content, photos.length, attachedProperty, showPoll, addToast, router]);

  const handleDraft = useCallback(() => {
    addToast("Brouillon sauvegardé", "success");
  }, [addToast]);

  const handleCancel = useCallback(() => {
    if (content.trim() || photos.length > 0) {
      if (confirm("Voulez-vous vraiment quitter ? Les modifications non sauvegardées seront perdues.")) {
        router.push("/feed");
      }
    } else {
      router.push("/feed");
    }
  }, [content, photos.length, router]);

  const togglePanel = useCallback((panel: string) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }, []);

  // Filtered suggestions
  const filteredTags = useMemo(() => {
    if (!tagInput) return HASHTAG_SUGGESTIONS;
    return HASHTAG_SUGGESTIONS.filter((t) => t.toLowerCase().includes(tagInput.toLowerCase()));
  }, [tagInput]);

  const filteredUsers = useMemo(() => {
    if (!mentionInput) return USER_SUGGESTIONS;
    return USER_SUGGESTIONS.filter((u) =>
      u.name.toLowerCase().includes(mentionInput.toLowerCase()) ||
      u.handle.toLowerCase().includes(mentionInput.toLowerCase())
    );
  }, [mentionInput]);

  const filteredCities = useMemo(() => {
    if (!locationInput) return CITY_SUGGESTIONS;
    return CITY_SUGGESTIONS.filter((c) => c.toLowerCase().includes(locationInput.toLowerCase()));
  }, [locationInput]);

  // ─── Render Helpers ─────────────────────────────────────────────────────

  const renderFormatToolbar = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "12px 0" }}>
      {/* Font selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ color: "var(--text-muted)", fontSize: 12, minWidth: 40 }}>Police</span>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {FONTS.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setSelectedFont(i)}
              style={{
                padding: "4px 10px",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: f.value,
                background: selectedFont === i ? GOLD : "var(--background)",
                color: selectedFont === i ? "#fff" : "var(--text-primary)",
                border: `1px solid ${selectedFont === i ? GOLD : "var(--card-border)"}`,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "var(--text-muted)", fontSize: 12, minWidth: 40 }}>Taille</span>
        <div style={{ display: "flex", gap: 4 }}>
          {Object.keys(FONT_SIZES).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              style={{
                width: 36,
                height: 32,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: fontSize === size ? GOLD : "var(--background)",
                color: fontSize === size ? "#fff" : "var(--text-primary)",
                border: `1px solid ${fontSize === size ? GOLD : "var(--card-border)"}`,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Bold / Italic */}
        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
          <button
            onClick={() => setIsBold(!isBold)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isBold ? GOLD : "var(--background)",
              color: isBold ? "#fff" : "var(--text-primary)",
              border: `1px solid ${isBold ? GOLD : "var(--card-border)"}`,
              cursor: "pointer",
            }}
          >
            <Bold size={14} />
          </button>
          <button
            onClick={() => setIsItalic(!isItalic)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isItalic ? GOLD : "var(--background)",
              color: isItalic ? "#fff" : "var(--text-primary)",
              border: `1px solid ${isItalic ? GOLD : "var(--card-border)"}`,
              cursor: "pointer",
            }}
          >
            <Italic size={14} />
          </button>
        </div>

        {/* Alignment */}
        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
          {([["left", AlignLeft], ["center", AlignCenter], ["right", AlignRight]] as const).map(
            ([align, Icon]) => (
              <button
                key={align}
                onClick={() => setTextAlign(align)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: textAlign === align ? GOLD : "var(--background)",
                  color: textAlign === align ? "#fff" : "var(--text-primary)",
                  border: `1px solid ${textAlign === align ? GOLD : "var(--card-border)"}`,
                  cursor: "pointer",
                }}
              >
                <Icon size={14} />
              </button>
            )
          )}
        </div>
      </div>

      {/* Text color picker */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "var(--text-muted)", fontSize: 12, minWidth: 40 }}>Couleur</span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TEXT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setTextColor(c)}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: c,
                border: textColor === c ? `3px solid ${GOLD}` : `2px solid var(--card-border)`,
                cursor: "pointer",
                transition: "transform 0.15s",
                transform: textColor === c ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderAttachmentBar = () => {
    const items = [
      { key: "photo", icon: Camera, label: "Photo" },
      { key: "bien", icon: Home, label: "Bien" },
      { key: "lieu", icon: MapPin, label: "Lieu" },
      { key: "tag", icon: Hash, label: "Tag" },
      { key: "mention", icon: AtSign, label: "Mention" },
      { key: "sondage", icon: BarChart3, label: "Sondage" },
    ];

    return (
      <div>
        <div style={{
          display: "flex", gap: 4, flexWrap: "wrap",
          padding: "8px 0", borderTop: "1px solid var(--card-border)",
        }}>
          {items.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => {
                if (key === "photo") {
                  fileInputRef.current?.click();
                } else if (key === "sondage") {
                  setShowPoll(!showPoll);
                  setActivePanel(null);
                } else {
                  togglePanel(key);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 20,
                fontSize: 13,
                background: activePanel === key || (key === "sondage" && showPoll) ? `${GOLD}15` : "var(--background)",
                color: activePanel === key || (key === "sondage" && showPoll) ? GOLD : "var(--text-secondary)",
                border: `1px solid ${activePanel === key || (key === "sondage" && showPoll) ? GOLD : "var(--card-border)"}`,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          style={{ display: "none" }}
        />

        {/* Panels */}
        {activePanel === "bien" && renderPropertyPanel()}
        {activePanel === "lieu" && renderLocationPanel()}
        {activePanel === "tag" && renderTagPanel()}
        {activePanel === "mention" && renderMentionPanel()}
        {showPoll && renderPollPanel()}
      </div>
    );
  };

  const renderPropertyPanel = () => (
    <div style={{
      padding: 12,
      background: "var(--background)",
      borderRadius: 12,
      border: "1px solid var(--card-border)",
      marginTop: 8,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
        Sélectionner un bien
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: 8,
        maxHeight: 240,
        overflowY: "auto",
      }}>
        {MOCK_PROPERTIES.map((prop) => (
          <button
            key={prop.id}
            onClick={() => {
              setAttachedProperty(attachedProperty?.id === prop.id ? null : prop);
              setActivePanel(null);
            }}
            style={{
              padding: 0,
              borderRadius: 10,
              overflow: "hidden",
              border: attachedProperty?.id === prop.id ? `2px solid ${GOLD}` : "1px solid var(--card-border)",
              cursor: "pointer",
              background: "var(--card)",
              textAlign: "left",
              transition: "all 0.2s",
            }}
          >
            <div style={{
              height: 70,
              backgroundImage: `url(${prop.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}>
              {attachedProperty?.id === prop.id && (
                <div style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: GOLD,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Check size={12} color="#fff" />
                </div>
              )}
            </div>
            <div style={{ padding: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}>
                {prop.title}
              </div>
              <div style={{ fontSize: 10, color: GOLD, marginTop: 2 }}>{prop.price}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderLocationPanel = () => (
    <div style={{
      padding: 12,
      background: "var(--background)",
      borderRadius: 12,
      border: "1px solid var(--card-border)",
      marginTop: 8,
    }}>
      <input
        type="text"
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
        placeholder="Rechercher une ville..."
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid var(--card-border)",
          background: "var(--card)",
          color: "var(--text-primary)",
          fontSize: 13,
          outline: "none",
        }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {filteredCities.map((city) => (
          <button
            key={city}
            onClick={() => {
              setLocation(city);
              setLocationInput("");
              setActivePanel(null);
            }}
            style={{
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 12,
              background: location === city ? GOLD : "var(--card)",
              color: location === city ? "#fff" : "var(--text-primary)",
              border: `1px solid ${location === city ? GOLD : "var(--card-border)"}`,
              cursor: "pointer",
            }}
          >
            <MapPin size={12} style={{ display: "inline", marginRight: 4, verticalAlign: -2 }} />
            {city}
          </button>
        ))}
      </div>
    </div>
  );

  const renderTagPanel = () => (
    <div style={{
      padding: 12,
      background: "var(--background)",
      borderRadius: 12,
      border: "1px solid var(--card-border)",
      marginTop: 8,
    }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && tagInput.trim()) {
              addHashtag(tagInput.trim());
            }
          }}
          placeholder="Ajouter un hashtag..."
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid var(--card-border)",
            background: "var(--card)",
            color: "var(--text-primary)",
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={() => tagInput.trim() && addHashtag(tagInput.trim())}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: GOLD,
            color: "#fff",
            fontSize: 13,
            border: "none",
            cursor: "pointer",
          }}
        >
          Ajouter
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {filteredTags.map((tag) => (
          <button
            key={tag}
            onClick={() => addHashtag(tag)}
            style={{
              padding: "4px 10px",
              borderRadius: 20,
              fontSize: 12,
              background: hashtags.includes(tag) ? `${GOLD}20` : "var(--card)",
              color: hashtags.includes(tag) ? GOLD : "var(--text-secondary)",
              border: `1px solid ${hashtags.includes(tag) ? GOLD : "var(--card-border)"}`,
              cursor: "pointer",
            }}
          >
            {tag}
          </button>
        ))}
      </div>
      {hashtags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--card-border)" }}>
          {hashtags.map((tag) => (
            <span
              key={tag}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 12,
                background: `${GOLD}20`,
                color: GOLD,
              }}
            >
              {tag}
              <X
                size={12}
                style={{ cursor: "pointer" }}
                onClick={() => setHashtags((prev) => prev.filter((t) => t !== tag))}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderMentionPanel = () => (
    <div style={{
      padding: 12,
      background: "var(--background)",
      borderRadius: 12,
      border: "1px solid var(--card-border)",
      marginTop: 8,
    }}>
      <input
        type="text"
        value={mentionInput}
        onChange={(e) => setMentionInput(e.target.value)}
        placeholder="Rechercher un utilisateur..."
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid var(--card-border)",
          background: "var(--card)",
          color: "var(--text-primary)",
          fontSize: 13,
          outline: "none",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
        {filteredUsers.map((user) => {
          const handle = `@${user.handle}`;
          const isSelected = mentions.includes(handle);
          return (
            <button
              key={user.handle}
              onClick={() => addMention(user.handle)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 8,
                background: isSelected ? `${GOLD}15` : "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-primary)",
                fontSize: 13,
                textAlign: "left",
                width: "100%",
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: `${GOLD}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
                color: GOLD,
              }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>{user.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{handle}</div>
              </div>
              {isSelected && <Check size={14} color={GOLD} style={{ marginLeft: "auto" }} />}
            </button>
          );
        })}
      </div>
      {mentions.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--card-border)" }}>
          {mentions.map((m) => (
            <span
              key={m}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 12,
                background: "#3b82f615",
                color: "#3b82f6",
              }}
            >
              {m}
              <X
                size={12}
                style={{ cursor: "pointer" }}
                onClick={() => setMentions((prev) => prev.filter((x) => x !== m))}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const renderPollPanel = () => (
    <div style={{
      padding: 12,
      background: "var(--background)",
      borderRadius: 12,
      border: "1px solid var(--card-border)",
      marginTop: 8,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Sondage</span>
        <button
          onClick={() => setShowPoll(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
        >
          <X size={16} />
        </button>
      </div>
      <input
        type="text"
        value={pollQuestion}
        onChange={(e) => setPollQuestion(e.target.value)}
        placeholder="Posez votre question..."
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid var(--card-border)",
          background: "var(--card)",
          color: "var(--text-primary)",
          fontSize: 13,
          outline: "none",
          marginBottom: 8,
        }}
      />
      {pollOptions.map((opt, idx) => (
        <div key={opt.id} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <input
            type="text"
            value={opt.text}
            onChange={(e) => updatePollOption(opt.id, e.target.value)}
            placeholder={`Option ${idx + 1}`}
            style={{
              flex: 1,
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid var(--card-border)",
              background: "var(--card)",
              color: "var(--text-primary)",
              fontSize: 13,
              outline: "none",
            }}
          />
          {pollOptions.length > 2 && (
            <button
              onClick={() => removePollOption(opt.id)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--card)",
                border: "1px solid var(--card-border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
        {pollOptions.length < 4 && (
          <button
            onClick={addPollOption}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 12px",
              borderRadius: 8,
              fontSize: 12,
              background: "var(--card)",
              color: GOLD,
              border: `1px solid ${GOLD}40`,
              cursor: "pointer",
            }}
          >
            <Plus size={14} /> Option
          </button>
        )}
        <select
          value={pollDuration}
          onChange={(e) => setPollDuration(e.target.value)}
          style={{
            padding: "4px 10px",
            borderRadius: 8,
            fontSize: 12,
            background: "var(--card)",
            color: "var(--text-primary)",
            border: "1px solid var(--card-border)",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          <option value="24h">24 heures</option>
          <option value="48h">48 heures</option>
          <option value="7j">7 jours</option>
        </select>
      </div>
    </div>
  );

  const renderPublicationOptions = () => (
    <div style={{
      border: "1px solid var(--card-border)",
      borderRadius: 12,
      overflow: "hidden",
      marginTop: 12,
    }}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "var(--background)",
          border: "none",
          cursor: "pointer",
          color: "var(--text-primary)",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Options de publication
        {showOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {showOptions && (
        <div style={{ padding: 16, background: "var(--card)", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Visibility */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Visibilité</div>
            <div style={{ display: "flex", gap: 8 }}>
              {([["public", "Public"], ["abonnes", "Abonnés"], ["moi", "Moi seul"]] as const).map(
                ([val, label]) => (
                  <label
                    key={val}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 13,
                      background: visibility === val ? `${GOLD}15` : "var(--background)",
                      color: visibility === val ? GOLD : "var(--text-secondary)",
                      border: `1px solid ${visibility === val ? GOLD : "var(--card-border)"}`,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === val}
                      onChange={() => setVisibility(val)}
                      style={{ display: "none" }}
                    />
                    {label}
                  </label>
                )
              )}
            </div>
          </div>

          {/* Comments */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Commentaires</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[true, false].map((open) => (
                <label
                  key={String(open)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 13,
                    background: commentsOpen === open ? `${GOLD}15` : "var(--background)",
                    color: commentsOpen === open ? GOLD : "var(--text-secondary)",
                    border: `1px solid ${commentsOpen === open ? GOLD : "var(--card-border)"}`,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="comments"
                    checked={commentsOpen === open}
                    onChange={() => setCommentsOpen(open)}
                    style={{ display: "none" }}
                  />
                  {open ? "Ouverts" : "Fermés"}
                </label>
              ))}
            </div>
          </div>

          {/* Referral link */}
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            fontSize: 13,
            color: "var(--text-primary)",
          }}>
            <div
              onClick={(e) => {
                e.preventDefault();
                setIncludeReferral(!includeReferral);
              }}
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                background: includeReferral ? GOLD : "var(--card-border)",
                position: "relative",
                transition: "background 0.2s",
                cursor: "pointer",
              }}
            >
              <div style={{
                position: "absolute",
                top: 2,
                left: includeReferral ? 20 : 2,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </div>
            Inclure mon lien de parrainage
          </label>
        </div>
      )}
    </div>
  );

  // ─── Preview ────────────────────────────────────────────────────────────

  const renderPreview = () => {
    const contentWithFormatting = content || "Votre texte apparaîtra ici...";
    const hasContent = content.trim().length > 0 || photos.length > 0 || attachedProperty || showPoll;

    return (
      <div>
        {/* Preview mode toggle */}
        <div style={{
          display: "flex",
          gap: 4,
          marginBottom: 16,
          background: "var(--background)",
          borderRadius: 10,
          padding: 3,
        }}>
          {(["feed", "profil"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              style={{
                flex: 1,
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                background: previewMode === mode ? "var(--card)" : "transparent",
                color: previewMode === mode ? "var(--text-primary)" : "var(--text-muted)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: previewMode === mode ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {mode === "feed" ? "Feed" : "Profil"}
            </button>
          ))}
        </div>

        {previewMode === "feed" ? (
          /* Feed preview */
          <div style={{
            background: "var(--card)",
            borderRadius: 16,
            border: "1px solid var(--card-border)",
            overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px" }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${GOLD}, #e8b88a)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
              }}>
                L
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>Léo Martin</span>
                  <span style={{
                    padding: "1px 8px",
                    borderRadius: 10,
                    fontSize: 10,
                    fontWeight: 600,
                    background: `${GOLD}20`,
                    color: GOLD,
                  }}>
                    Hôte
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                  {location && (
                    <>
                      <MapPin size={11} />
                      <span>{location} · </span>
                    </>
                  )}
                  À l&apos;instant
                </div>
              </div>
              <MoreHorizontal size={18} style={{ color: "var(--text-muted)" }} />
            </div>

            {/* Content area — fond noir hardcodé, contenu centré */}
            {content.trim() && (
              <div style={{
                ...bgStyle,
                padding: "32px 20px",
                minHeight: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <p style={{
                  fontSize: FONT_SIZES[fontSize],
                  fontFamily: FONTS[selectedFont].value,
                  fontWeight: isBold ? 700 : 400,
                  fontStyle: isItalic ? "italic" : "normal",
                  color: effectiveTextColor,
                  textAlign,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  width: "100%",
                  margin: 0,
                }}>
                  {contentWithFormatting.split(/(#\w+|@\w+[\.\w]*)/g).map((part, i) => {
                    if (part.startsWith("#")) {
                      return <span key={i} style={{ color: GOLD, fontWeight: 600 }}>{part}</span>;
                    }
                    if (part.startsWith("@")) {
                      return <span key={i} style={{ color: "#3b82f6", fontWeight: 500 }}>{part}</span>;
                    }
                    return part;
                  })}
                </p>
              </div>
            )}

            {/* Photos */}
            {photos.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: photos.length === 1 ? "1fr" : "1fr 1fr",
                gap: 2,
              }}>
                {photos.slice(0, 4).map((photo, i) => (
                  <div
                    key={i}
                    style={{
                      paddingTop: photos.length === 1 ? "60%" : "100%",
                      backgroundImage: `url(${photo})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                    }}
                  >
                    {i === 3 && photos.length > 4 && (
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 20,
                        fontWeight: 700,
                      }}>
                        +{photos.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Attached property */}
            {attachedProperty && (
              <div style={{
                margin: "0 16px 12px",
                borderRadius: 12,
                border: "1px solid var(--card-border)",
                overflow: "hidden",
              }}>
                <div style={{
                  height: 120,
                  backgroundImage: `url(${attachedProperty.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }} />
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{attachedProperty.title}</div>
                  <div style={{ fontSize: 13, color: GOLD, fontWeight: 600, marginTop: 2 }}>{attachedProperty.price}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    {attachedProperty.bedrooms} ch. · {attachedProperty.area} m² · {attachedProperty.location}
                  </div>
                </div>
              </div>
            )}

            {/* Poll preview */}
            {showPoll && pollQuestion && (
              <div style={{ padding: "0 16px 12px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
                  {pollQuestion}
                </div>
                {pollOptions.filter((o) => o.text).map((opt) => (
                  <div
                    key={opt.id}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: `1px solid ${GOLD}40`,
                      marginBottom: 6,
                      fontSize: 13,
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {opt.text}
                  </div>
                ))}
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  Durée : {pollDuration === "24h" ? "24 heures" : pollDuration === "48h" ? "48 heures" : "7 jours"}
                </div>
              </div>
            )}

            {/* Hashtags & mentions badges */}
            {(hashtags.length > 0 || mentions.length > 0) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "0 16px 10px" }}>
                {hashtags.map((tag) => (
                  <span key={tag} style={{ fontSize: 12, color: GOLD, fontWeight: 500 }}>{tag}</span>
                ))}
                {mentions.map((m) => (
                  <span key={m} style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500 }}>{m}</span>
                ))}
              </div>
            )}

            {/* Interaction bar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "10px 16px",
              borderTop: "1px solid var(--card-border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: 13 }}>
                <Heart size={18} /> 0
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: 13 }}>
                <MessageCircle size={18} /> 0
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)", fontSize: 13 }}>
                <Share2 size={18} />
              </div>
              <Bookmark size={18} style={{ color: "var(--text-muted)", marginLeft: "auto" }} />
            </div>
          </div>
        ) : (
          /* Profile grid preview */
          <div style={{
            aspectRatio: "1",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid var(--card-border)",
            position: "relative",
            ...bgStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {photos.length > 0 ? (
              <div style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${photos[0]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}>
                {photos.length > 1 && (
                  <div style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    1/{photos.length}
                  </div>
                )}
              </div>
            ) : content.trim() ? (
              <p style={{
                fontSize: 13,
                fontFamily: FONTS[selectedFont].value,
                fontWeight: isBold ? 700 : 400,
                fontStyle: isItalic ? "italic" : "normal",
                color: effectiveTextColor,
                textAlign: "center",
                padding: 16,
                lineHeight: 1.4,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                margin: 0,
              }}>
                {content.slice(0, 100)}
                {content.length > 100 && "..."}
              </p>
            ) : (
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Aperçu miniature</span>
            )}
          </div>
        )}

        {!hasContent && (
          <div style={{
            marginTop: 16,
            padding: 20,
            borderRadius: 12,
            background: `${GOLD}08`,
            border: `1px dashed ${GOLD}40`,
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: 13,
          }}>
            Commencez à écrire pour voir l&apos;aperçu en temps réel
          </div>
        )}
      </div>
    );
  };

  // ─── Editor ─────────────────────────────────────────────────────────────

  const renderEditor = () => (
    <div>
      {/* Sélecteur de fond retiré : fond du post hardcodé en noir basique
          (POST_BG_COLOR). L'utilisateur garde la main sur la couleur de
          texte, la police, la taille, le gras/italique, l'alignement. */}

      {/* Text area with background */}
      <div style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid var(--card-border)",
        marginBottom: 4,
      }}>
        <textarea
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= 2000) setContent(e.target.value);
          }}
          placeholder="Quoi de neuf dans l'immobilier ?"
          style={{
            width: "100%",
            minHeight: 200,
            padding: 16,
            border: "none",
            outline: "none",
            resize: "vertical",
            fontSize: FONT_SIZES[fontSize],
            fontFamily: FONTS[selectedFont].value,
            fontWeight: isBold ? 700 : 400,
            fontStyle: isItalic ? "italic" : "normal",
            color: effectiveTextColor,
            textAlign,
            lineHeight: 1.6,
            ...bgStyle,
          }}
        />
        <div style={{
          position: "absolute",
          bottom: 8,
          right: 12,
          fontSize: 11,
          color: content.length > 1800 ? "#ef4444" : "var(--text-muted)",
          background: "rgba(255,255,255,0.8)",
          padding: "2px 8px",
          borderRadius: 8,
          backdropFilter: "blur(4px)",
        }}>
          {content.length}/2000
        </div>
      </div>

      {/* Uploaded photos */}
      {photos.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: 8,
          marginBottom: 12,
        }}>
          {photos.map((photo, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                paddingTop: "100%",
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid var(--card-border)",
              }}
            >
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }} />
              <button
                onClick={() => removePhoto(i)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {photos.length < 10 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                paddingTop: "100%",
                borderRadius: 10,
                border: `2px dashed ${GOLD}40`,
                background: `${GOLD}08`,
                cursor: "pointer",
                position: "relative",
              }}
            >
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: GOLD,
                gap: 2,
              }}>
                <LottiePlayer src="/lottie/lottieflow-multimedia-8-5-000000-easey.json" width={40} height={40} />
                <span style={{ fontSize: 10 }}>{photos.length}/10</span>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Attached property card (editor side) */}
      {attachedProperty && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: 10,
          borderRadius: 10,
          border: "1px solid var(--card-border)",
          background: "var(--background)",
          marginBottom: 12,
        }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: 8,
            backgroundImage: `url(${attachedProperty.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minWidth: 50,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {attachedProperty.title}
            </div>
            <div style={{ fontSize: 12, color: GOLD }}>{attachedProperty.price}</div>
          </div>
          <button
            onClick={() => setAttachedProperty(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Location badge */}
      {location && (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 12px",
          borderRadius: 20,
          background: `${GOLD}10`,
          border: `1px solid ${GOLD}30`,
          fontSize: 12,
          color: GOLD,
          marginBottom: 12,
        }}>
          <MapPin size={12} />
          {location}
          <X size={12} style={{ cursor: "pointer" }} onClick={() => setLocation("")} />
        </div>
      )}

      {/* Formatting toolbar */}
      {renderFormatToolbar()}

      {/* Attachment bar */}
      {renderAttachmentBar()}

      {/* Publication options */}
      {renderPublicationOptions()}

      {/* Action buttons */}
      <div style={{
        display: "flex",
        gap: 8,
        marginTop: 16,
        flexWrap: "wrap",
      }}>
        <button
          onClick={handleCancel}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            fontSize: 14,
            background: "var(--background)",
            color: "var(--text-secondary)",
            border: "1px solid var(--card-border)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Annuler
        </button>
        <button
          onClick={handleDraft}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            fontSize: 14,
            background: "var(--background)",
            color: "var(--text-primary)",
            border: "1px solid var(--card-border)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
        >
          <Save size={16} /> Brouillon
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className="md:hidden"
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            fontSize: 14,
            background: "var(--background)",
            color: "var(--text-primary)",
            border: "1px solid var(--card-border)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
        >
          <Eye size={16} /> Aperçu
        </button>
        <button
          onClick={handlePublish}
          style={{
            padding: "10px 28px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            background: `linear-gradient(135deg, ${GOLD}, #e8b88a)`,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginLeft: "auto",
            transition: "all 0.2s",
            boxShadow: `0 4px 14px ${GOLD}40`,
          }}
        >
          <Send size={16} /> Publier
        </button>
      </div>
    </div>
  );

  // ─── Main Layout ────────────────────────────────────────────────────────

  return (
    <div style={{ padding: "24px 16px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 24,
          fontWeight: 700,
          color: "var(--text-primary)",
          margin: 0,
        }}>
          Créer un post
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
          Partagez du contenu avec la communauté E-Dome
        </p>
      </div>

      {/* Mobile tabs */}
      <div
        className="md:hidden"
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 16,
          background: "var(--background)",
          borderRadius: 12,
          padding: 3,
        }}
      >
        {(["edit", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              background: mobileTab === tab ? "var(--card)" : "transparent",
              color: mobileTab === tab ? GOLD : "var(--text-muted)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: mobileTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {tab === "edit" ? "Éditer" : "Aperçu"}
          </button>
        ))}
      </div>

      {/* Desktop: Two columns / Mobile: Tab content */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Editor column */}
        <div
          className={mobileTab === "edit" ? "" : "hidden md:block"}
          style={{ flex: "0 0 60%", maxWidth: "60%" }}
        >
          <div style={{
            background: "var(--card)",
            borderRadius: 16,
            border: "1px solid var(--card-border)",
            padding: 20,
          }}>
            {renderEditor()}
          </div>
        </div>

        {/* Preview column */}
        <div
          className={mobileTab === "preview" ? "" : "hidden md:block"}
          style={{ flex: 1, position: "sticky", top: 24 }}
        >
          <div style={{
            background: "var(--card)",
            borderRadius: 16,
            border: "1px solid var(--card-border)",
            padding: 20,
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-muted)",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              Aperçu en direct
            </div>
            {renderPreview()}

            {/* Back to editor on mobile */}
            <button
              className="md:hidden"
              onClick={() => setMobileTab("edit")}
              style={{
                width: "100%",
                marginTop: 16,
                padding: "10px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                background: "var(--background)",
                color: "var(--text-primary)",
                border: "1px solid var(--card-border)",
                cursor: "pointer",
              }}
            >
              Retour à l&apos;éditeur
            </button>
          </div>
        </div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .hidden { display: none !important; }
        }
        @media (min-width: 769px) {
          .md\\:hidden { display: none !important; }
          .md\\:block { display: block !important; }
        }
        textarea::placeholder {
          color: var(--text-muted);
        }
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: var(--card-border);
          border-radius: 3px;
        }
        select {
          appearance: auto;
        }
        input:focus, textarea:focus {
          border-color: ${GOLD} !important;
        }
      `}</style>
    </div>
  );
}
