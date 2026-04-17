import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../services/api.js";
import ChatWidget from "./ChatWidget.jsx";

// ─── Design System ─────────────────────────────────────────────────────────────
const DS = {
    radius: { sm: "8px", md: "16px", lg: "24px", xl: "32px", xxl: "48px", pill: "100px" },
    shadow: {
        sm: "0 2px 8px rgba(0,0,0,0.06)",
        md: "0 8px 24px rgba(0,0,0,0.1)",
        lg: "0 20px 48px rgba(0,0,0,0.12)",
        xl: "0 32px 72px rgba(0,0,0,0.16)",
        colored: (color) => `0 20px 48px ${color}50`,
    },
    spacing: { xs: "8px", sm: "16px", md: "24px", lg: "40px", xl: "64px", xxl: "100px", section: "120px" },
    font: {
        h1: "clamp(3rem, 6vw, 5rem)",
        h2: "clamp(2.2rem, 4vw, 3.2rem)",
        h3: "clamp(1.4rem, 2.5vw, 1.8rem)",
        body: "1.05rem",
        sm: "0.9rem",
    },
    transition: { fast: "all 0.2s ease", base: "all 0.3s ease", slow: "all 0.5s ease" },
};

// ─── Image Pipeline ────────────────────────────────────────────────────────────

/** Session-level cache: query → URL (avoid re-fetching same image in one page visit) */
const _imgCache = new Map();

/**
 * Fetch a real Unsplash image via the backend proxy.
 * Returns a URL string. Never throws — falls back to static map on failure.
 */
async function fetchFromUnsplashProxy(query, width = 800, height = 600) {
    const cacheKey = `${query}__${width}x${height}`;
    if (_imgCache.has(cacheKey)) return _imgCache.get(cacheKey);

    try {
        const params = new URLSearchParams({ query, w: width, h: height });
        const res = await fetch(`/api/public/unsplash?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success && data.url) {
            _imgCache.set(cacheKey, data.url);
            return data.url;
        }
    } catch {
        // Silent — fall through to static fallback
    }

    const fallback = getStaticFallbackUrl(query, width, height);
    _imgCache.set(cacheKey, fallback);
    return fallback;
}

/** Static fallback map for when the proxy is unavailable */
const FALLBACK_PHOTO_MAP = {
    coffee: "photo-1495474472287-4d71bcdd2085",
    latte: "photo-1541167760496-1628856ab772",
    barista: "photo-1501339847302-ac426a4a7cbb",
    cafe: "photo-1559925393-8be0ec4767c8",
    espresso: "photo-1510591509098-f4fdc6d0ff04",
    restaurant: "photo-1414235077428-338989a2e8c0",
    food: "photo-1504674900247-0877df9cc836",
    chef: "photo-1577219491135-ce391730fb2c",
    dining: "photo-1517248135467-4c7edcad34c4",
    gourmet: "photo-1555939594-58d7cb561ad1",
    bakery: "photo-1509440159596-0249088772ff",
    fitness: "photo-1534438327276-14e5300c3a48",
    gym: "photo-1571019613454-1cb2f99b2d8b",
    yoga: "photo-1593810450967-f9c42742e326",
    workout: "photo-1517836357463-d25dfeac3438",
    athlete: "photo-1552674605-db6ffd4facb5",
    runner: "photo-1476480862126-209bfaa8edc8",
    tech: "photo-1496181133206-80ce9b88a853",
    startup: "photo-1497366216548-37526070297c",
    developer: "photo-1517180102446-f3ece451e9d8",
    code: "photo-1555066931-4365d14bab8c",
    software: "photo-1518770660439-4636190af475",
    laptop: "photo-1496181133206-80ce9b88a853",
    fashion: "photo-1558769132-cb1aea458c5e",
    clothing: "photo-1445205170230-053b83016050",
    model: "photo-1496747611176-843222e1e57c",
    luxury: "photo-1515886657613-9f3515b0c78f",
    boutique: "photo-1441986300917-64674bd600d8",
    medical: "photo-1576091160550-2173dba999ef",
    doctor: "photo-1559839734-2b71ea197ec2",
    healthcare: "photo-1519494026892-80bbd2d6fd0d",
    clinic: "photo-1538108149393-fbbd82ab8c59",
    home: "photo-1568605114967-8130f3a36994",
    interior: "photo-1616486338812-3dadae4b4ace",
    architecture: "photo-1486325212027-8081e485255e",
    property: "photo-1600585154340-be6161a56a0c",
    beauty: "photo-1522337360788-8b13dee7a37e",
    spa: "photo-1519823551278-64ac92734fb1",
    skincare: "photo-1570172619644-dfd03ed5d881",
    salon: "photo-1562322140-8baeececf3df",
    makeup: "photo-1487412840662-9f0b5e0bc9ab",
    travel: "photo-1488646953014-85cb44e25828",
    beach: "photo-1507525428034-b723cf961d3e",
    mountain: "photo-1464822759023-fed622ff2c3b",
    hotel: "photo-1566073771259-6a8506099945",
    tropical: "photo-1539367628448-4bc5c9d171c8",
    law: "photo-1589829545856-d10d557cf95f",
    legal: "photo-1568027762272-e4da8b386fe9",
    finance: "photo-1611974789855-9c2a0a7236a3",
    business: "photo-1507679799987-c73779587ccf",
    corporate: "photo-1497366754035-f200968a6e72",
    office: "photo-1497366811353-6870744d04b2",
    meeting: "photo-1552664730-d307ca884978",
    creative: "photo-1558618666-fcd25c85cd64",
    design: "photo-1561070791-2526d30994b5",
    art: "photo-1579783902614-a3fb3927b6a5",
    studio: "photo-1531746020798-e6953c6e8e04",
    photography: "photo-1452587925148-ce544e77e70d",
    education: "photo-1509062522246-3755977927d7",
    professional: "photo-1521737711867-e3b97375f902",
    team: "photo-1522071820081-009f0129c71c",
    workspace: "photo-1497366216548-37526070297c",
    abstract: "photo-1557683316-973673baf926",
    nature: "photo-1501854140801-50d01698950b",
    city: "photo-1477959858617-67f85cf4f1df",
};

function getStaticFallbackUrl(query, width, height) {
    if (!query) return buildPhotoUrl("photo-1497366216548-37526070297c", width, height);
    const lower = (query || "").toLowerCase();
    const matched = Object.keys(FALLBACK_PHOTO_MAP).find(k => lower.includes(k));
    const photoId = matched ? FALLBACK_PHOTO_MAP[matched] : "photo-1497366216548-37526070297c";
    return buildPhotoUrl(photoId, width, height);
}

function buildPhotoUrl(photoId, width, height) {
    return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
}

/**
 * Synchronous resolver — used for initial render.
 * If the item already has a full URL (from AI generation), use it.
 * Otherwise returns a static fallback immediately.
 * The async hook useUnsplashImage() will update it later.
 */
/**
 * Synchronous resolver — returns a URL immediately.
 * Prefers: full URL from AI > static fallback.
 * Components with imageQuery should use the useUnsplashImage hook for live fetching.
 */
function getImageUrl(queryOrUrl, width = 800, height = 600) {
    if (!queryOrUrl) return getStaticFallbackUrl("professional", width, height);
    // Already a resolved Unsplash URL (from AI generation)
    if (queryOrUrl.startsWith("https://images.unsplash.com")) {
        const hasParams = queryOrUrl.includes("?");
        return hasParams ? queryOrUrl : `${queryOrUrl}?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
    }
    if (queryOrUrl.startsWith("http")) return queryOrUrl;
    // Keyword — use static fallback synchronously
    return getStaticFallbackUrl(queryOrUrl, width, height);
}

/**
 * React hook: fetches a real Unsplash image for a keyword query.
 * Returns the URL (starts as static fallback, updates to real photo).
 */
function useUnsplashImage(queryOrUrl, width = 800, height = 600) {
    const [url, setUrl] = useState(() => getImageUrl(queryOrUrl, width, height));
    useEffect(() => {
        if (!queryOrUrl) return;
        // If it's already a full URL, no need to fetch
        if (queryOrUrl.startsWith("http")) {
            setUrl(queryOrUrl.startsWith("https://images.unsplash.com") && !queryOrUrl.includes("?")
                ? `${queryOrUrl}?w=${width}&h=${height}&fit=crop&auto=format&q=80`
                : queryOrUrl);
            return;
        }
        // Check cache first
        const cacheKey = `${queryOrUrl}__${width}x${height}`;
        if (_imgCache.has(cacheKey)) {
            setUrl(_imgCache.get(cacheKey));
            return;
        }
        // Async fetch via proxy
        fetchFromUnsplashProxy(queryOrUrl, width, height).then(setUrl);
    }, [queryOrUrl, width, height]);
    return url;
}

function resolveItemImage(item, width = 640, height = 480) {
    if (!item) return getStaticFallbackUrl("workspace", width, height);
    if (typeof item === "string") return getImageUrl(item, width, height);
    // AI-generated images have a real URL in item.image
    if (item.image && item.image.startsWith("http")) return item.image;
    if (item.imageQuery) return getImageUrl(item.imageQuery, width, height);
    if (item.title) return getStaticFallbackUrl(item.title, width, height);
    return getStaticFallbackUrl("professional", width, height);
}


// ─── Font loader ───────────────────────────────────────────────────────────────
const LOADED_FONTS = new Set();
function loadFont(fontName) {
    if (!fontName || LOADED_FONTS.has(fontName)) return;
    LOADED_FONTS.add(fontName);
    const encodedFont = fontName.replace(/ /g, "+");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodedFont}:wght@300;400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function isLightText(textColor) {
    if (!textColor) return false;
    const c = textColor.toLowerCase().trim();
    if (c === "white" || c.includes("fff") || c.includes("faf") || c.includes("f0f")) return true;
    if (c.startsWith("#") && (c.length === 4 || c.length === 7)) {
        let hex = c.slice(1);
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) > 180;
    }
    return false;
}

// ─── Global CSS ────────────────────────────────────────────────────────────────
export const globalResponsiveCss = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; }
img { max-width: 100%; height: auto; display: block; }

@keyframes sp-spin { to { transform: rotate(360deg); } }
@keyframes sp-fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes sp-scaleIn { from { opacity: 0; transform: scale(0.93); } to { opacity: 1; transform: scale(1); } }

.sp-animate-up { animation: sp-fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
.sp-animate-scale { animation: sp-scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }

.sp-card-lift {
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
  cursor: pointer;
}
.sp-card-lift:hover { transform: translateY(-10px); }

.sp-img-zoom { overflow: hidden; }
.sp-img-zoom img { transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
.sp-img-zoom:hover img { transform: scale(1.08); }

.sp-btn-base {
  display: inline-flex; align-items: center; gap: 8px;
  border: none; cursor: pointer; font-family: inherit;
  font-weight: 700; text-decoration: none; transition: all 0.25s ease;
  white-space: nowrap; letter-spacing: -0.01em;
}
.sp-btn-base:hover { transform: translateY(-3px); }

.sp-nav-link { text-decoration: none; font-weight: 600; font-size: 14px; transition: opacity 0.2s; opacity: 0.7; }
.sp-nav-link:hover { opacity: 1; }

.sp-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 14px; border-radius: 100px;
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em;
}

/* ─ Responsive ─ */
@media (max-width: 1024px) {
  .sp-grid-halves, .sp-grid-thirds { grid-template-columns: 1fr !important; }
  .sp-grid-thirds-2 { grid-template-columns: 1fr 1fr !important; }
}
@media (max-width: 768px) {
  .sp-section-pad { padding: 64px 20px !important; }
  .sp-grid-halves, .sp-grid-thirds, .sp-grid-thirds-2, .sp-grid-quarters { grid-template-columns: 1fr !important; gap: 20px !important; }
  .sp-hero-h1 { font-size: clamp(2.2rem, 9vw, 3rem) !important; }
  .sp-hero-h2 { font-size: clamp(1.8rem, 7vw, 2.4rem) !important; }
  .sp-hide-mobile { display: none !important; }
  .sp-nav-links { display: none !important; }
  .sp-footer-cols { grid-template-columns: 1fr 1fr !important; }
}
@media (max-width: 480px) {
  .sp-grid-thirds-2, .sp-footer-cols { grid-template-columns: 1fr !important; }
  .sp-hero-h1 { font-size: 2rem !important; }
}

.sp-page-nav {
  position: fixed; bottom: 18px; left: 50%; transform: translateX(-50%);
  z-index: 9999; display: flex; gap: 4px;
  background: rgba(0,0,0,0.75); backdrop-filter: blur(20px);
  padding: 6px; border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
`;

// ─── Decorative Blobs ──────────────────────────────────────────────────────────
const GlowBlob = ({ color, style = {} }) => (
    <div style={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(circle, ${color}35 0%, transparent 70%)`,
        filter: "blur(72px)", ...style,
    }} />
);

// ─── NAVBAR SECTION ────────────────────────────────────────────────────────────
const NavbarSection = ({ props, branding, allPages, currentPage, onPageChange }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "#ffffff";
    const tc = props.textColor || "#111827";
    const light = isLightText(tc);
    const variant = props.variant || "Full Width Solid";
    const font = props.fontFamily || branding?.font || "Inter";
    useEffect(() => { loadFont(font); }, [font]);

    const brand = props.brand || "Brand";
    const links = props.links || ["Home", "About", "Services", "Contact"];
    const fontStyle = `"${font}", "Inter", sans-serif`;

    const brandEl = (
        <span style={{ fontWeight: 900, fontSize: "22px", color: accent, letterSpacing: "-0.03em", fontFamily: fontStyle }}>
            {brand}
        </span>
    );

    // Map custom links to actual pages or custom URLs
    const linksEl = (
        <div className="sp-nav-links" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            {allPages && allPages.length > 0 ? (
                // Use actual pages for navigation (PRIORITY)
                allPages.map((page, i) => (
                    <button
                        key={page._id || i}
                        onClick={() => onPageChange && onPageChange(page)}
                        className="sp-nav-link"
                        style={{
                            color: tc,
                            fontFamily: fontStyle,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: currentPage?._id === page._id ? 700 : 600,
                            opacity: currentPage?._id === page._id ? 1 : 0.7,
                        }}
                    >
                        {page.title}
                    </button>
                ))
            ) : (
                // Fallback to custom links if no pages provided
                links.map((item, i) => {
                    const isObj = typeof item === 'object' && item !== null;
                    const label = isObj ? item.label : item;
                    const url = isObj ? item.url : `#${label.toLowerCase().replace(/\s/g, "-")}`;

                    // Try to handle internal routing using onPageChange
                    if (url.startsWith('/') && onPageChange && allPages) {
                        const targetSlug = url === '/' ? 'home' : url.substring(1);
                        const matchedPage = allPages.find(p => p.slug === targetSlug);
                        if (matchedPage) {
                            return (
                                <button
                                    key={i}
                                    onClick={() => onPageChange(matchedPage)}
                                    className="sp-nav-link"
                                    style={{
                                        color: tc,
                                        fontFamily: fontStyle,
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: currentPage?._id === matchedPage._id ? 700 : 600,
                                        opacity: currentPage?._id === matchedPage._id ? 1 : 0.7,
                                    }}
                                >
                                    {label}
                                </button>
                            );
                        }
                    }

                    return (
                        <a key={i} href={url} className="sp-nav-link" style={{ color: tc, fontFamily: fontStyle }}>{label}</a>
                    );
                })
            )}
        </div>
    );

    const ctaEl = (
        <button className="sp-btn-base" style={{ background: accent, color: light ? "#000" : "#fff", padding: "11px 24px", borderRadius: "100px", fontSize: "13px", fontFamily: fontStyle, boxShadow: `0 4px 16px ${accent}55` }}>
            Get Started
        </button>
    );

    if (variant === "Glassy Island") {
        return (
            <div style={{ padding: "14px 24px", position: "sticky", top: 0, zIndex: 100 }}>
                <nav style={{
                    background: light ? "rgba(10,10,20,0.85)" : "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(24px) saturate(2)",
                    border: `1px solid ${light ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
                    borderRadius: "100px", padding: "14px 28px",
                    maxWidth: "1060px", margin: "0 auto",
                    boxShadow: light ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.08)",
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {brandEl}
                        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                            {linksEl}
                            {ctaEl}
                        </div>
                    </div>
                </nav>
            </div>
        );
    }

    if (variant === "Minimal Transparent") {
        return (
            <nav style={{ padding: "28px 56px", background: "transparent", position: "absolute", top: 0, left: 0, right: 0, zIndex: 100 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1320px", margin: "0 auto" }}>
                    <span style={{ fontWeight: 900, fontSize: "18px", color: tc, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: fontStyle }}>{brand}</span>
                    <div className="sp-nav-links" style={{ display: "flex", gap: "40px", alignItems: "center" }}>
                        {allPages && allPages.length > 0 ? (
                            // Use actual pages for navigation (PRIORITY)
                            allPages.map((page, i) => (
                                <button
                                    key={page._id || i}
                                    onClick={() => onPageChange && onPageChange(page)}
                                    className="sp-nav-link"
                                    style={{
                                        color: tc,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        fontSize: "12px",
                                        fontFamily: fontStyle,
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: currentPage?._id === page._id ? 700 : 600,
                                        opacity: currentPage?._id === page._id ? 1 : 0.7,
                                    }}
                                >
                                    {page.title}
                                </button>
                            ))
                        ) : (
                            // Fallback to custom links
                            links.map((item, i) => {
                                const isObj = typeof item === 'object' && item !== null;
                                const label = isObj ? item.label : item;
                                const url = isObj ? item.url : `#${label.toLowerCase().replace(/\s/g, "-")}`;

                                // Try to handle internal routing using onPageChange
                                if (url.startsWith('/') && onPageChange && allPages) {
                                    const targetSlug = url === '/' ? 'home' : url.substring(1);
                                    const matchedPage = allPages.find(p => p.slug === targetSlug);
                                    if (matchedPage) {
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => onPageChange(matchedPage)}
                                                className="sp-nav-link"
                                                style={{
                                                    color: tc,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.08em",
                                                    fontSize: "12px",
                                                    fontFamily: fontStyle,
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    fontWeight: currentPage?._id === matchedPage._id ? 700 : 600,
                                                    opacity: currentPage?._id === matchedPage._id ? 1 : 0.7,
                                                }}
                                            >
                                                {label}
                                            </button>
                                        );
                                    }
                                }

                                return (
                                    <a key={i} href={url} className="sp-nav-link" style={{ color: tc, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "12px", fontFamily: fontStyle }}>{label}</a>
                                );
                            })
                        )}
                    </div>
                </div>
            </nav>
        );
    }

    // Full Width Solid (default)
    return (
        <nav style={{ background: bg, borderBottom: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`, padding: "18px 48px", position: "sticky", top: 0, zIndex: 100 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1320px", margin: "0 auto" }}>
                {brandEl}
                <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                    {linksEl}
                    {ctaEl}
                </div>
            </div>
        </nav>
    );
};

// ─── HERO SECTION ──────────────────────────────────────────────────────────────
const HeroSection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "#ffffff";
    const tc = props.textColor || "#111827";
    const light = isLightText(tc);
    const variant = props.variant || "Split Text Left";
    const font = props.fontFamily || branding?.font || "Inter";
    useEffect(() => { loadFont(font); }, [font]);
    const fontStyle = `"${font}", "Plus Jakarta Sans", sans-serif`;

    // Image: AI-generated sites have a resolved URL in backgroundImage.
    // For templates using keywords, useUnsplashImage fetches via the proxy.
    const heroQuery = props.backgroundImage && props.backgroundImage.startsWith("http")
        ? props.backgroundImage
        : (props.backgroundImageQuery || props.backgroundImage || "professional workspace");
    const heroImgUrl = useUnsplashImage(heroQuery, 1400, 900);

    const Badge = () => (
        <div className="sp-badge sp-animate-up" style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30`, marginBottom: "20px", animationDelay: "0.05s", fontFamily: fontStyle }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, display: "inline-block" }} />
            Now Available
        </div>
    );

    const CTARow = () => (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", marginTop: "36px" }}>
            {props.ctaText && (
                <a href={props.ctaLink || "#"} className="sp-btn-base sp-animate-up" style={{ background: accent, color: light ? "#000" : "#fff", padding: "16px 36px", borderRadius: "100px", fontSize: "16px", fontFamily: fontStyle, boxShadow: DS.shadow.colored(accent), animationDelay: "0.35s" }}>
                    {props.ctaText}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                </a>
            )}
            <a href="#learn" className="sp-btn-base sp-animate-up" style={{ background: "transparent", color: tc, padding: "16px 32px", border: `2px solid ${light ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"}`, borderRadius: "100px", fontSize: "15px", fontFamily: fontStyle, animationDelay: "0.45s" }}>
                Learn More
            </a>
        </div>
    );

    if (variant === "Centered Image Bg") {
        return (
            <section style={{ position: "relative", padding: "16px", background: bg }}>
                <div style={{ position: "relative", borderRadius: "40px", overflow: "hidden", minHeight: "90vh", display: "flex", alignItems: "flex-end", padding: "60px 6%" }}>
                    <img src={heroImgUrl} alt="Hero background" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} loading="eager" />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.1) 80%, transparent)", zIndex: 1 }} />
                    <div style={{ position: "relative", zIndex: 2, maxWidth: "700px" }}>
                        <Badge />
                        <h1 className="sp-hero-h1 sp-animate-up" style={{ fontSize: DS.font.h1, fontWeight: 900, color: "#fff", marginBottom: "18px", lineHeight: "1.05", letterSpacing: "-0.03em", fontFamily: fontStyle, animationDelay: "0.15s" }}>
                            {props.heading || "Design That Speaks"}
                        </h1>
                        {props.subheading && (
                            <p className="sp-animate-up" style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.75, maxWidth: "520px", fontFamily: fontStyle, animationDelay: "0.25s" }}>
                                {props.subheading}
                            </p>
                        )}
                        <CTARow />
                    </div>
                </div>
            </section>
        );
    }

    if (variant === "Split Text Right") {
        return (
            <section className="sp-section-pad" style={{ position: "relative", padding: "80px 56px", background: bg, overflow: "hidden", minHeight: "88vh", display: "flex", alignItems: "center" }}>
                <GlowBlob color={accent} style={{ top: "10%", right: "0%", width: "500px", height: "500px" }} />
                <div className="sp-grid-halves" style={{ position: "relative", zIndex: 1, maxWidth: "1320px", width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center" }}>
                    {/* Image first on left */}
                    <div className="sp-img-zoom sp-animate-scale" style={{ borderRadius: "28px", overflow: "hidden", aspectRatio: "4/5", boxShadow: DS.shadow.xl, position: "relative" }}>
                        <img src={heroImgUrl} alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="eager"
                            onError={e => { e.target.src = getImageUrl("professional", 800, 1000); }} />
                        {/* Floating card */}
                        <div style={{ position: "absolute", bottom: "24px", left: "-20px", background: light ? "rgba(10,15,30,0.92)" : "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)", padding: "14px 20px", borderRadius: "16px", boxShadow: DS.shadow.lg, display: "flex", gap: "12px", alignItems: "center", border: `1px solid ${light ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${accent}22`, display: "flex", alignItems: "center", justifyContent: "center", color: accent, fontSize: "18px" }}>✦</div>
                            <div>
                                <p style={{ fontSize: "11px", color: tc, opacity: 0.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: fontStyle }}>Trusted By</p>
                                <p style={{ fontSize: "15px", fontWeight: 800, color: tc, fontFamily: fontStyle }}>5,000+ Clients</p>
                            </div>
                        </div>
                    </div>
                    {/* Text */}
                    <div>
                        <Badge />
                        <h1 className="sp-hero-h1 sp-animate-up" style={{ fontSize: DS.font.h1, fontWeight: 900, color: tc, marginBottom: "18px", lineHeight: "1.05", letterSpacing: "-0.03em", fontFamily: fontStyle, animationDelay: "0.15s" }}>
                            {props.heading || "Built For The Future"}
                        </h1>
                        {props.subheading && (
                            <p className="sp-animate-up" style={{ fontSize: "1.15rem", color: tc, opacity: 0.72, lineHeight: 1.78, fontFamily: fontStyle, animationDelay: "0.25s" }}>
                                {props.subheading}
                            </p>
                        )}
                        <CTARow />
                    </div>
                </div>
            </section>
        );
    }

    // Default: Split Text Left
    return (
        <section className="sp-section-pad" style={{ position: "relative", padding: "80px 56px", background: bg, overflow: "hidden", minHeight: "88vh", display: "flex", alignItems: "center" }}>
            <GlowBlob color={accent} style={{ top: "-10%", left: "-5%", width: "600px", height: "600px" }} />
            <GlowBlob color={accent} style={{ bottom: "-15%", right: "5%", width: "400px", height: "400px", opacity: 0.4 }} />
            <div className="sp-grid-halves" style={{ position: "relative", zIndex: 1, maxWidth: "1320px", width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center" }}>
                {/* Text */}
                <div>
                    <Badge />
                    <h1 className="sp-hero-h1 sp-animate-up" style={{ fontSize: DS.font.h1, fontWeight: 900, color: tc, marginBottom: "18px", lineHeight: "1.05", letterSpacing: "-0.03em", fontFamily: fontStyle, animationDelay: "0.1s" }}>
                        {props.heading || "The Future Is Here"}
                    </h1>
                    {props.subheading && (
                        <p className="sp-animate-up" style={{ fontSize: "1.15rem", color: tc, opacity: 0.72, lineHeight: 1.78, maxWidth: "480px", fontFamily: fontStyle, animationDelay: "0.2s" }}>
                            {props.subheading}
                        </p>
                    )}
                    <CTARow />
                    {/* Stars / social proof */}
                    <div className="sp-animate-up" style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "40px", paddingTop: "28px", borderTop: `1px solid ${light ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`, animationDelay: "0.55s" }}>
                        <div style={{ display: "flex" }}>
                            {["😊", "🤩", "👏", "⭐"].map((e, i) => (
                                <div key={i} style={{ width: "34px", height: "34px", borderRadius: "50%", background: `hsl(${i * 55}, 60%, 55%)`, border: `2px solid ${bg}`, marginLeft: i > 0 ? "-8px" : "0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>{e}</div>
                            ))}
                        </div>
                        <div>
                            <div style={{ color: "#f59e0b", fontSize: "13px" }}>★★★★★</div>
                            <p style={{ fontSize: "12px", color: tc, opacity: 0.55, marginTop: "2px", fontFamily: fontStyle }}>Loved by thousands</p>
                        </div>
                    </div>
                </div>
                {/* Image */}
                <div className="sp-img-zoom sp-animate-scale" style={{ borderRadius: "28px", overflow: "hidden", aspectRatio: "4/5", boxShadow: DS.shadow.xl, position: "relative", animationDelay: "0.15s" }}>
                    <img src={heroImgUrl} alt="Hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="eager"
                        onError={e => { e.target.src = getImageUrl("professional", 800, 1000); }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "5px", background: `linear-gradient(to right, ${accent}, ${accent}66)` }} />
                </div>
            </div>
        </section>
    );
};

// ─── TEXT SECTION ──────────────────────────────────────────────────────────────
const TextSection = ({ props, branding }) => {
    const bg = props.bgColor || "#f9fafb";
    const tc = props.textColor || "#111827";
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const light = isLightText(tc);
    const variant = props.variant || "Centered Standard";
    const font = props.fontFamily || branding?.font || "Inter";
    useEffect(() => { loadFont(font); }, [font]);
    const fontStyle = `"${font}", "Inter", sans-serif`;

    const Chip = ({ text }) => (
        <div className="sp-badge" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}28`, marginBottom: "18px", fontFamily: fontStyle }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent }} />
            {text}
        </div>
    );

    if (variant === "Left Aligned Big") {
        return (
            <section className="sp-section-pad" style={{ position: "relative", padding: "96px 56px", background: bg, overflow: "hidden" }}>
                <GlowBlob color={accent} style={{ top: "-5%", right: "-5%", width: "450px", height: "450px", opacity: 0.5 }} />
                <div className="sp-grid-halves" style={{ position: "relative", zIndex: 1, maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "start" }}>
                    <div>
                        <Chip text="About Us" />
                        {props.heading && (
                            <h2 className="sp-hero-h2 sp-animate-up" style={{ fontSize: DS.font.h2, fontWeight: 900, color: tc, lineHeight: "1.1", letterSpacing: "-0.03em", fontFamily: fontStyle }}>
                                {props.heading}
                            </h2>
                        )}
                        <div style={{ width: "52px", height: "4px", background: `linear-gradient(to right, ${accent}, ${accent}55)`, borderRadius: "2px", marginTop: "24px" }} />
                    </div>
                    <div>
                        <div style={{ position: "relative", background: light ? "rgba(255,255,255,0.05)" : "#fff", padding: "40px", borderRadius: "24px", border: `1px solid ${light ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"}`, boxShadow: DS.shadow.lg }}>
                            <div style={{ position: "absolute", top: "-16px", left: "28px", width: "32px", height: "32px", borderRadius: "8px", background: accent, color: light ? "#000" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800, boxShadow: DS.shadow.colored(accent) }}>"</div>
                            {props.description && <p style={{ fontSize: "1.1rem", lineHeight: "1.85", color: tc, opacity: 0.8, fontFamily: fontStyle }}>{props.description}</p>}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "20px" }}>
                            {[["10+", "Years"], ["500+", "Projects"]].map(([n, l]) => (
                                <div key={l} style={{ padding: "18px", borderRadius: "16px", background: light ? "rgba(255,255,255,0.04)" : "#fff", border: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`, textAlign: "center" }}>
                                    <p style={{ fontSize: "1.8rem", fontWeight: 900, color: accent, fontFamily: fontStyle }}>{n}</p>
                                    <p style={{ fontSize: "12px", color: tc, opacity: 0.55, fontFamily: fontStyle }}>{l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (variant === "Card Based") {
        return (
            <section className="sp-section-pad" style={{ position: "relative", padding: "96px 56px", background: bg, overflow: "hidden" }}>
                <div style={{ position: "relative", zIndex: 1, maxWidth: "860px", margin: "0 auto" }}>
                    <div style={{ position: "relative", background: light ? "rgba(255,255,255,0.04)" : "#fff", padding: "64px 56px", borderRadius: "40px", boxShadow: DS.shadow.xl, textAlign: "center", border: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}>
                        <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: "3px", background: `linear-gradient(to right, transparent, ${accent}, transparent)`, borderRadius: "2px" }} />
                        <Chip text="Why Us" />
                        {props.heading && <h2 className="sp-hero-h2 sp-animate-up" style={{ fontSize: DS.font.h2, fontWeight: 900, color: tc, marginBottom: "20px", lineHeight: "1.1", letterSpacing: "-0.03em", fontFamily: fontStyle }}>{props.heading}</h2>}
                        {props.description && <p style={{ fontSize: "1.08rem", lineHeight: "1.85", color: tc, opacity: 0.72, maxWidth: "580px", margin: "0 auto", fontFamily: fontStyle }}>{props.description}</p>}
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginTop: "32px" }}>
                            {["Premium Quality", "24/7 Support", "Proven Results", "Expert Team"].map(f => (
                                <span key={f} style={{ padding: "7px 16px", borderRadius: "100px", background: `${accent}12`, color: accent, fontSize: "13px", fontWeight: 600, border: `1px solid ${accent}22`, fontFamily: fontStyle }}>{f}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Centered Standard
    return (
        <section className="sp-section-pad" style={{ position: "relative", padding: "100px 56px", background: bg }}>
            <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
                <Chip text="Our Mission" />
                {props.heading && <h2 className="sp-hero-h2 sp-animate-up" style={{ fontSize: DS.font.h2, fontWeight: 900, color: tc, marginBottom: "20px", lineHeight: "1.1", letterSpacing: "-0.03em", fontFamily: fontStyle }}>{props.heading}</h2>}
                {props.description && <p style={{ fontSize: "1.1rem", lineHeight: "1.85", color: tc, opacity: 0.72, fontFamily: fontStyle }}>{props.description}</p>}
            </div>
        </section>
    );
};

// ─── GALLERY SECTION ───────────────────────────────────────────────────────────
const GallerySection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "#ffffff";
    const tc = props.textColor || "#111827";
    const light = isLightText(tc);
    const variant = props.variant || "Modern Grid";
    const font = props.fontFamily || branding?.font || "Inter";
    useEffect(() => { loadFont(font); }, [font]);
    const fontStyle = `"${font}", "Inter", sans-serif`;

    const items = (props.items || []).map((item, i) => {
        if (typeof item === "string") return { title: item, description: "Premium quality and craftsmanship.", imageQuery: item };
        return { title: item?.title || `Item ${i + 1}`, description: item?.description || "Premium quality.", imageQuery: item?.imageQuery || item?.title || "professional" };
    });

    const SectionHeader = () => props.heading ? (
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="sp-badge" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}28`, marginBottom: "14px", fontFamily: fontStyle }}>Our Work</div>
            <h2 className="sp-hero-h2 sp-animate-up" style={{ fontSize: DS.font.h2, fontWeight: 900, color: tc, lineHeight: "1.1", letterSpacing: "-0.03em", fontFamily: fontStyle }}>
                {props.heading}
            </h2>
        </div>
    ) : null;

    const GridCard = ({ item, idx }) => {
        // item.image is pre-resolved by the AI controller (real Unsplash URL)
        // For template/editor images, fall back to imageQuery or title
        const imgQuery = item.image && item.image.startsWith("http")
            ? item.image
            : (item.imageQuery || item.title || "professional");
        const img = useUnsplashImage(imgQuery, 640, 480);
        return (
            <div className="sp-card-lift sp-img-zoom sp-animate-scale" style={{ background: light ? "rgba(255,255,255,0.04)" : "#fff", borderRadius: "20px", overflow: "hidden", border: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, boxShadow: DS.shadow.md, animationDelay: `${idx * 0.07}s` }}>
                <div style={{ height: "210px", overflow: "hidden", position: "relative" }}>
                    <img src={img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy"
                        onError={e => { e.target.src = getStaticFallbackUrl("professional workspace", 640, 480); }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.35))" }} />
                    <div style={{ position: "absolute", top: "12px", left: "12px", width: "30px", height: "30px", borderRadius: "8px", background: accent, color: light ? "#000" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "12px", boxShadow: DS.shadow.sm }}>
                        {String(idx + 1).padStart(2, "0")}
                    </div>
                </div>
                <div style={{ padding: "22px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: tc, marginBottom: "6px", fontFamily: fontStyle }}>{item.title}</h3>
                    <p style={{ fontSize: "13px", color: tc, opacity: 0.6, lineHeight: "1.65", fontFamily: fontStyle }}>{item.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px", paddingTop: "14px", borderTop: `1px solid ${light ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}` }}>
                        <div style={{ color: "#f59e0b", fontSize: "11px" }}>★★★★★</div>
                        <a href="#" style={{ fontSize: "12px", color: accent, fontWeight: 700, textDecoration: "none", fontFamily: fontStyle }}>View →</a>
                    </div>
                </div>
            </div>
        );

    };

    if (variant === "Horizontal Scroll" || variant === "Horizontal Flex") {
        return (
            <section style={{ padding: "80px 0", background: bg }}>
                <div style={{ maxWidth: "1320px", margin: "0 auto", paddingLeft: "56px" }}>
                    {props.heading && (
                        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "36px", paddingRight: "56px", flexWrap: "wrap", gap: "12px" }}>
                            <h2 style={{ fontSize: DS.font.h2, fontWeight: 900, color: tc, letterSpacing: "-0.03em", fontFamily: fontStyle }}>{props.heading}</h2>
                            <a href="#all" style={{ color: accent, fontWeight: 700, textDecoration: "none", fontSize: "14px", fontFamily: fontStyle }}>View All →</a>
                        </div>
                    )}
                </div>
                <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingLeft: "56px", paddingRight: "56px", paddingBottom: "16px", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
                    {items.map((item, i) => {
                        const img = resolveItemImage(item, 480, 360);
                        return (
                            <div key={i} className="sp-card-lift sp-img-zoom" style={{ scrollSnapAlign: "start", flex: "0 0 280px", background: light ? "rgba(255,255,255,0.04)" : "#fff", borderRadius: "20px", overflow: "hidden", border: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, boxShadow: DS.shadow.md }}>
                                <div style={{ height: "180px", overflow: "hidden" }}>
                                    <img src={img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy"
                                        onError={e => { e.target.src = getImageUrl("professional", 480, 360); }} />
                                </div>
                                <div style={{ padding: "20px" }}>
                                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: tc, marginBottom: "5px", fontFamily: fontStyle }}>{item.title}</h3>
                                    <p style={{ fontSize: "12px", color: tc, opacity: 0.6, lineHeight: "1.6", fontFamily: fontStyle }}>{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    }

    if (variant === "Bento Grid") {
        return (
            <section className="sp-section-pad" style={{ padding: "96px 56px", background: bg }}>
                <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
                    <SectionHeader />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridAutoRows: "260px", gap: "18px" }}>
                        {items.slice(0, 6).map((item, i) => {
                            const big = i === 0;
                            const wide = i === 3;
                            const img = resolveItemImage(item, big ? 900 : 500, big ? 600 : 300);
                            return (
                                <div key={i} className="sp-card-lift sp-img-zoom" style={{ gridColumn: big || wide ? "span 2" : "span 1", gridRow: big ? "span 2" : "span 1", borderRadius: "22px", overflow: "hidden", position: "relative", boxShadow: DS.shadow.lg }}>
                                    <img src={img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} loading="lazy"
                                        onError={e => { e.target.src = getImageUrl("professional", 900, 600); }} />
                                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)" }} />
                                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px" }}>
                                        <span className="sp-badge" style={{ background: accent, color: light ? "#000" : "#fff", marginBottom: "8px", fontFamily: fontStyle }}>Featured</span>
                                        <h3 style={{ color: "#fff", fontSize: big ? "1.5rem" : "1rem", fontWeight: 800, fontFamily: fontStyle }}>{item.title}</h3>
                                        {big && <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", marginTop: "6px", fontFamily: fontStyle }}>{item.description}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }

    if (variant === "Masonry Column") {
        return (
            <section className="sp-section-pad" style={{ padding: "96px 56px", background: bg }}>
                <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
                    <SectionHeader />
                    <div className="sp-grid-thirds" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "22px" }}>
                        {items.map((item, i) => <GridCard key={i} item={item} idx={i} />)}
                    </div>
                </div>
            </section>
        );
    }

    // Modern Grid (default)
    return (
        <section className="sp-section-pad" style={{ padding: "96px 56px", background: bg }}>
            <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
                <SectionHeader />
                <div className="sp-grid-thirds" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "22px" }}>
                    {items.map((item, i) => <GridCard key={i} item={item} idx={i} />)}
                </div>
            </div>
        </section>
    );
};

// ─── CTA SECTION ───────────────────────────────────────────────────────────────
const CTASection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "#ffffff";
    const tc = props.textColor || "#111827";
    const light = isLightText(tc);
    const variant = props.variant || "Centered Large";
    const font = props.fontFamily || branding?.font || "Inter";
    useEffect(() => { loadFont(font); }, [font]);
    const fontStyle = `"${font}", "Inter", sans-serif`;

    if (variant === "Floating Pill") {
        return (
            <section style={{ padding: "48px 56px", background: bg }}>
                <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "26px 40px", borderRadius: "100px", background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", boxShadow: DS.shadow.colored(accent), flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🚀</div>
                        <div>
                            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", fontFamily: fontStyle, letterSpacing: "-0.02em" }}>{props.heading || "Ready to dive in?"}</h2>
                            {props.subheading && <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontFamily: fontStyle }}>{props.subheading}</p>}
                        </div>
                    </div>
                    {props.ctaText && (
                        <a href={props.ctaLink || "#"} className="sp-btn-base" style={{ background: "#fff", color: accent, padding: "14px 36px", borderRadius: "100px", fontSize: "15px", fontFamily: fontStyle, boxShadow: "0 8px 20px rgba(0,0,0,0.15)", flexShrink: 0 }}>
                            {props.ctaText}
                        </a>
                    )}
                </div>
            </section>
        );
    }

    if (variant === "Split Screen CTA") {
        return (
            <section style={{ display: "flex", flexWrap: "wrap", minHeight: "520px", overflow: "hidden" }}>
                <div className="sp-grid-halves" style={{ flex: "1 1 50%", padding: "88px 72px", background: `linear-gradient(140deg, ${accent} 0%, ${accent}aa 100%)`, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <GlowBlob color="rgba(255,255,255,0.25)" style={{ top: "-40%", right: "-10%", width: "400px", height: "400px", filter: "blur(40px)" }} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                        {props.heading && <h2 style={{ fontSize: DS.font.h2, fontWeight: 900, color: "#fff", marginBottom: "18px", lineHeight: "1.1", letterSpacing: "-0.03em", fontFamily: fontStyle }}>{props.heading}</h2>}
                        {props.subheading && <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.72, fontFamily: fontStyle }}>{props.subheading}</p>}
                    </div>
                </div>
                <div style={{ flex: "1 1 50%", padding: "88px 72px", display: "flex", alignItems: "center", justifyContent: "center", background: light ? "#111" : "#f9fafb", position: "relative" }}>
                    <GlowBlob color={accent} style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "400px", height: "400px" }} />
                    <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "360px", width: "100%" }}>
                        <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: accent, fontSize: "24px" }}>✦</div>
                        {props.ctaText && (
                            <a href={props.ctaLink || "#"} className="sp-btn-base" style={{ background: accent, color: light ? "#000" : "#fff", padding: "18px 0", borderRadius: "14px", width: "100%", justifyContent: "center", fontFamily: fontStyle, boxShadow: DS.shadow.colored(accent), fontSize: "16px" }}>
                                {props.ctaText}
                            </a>
                        )}
                        <p style={{ marginTop: "14px", fontSize: "12px", color: tc, opacity: 0.45, fontFamily: fontStyle }}>No commitment required.</p>
                    </div>
                </div>
            </section>
        );
    }

    if (variant === "Dark Banner") {
        return (
            <section style={{ padding: "80px 56px", background: "#0f172a", position: "relative", overflow: "hidden" }}>
                <GlowBlob color={accent} style={{ top: "50%", left: "15%", transform: "translateY(-50%)", width: "500px", height: "500px" }} />
                <GlowBlob color={accent} style={{ top: "50%", right: "5%", transform: "translateY(-50%)", width: "300px", height: "300px", opacity: 0.5 }} />
                <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
                    {props.heading && <h2 style={{ fontSize: DS.font.h2, fontWeight: 900, color: "#fff", marginBottom: "18px", letterSpacing: "-0.03em", fontFamily: fontStyle }}>{props.heading}</h2>}
                    {props.subheading && <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.72, marginBottom: "32px", fontFamily: fontStyle }}>{props.subheading}</p>}
                    {props.ctaText && (
                        <a href={props.ctaLink || "#"} className="sp-btn-base" style={{ background: accent, color: "#fff", padding: "16px 40px", borderRadius: "100px", fontSize: "16px", fontFamily: fontStyle, boxShadow: DS.shadow.colored(accent) }}>
                            {props.ctaText}
                        </a>
                    )}
                </div>
            </section>
        );
    }

    // Centered Large (default)
    return (
        <section style={{ padding: "96px 56px", background: bg, position: "relative", overflow: "hidden" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "72px 56px", borderRadius: "40px", background: light ? "rgba(255,255,255,0.03)" : "#f4f4f6", border: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`, textAlign: "center", position: "relative", overflow: "hidden", boxShadow: light ? "0 40px 80px rgba(0,0,0,0.4)" : DS.shadow.xl, zIndex: 1 }}>
                <GlowBlob color={accent} style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px" }} />
                <div style={{ position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto" }}>
                    <div className="sp-badge" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25`, marginBottom: "20px", fontFamily: fontStyle }}>Take Action</div>
                    {props.heading && <h2 style={{ fontSize: DS.font.h2, fontWeight: 900, color: tc, marginBottom: "18px", letterSpacing: "-0.03em", fontFamily: fontStyle }}>{props.heading}</h2>}
                    {props.subheading && <p style={{ fontSize: "1.08rem", color: tc, opacity: 0.72, lineHeight: 1.75, marginBottom: "36px", fontFamily: fontStyle }}>{props.subheading}</p>}
                    <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                        {props.ctaText && (
                            <a href={props.ctaLink || "#"} className="sp-btn-base" style={{ background: accent, color: light ? "#000" : "#fff", padding: "16px 40px", borderRadius: "100px", fontSize: "16px", fontFamily: fontStyle, boxShadow: DS.shadow.colored(accent) }}>
                                {props.ctaText}
                            </a>
                        )}
                        <a href="#learn" className="sp-btn-base" style={{ background: "transparent", color: tc, border: `2px solid ${light ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"}`, padding: "16px 36px", borderRadius: "100px", fontSize: "15px", fontFamily: fontStyle }}>
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ─── CONTACT FORM SECTION ──────────────────────────────────────────────────────
const ContactFormSection = ({ props, branding, websiteId }) => {
    const fields = props.fields || ["name", "email", "message"];
    const [formData, setFormData] = useState(() => fields.reduce((a, f) => ({ ...a, [f]: "" }), {}));
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formError, setFormError] = useState(null);

    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "#ffffff";
    const tc = props.textColor || "#111827";
    const light = isLightText(tc);
    const variant = props.variant || "Left Text Right Form";
    const font = props.fontFamily || branding?.font || "Inter";
    useEffect(() => { loadFont(font); }, [font]);
    const fontStyle = `"${font}", "Inter", sans-serif`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true); setFormError(null);
        if (!websiteId) { setFormError("Website ID not found."); setSubmitting(false); return; }
        try {
            const r = await fetch(`/api/public/forms/submit/${websiteId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
            const res = await r.json();
            if (res.success) setSubmitted(true); else setFormError(res.message || "Failed");
        } catch { setFormError("Failed to submit. Try again."); }
        finally { setSubmitting(false); }
    };

    const handleInputChange = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const inputStyle = { padding: "13px 16px", borderRadius: "12px", fontSize: "14px", background: light ? "rgba(255,255,255,0.06)" : "#f9fafb", border: `1.5px solid ${light ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`, color: tc, fontFamily: fontStyle, width: "100%", outline: "none" };

    if (submitted) {
        return (
            <section style={{ padding: "80px 56px", background: bg }}>
                <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center", padding: "56px 40px", borderRadius: "32px", background: light ? "rgba(255,255,255,0.04)" : "#fff", border: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`, boxShadow: DS.shadow.xl }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", margin: "0 auto 20px", boxShadow: DS.shadow.colored(accent) }}>✓</div>
                    <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: tc, marginBottom: "10px", fontFamily: fontStyle }}>Message Sent!</h3>
                    <p style={{ color: tc, opacity: 0.65, fontFamily: fontStyle }}>We&apos;ll get back to you within 24 hours.</p>
                </div>
            </section>
        );
    }

    if (variant === "Centered Card") {
        return (
            <section style={{ padding: "96px 56px", background: bg, position: "relative", overflow: "hidden" }}>
                <GlowBlob color={accent} style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px" }} />
                <div style={{ position: "relative", zIndex: 1, maxWidth: "560px", margin: "0 auto", background: light ? "rgba(15,15,25,0.7)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(24px)", padding: "56px 48px", borderRadius: "36px", border: `1px solid ${light ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`, boxShadow: DS.shadow.xl }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: accent }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </div>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: tc, textAlign: "center", marginBottom: "28px", fontFamily: fontStyle }}>{props.heading || "Contact Us"}</h2>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {formError && <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontWeight: 600, fontSize: "13px", fontFamily: fontStyle }}>{formError}</div>}
                        {fields.map(field => {
                            const f = field.toLowerCase();
                            const isArea = f.includes("message") || f.includes("comment");
                            const label = field.charAt(0).toUpperCase() + field.slice(1);
                            return isArea
                                ? <textarea key={f} name={f} placeholder={label} rows={4} value={formData[f] || ""} onChange={e => handleInputChange(f, e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
                                : <input key={f} type={f.includes("email") ? "email" : "text"} name={f} placeholder={label} value={formData[f] || ""} onChange={e => handleInputChange(f, e.target.value)} style={inputStyle} />;
                        })}
                        <button type="submit" disabled={submitting} className="sp-btn-base" style={{ background: submitting ? "rgba(100,100,100,0.5)" : accent, color: "#fff", padding: "15px", justifyContent: "center", borderRadius: "12px", width: "100%", fontSize: "15px", fontFamily: fontStyle, boxShadow: submitting ? "none" : DS.shadow.colored(accent), cursor: submitting ? "not-allowed" : "pointer", marginTop: "4px" }}>
                            {submitting ? "Sending…" : (props.submitText || "Send Message")}
                        </button>
                    </form>
                </div>
            </section>
        );
    }

    return (
        <section style={{ padding: "96px 56px", background: bg, position: "relative", overflow: "hidden" }}>
            <div className="sp-grid-halves" style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center", position: "relative", zIndex: 1 }}>
                <div>
                    <div className="sp-badge" style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}25`, marginBottom: "18px", fontFamily: fontStyle }}>Get In Touch</div>
                    <h2 style={{ fontSize: DS.font.h2, fontWeight: 900, color: tc, marginBottom: "18px", letterSpacing: "-0.03em", fontFamily: fontStyle }}>{props.heading || "Let's Talk"}</h2>
                    <p style={{ fontSize: "1.05rem", color: tc, opacity: 0.7, lineHeight: 1.75, marginBottom: "36px", fontFamily: fontStyle }}>Fill out the form and we&apos;ll respond promptly.</p>
                    {[["📧", "Email", "hello@company.com"], ["📞", "Phone", "+1 (555) 000-0000"], ["📍", "Location", "New York, USA"]].map(([icon, label, val]) => (
                        <div key={label} style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "14px", padding: "14px 18px", background: light ? "rgba(255,255,255,0.04)" : "#f9fafb", borderRadius: "14px", border: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}>
                            <span style={{ fontSize: "18px" }}>{icon}</span>
                            <div>
                                <p style={{ fontSize: "10px", color: tc, opacity: 0.45, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: fontStyle }}>{label}</p>
                                <p style={{ fontSize: "13px", fontWeight: 600, color: tc, fontFamily: fontStyle }}>{val}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ background: light ? "rgba(255,255,255,0.03)" : "#fff", padding: "44px", borderRadius: "32px", border: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`, boxShadow: DS.shadow.lg }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {formError && <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", color: "#ef4444", fontWeight: 600, fontSize: "13px", fontFamily: fontStyle }}>{formError}</div>}
                        {fields.map(field => {
                            const f = field.toLowerCase();
                            const isArea = f.includes("message") || f.includes("comment");
                            const label = field.charAt(0).toUpperCase() + field.slice(1);
                            return isArea
                                ? <textarea key={f} name={f} placeholder={label} rows={4} value={formData[f] || ""} onChange={e => handleInputChange(f, e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
                                : <input key={f} type={f.includes("email") ? "email" : "text"} name={f} placeholder={label} value={formData[f] || ""} onChange={e => handleInputChange(f, e.target.value)} style={inputStyle} />;
                        })}
                        <button type="submit" disabled={submitting} className="sp-btn-base" style={{ background: submitting ? "rgba(100,100,100,0.5)" : accent, color: "#fff", padding: "15px", justifyContent: "center", borderRadius: "12px", width: "100%", fontSize: "15px", fontFamily: fontStyle, boxShadow: submitting ? "none" : DS.shadow.colored(accent), cursor: submitting ? "not-allowed" : "pointer", marginTop: "4px" }}>
                            {submitting ? "Sending…" : (props.submitText || "Send Message")}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

// ─── FOOTER SECTION ────────────────────────────────────────────────────────────
const FooterSection = ({ props, branding }) => {
    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "#0f172a";
    const tc = props.textColor || "#9ca3af";
    const light = isLightText(tc);
    const variant = props.variant || "Simple Centered";
    const font = props.fontFamily || branding?.font || "Inter";
    useEffect(() => { loadFont(font); }, [font]);
    const fontStyle = `"${font}", "Inter", sans-serif`;
    const yr = new Date().getFullYear();

    if (variant === "Multi-Column Mock") {
        return (
            <footer style={{ background: bg, padding: "64px 56px 32px", borderTop: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}` }}>
                <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                    <div className="sp-footer-cols" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "48px" }}>
                        <div>
                            <h3 style={{ fontSize: "20px", fontWeight: 900, color: accent, marginBottom: "14px", fontFamily: fontStyle, letterSpacing: "-0.02em" }}>{props.brand || branding?.brandName || "Company"}</h3>
                            <p style={{ color: tc, opacity: 0.65, lineHeight: 1.8, maxWidth: "260px", fontSize: "14px", fontFamily: fontStyle }}>{props.text || "Building exceptional digital experiences."}</p>
                            <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
                                {["𝕏", "in", "►", "f"].map(s => (
                                    <a key={s} href="#" style={{ width: "34px", height: "34px", borderRadius: "8px", background: light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: tc, fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>{s}</a>
                                ))}
                            </div>
                        </div>
                        {[["Product", ["Features", "Pricing", "Changelog"]], ["Company", ["About", "Careers", "Blog"]], ["Legal", ["Privacy", "Terms", "Cookies"]]].map(([col, its]) => (
                            <div key={col}>
                                <h4 style={{ color: light ? "#fff" : "#111827", fontWeight: 700, fontSize: "13px", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: fontStyle }}>{col}</h4>
                                {its.map(item => <a key={item} href="#" style={{ display: "block", color: tc, opacity: 0.6, textDecoration: "none", marginBottom: "9px", fontSize: "14px", fontFamily: fontStyle }}>{item}</a>)}
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                        <p style={{ color: tc, opacity: 0.45, fontSize: "13px", fontFamily: fontStyle }}>© {yr} {props.brand || "Company"}. All rights reserved.</p>
                        <p style={{ color: tc, opacity: 0.35, fontSize: "13px", fontFamily: fontStyle }}>Built with <span style={{ color: accent }}>Sitezy.ai</span></p>
                    </div>
                </div>
            </footer>
        );
    }

    if (variant === "Ultra Minimal") {
        return (
            <footer style={{ background: bg, padding: "28px 56px", borderTop: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <p style={{ color: tc, opacity: 0.5, fontSize: "13px", fontFamily: fontStyle }}>{props.text || `© ${yr} All rights reserved.`}</p>
                    <p style={{ color: tc, opacity: 0.3, fontSize: "13px", fontFamily: fontStyle }}>Built with <span style={{ color: accent }}>Sitezy.ai</span></p>
                </div>
            </footer>
        );
    }

    return (
        <footer style={{ background: bg, padding: "36px 56px", borderTop: `1px solid ${light ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, textAlign: "center" }}>
            <p style={{ color: tc, opacity: 0.65, fontSize: "14px", fontFamily: fontStyle }}>{props.text || `© ${yr} All rights reserved.`} <span style={{ color: accent, fontWeight: 700 }}>· Sitezy.ai</span></p>
        </footer>
    );
};

// ─── DYNAMIC FORM SECTION ──────────────────────────────────────────────────────
const DynamicFormSection = ({ props, branding, websiteId }) => {
    // Read from dynamicFields (normalized by backend) or fall back to generic
    const fields = props.dynamicFields || props.fields || [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "phone", label: "Phone", type: "tel", required: true },
        { name: "message", label: "Message", type: "textarea", required: false },
    ];
    const [formData, setFormData] = useState(() => fields.reduce((a, f) => ({ ...a, [f.name]: "" }), {}));
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formError, setFormError] = useState(null);

    const accent = props.accentColor || branding?.primaryColor || "#6366f1";
    const bg = props.bgColor || "#ffffff";
    const tc = props.textColor || "#111827";
    const light = isLightText(tc);
    const variant = props.variant || "Card Based";
    const font = props.fontFamily || branding?.font || "Inter";
    useEffect(() => { loadFont(font); }, [font]);
    const fontStyle = `"${font}", "Inter", sans-serif`;



    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true); setFormError(null);
        if (!websiteId) { setFormError("Website ID not found."); setSubmitting(false); return; }
        try {
            const r = await fetch(`/api/public/forms/submit/${websiteId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
            const res = await r.json();
            if (res.success) setSubmitted(true); else setFormError(res.message || "Failed to submit.");
        } catch { setFormError("Network error. Please try again."); }
        finally { setSubmitting(false); }
    };

    const handleInputChange = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const inputBaseStyle = { padding: "13px 16px", borderRadius: "12px", fontSize: "14px", background: light ? "rgba(255,255,255,0.06)" : "#f8fafc", border: `1.5px solid ${light ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)"}`, color: tc, fontFamily: fontStyle, width: "100%", outline: "none", transition: "border-color 0.2s" };
    const cardBg = light ? "rgba(15,15,30,0.78)" : "rgba(255,255,255,0.97)";
    const labelColor = light ? "rgba(255,255,255,0.72)" : "#374151";

    const renderField = (field, idx) => {
        const { name, label, type = "text", options, placeholder, required = true } = field;
        const isArea = type === "textarea" || name.toLowerCase().includes("message") || name.toLowerCase().includes("instruction");
        const isSelect = type === "select" && Array.isArray(options) && options.length > 0;
        const isWide = isArea || isSelect || type === "date";
        const fieldEl = isSelect ? (
            <div style={{ position: "relative" }}>
                <select name={name} value={formData[name] || ""} onChange={e => handleInputChange(name, e.target.value)} style={{ ...inputBaseStyle, appearance: "none", WebkitAppearance: "none", cursor: "pointer", paddingRight: "36px" }} required={required}>
                    <option value="" disabled>Select {label}</option>
                    {options.map(opt => <option key={opt} value={opt} style={{ color: "#111", background: "#fff" }}>{opt}</option>)}
                </select>
                <span style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: accent, fontWeight: 900, fontSize: "11px" }}>▾</span>
            </div>
        ) : isArea ? (
            <textarea name={name} placeholder={placeholder || label} rows={3} value={formData[name] || ""} onChange={e => handleInputChange(name, e.target.value)} style={{ ...inputBaseStyle, resize: "vertical", minHeight: "84px" }} required={required} />
        ) : (
            <input type={type} name={name} placeholder={placeholder || label} value={formData[name] || ""} onChange={e => handleInputChange(name, e.target.value)} style={inputBaseStyle} required={required} />
        );
        return (
            <div key={name + idx} style={{ gridColumn: isWide ? "1 / -1" : "auto", display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: labelColor, fontFamily: fontStyle, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {label}{!required && <span style={{ fontWeight: 400, opacity: 0.5, marginLeft: "4px", textTransform: "none" }}>(optional)</span>}
                </label>
                {fieldEl}
            </div>
        );
    };

    const formBody = (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {formError && <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.12)", color: "#ef4444", fontWeight: 600, fontSize: "13px", fontFamily: fontStyle, border: "1px solid rgba(239,68,68,0.25)" }}>⚠ {formError}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "13px" }}>
                {fields.map((field, idx) => renderField(field, idx))}
            </div>
            <button type="submit" disabled={submitting} className="sp-btn-base" style={{ background: submitting ? "rgba(100,100,100,0.35)" : `linear-gradient(135deg, ${accent}, ${accent}cc)`, color: "#fff", padding: "16px", justifyContent: "center", borderRadius: "14px", width: "100%", fontSize: "15px", fontFamily: fontStyle, fontWeight: 800, boxShadow: submitting ? "none" : DS.shadow.colored(accent), cursor: submitting ? "not-allowed" : "pointer", marginTop: "4px" }}>
                {submitting ? <span style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}><span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "sp-spin 0.7s linear infinite", display: "inline-block" }} />Submitting…</span> : (props.submitText || "Submit Order →")}
            </button>
            <p style={{ textAlign: "center", fontSize: "11px", color: tc, opacity: 0.4, fontFamily: fontStyle }}>🔒 Saved to Firebase · Never shared</p>
        </form>
    );

    if (submitted) {
        return (
            <section style={{ padding: "80px 56px", background: bg }}>
                <div style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center", padding: "64px 48px", borderRadius: "36px", background: cardBg, backdropFilter: "blur(24px)", border: `1px solid ${light ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`, boxShadow: DS.shadow.xl }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 24px", boxShadow: DS.shadow.colored(accent) }}>✓</div>
                    <h3 style={{ fontSize: "1.7rem", fontWeight: 900, color: tc, marginBottom: "12px", fontFamily: fontStyle, letterSpacing: "-0.02em" }}>Order Received! 🎉</h3>
                    <p style={{ color: tc, opacity: 0.65, lineHeight: 1.7, fontFamily: fontStyle }}>Thank you! We&apos;ve received your details and will confirm shortly.</p>
                    <button onClick={() => { setSubmitted(false); setFormData(fields.reduce((a, f) => ({ ...a, [f.name]: "" }), {})); }} style={{ marginTop: "28px", padding: "12px 28px", borderRadius: "100px", background: `${accent}20`, color: accent, border: `1.5px solid ${accent}40`, fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: fontStyle }}>Submit Another</button>
                </div>
            </section>
        );
    }

    if (variant === "Split Left Text") {
        return (
            <section style={{ padding: "96px 56px", background: bg, position: "relative", overflow: "hidden" }}>
                <GlowBlob color={accent} style={{ top: "-10%", right: "-5%", width: "500px", height: "500px", opacity: 0.4 }} />
                <div className="sp-grid-halves" style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "72px", alignItems: "start", position: "relative", zIndex: 1 }}>
                    <div style={{ paddingTop: "24px" }}>
                        <div className="sp-badge" style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30`, marginBottom: "20px", fontFamily: fontStyle, display: "inline-flex", gap: "6px", alignItems: "center" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />Quick Order</div>
                        <h2 style={{ fontSize: DS.font.h2, fontWeight: 900, color: tc, marginBottom: "18px", letterSpacing: "-0.03em", fontFamily: fontStyle, lineHeight: 1.1 }}>{props.heading || "Place Your Order"}</h2>
                        <p style={{ fontSize: "1.05rem", color: tc, opacity: 0.68, lineHeight: 1.78, marginBottom: "36px", fontFamily: fontStyle }}>{props.description || "Fill in the details below and we'll confirm your order in minutes."}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {[["⚡", "Instant Confirmation"], ["🔒", "Secure & Private"], ["💬", "Direct Updates"]].map(([icon, text]) => (
                                <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px", color: tc, fontFamily: fontStyle, fontSize: "14px", fontWeight: 600, opacity: 0.8 }}>
                                    <span style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</span>{text}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ background: cardBg, backdropFilter: "blur(24px)", padding: "44px", borderRadius: "32px", border: `1px solid ${light ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`, boxShadow: DS.shadow.xl }}>{formBody}</div>
                </div>
            </section>
        );
    }

    return (
        <section style={{ padding: "96px 56px", background: bg, position: "relative", overflow: "hidden" }}>
            <GlowBlob color={accent} style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", opacity: 0.35 }} />
            <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <div className="sp-badge" style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30`, marginBottom: "16px", fontFamily: fontStyle, gap: "6px", alignItems: "center", display: "inline-flex" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: accent }} />Quick Order</div>
                    <h2 style={{ fontSize: "2rem", fontWeight: 900, color: tc, fontFamily: fontStyle, letterSpacing: "-0.03em", marginBottom: "10px" }}>{props.heading || "Submit Your Order"}</h2>
                    {props.description && <p style={{ color: tc, opacity: 0.6, fontFamily: fontStyle, lineHeight: 1.7 }}>{props.description}</p>}
                </div>
                <div style={{ background: cardBg, backdropFilter: "blur(24px)", padding: "52px 48px", borderRadius: "36px", border: `1px solid ${light ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`, boxShadow: DS.shadow.xl }}>{formBody}</div>
            </div>
        </section>
    );
};

// ─── Section Registry ──────────────────────────────────────────────────────────
export const SECTION_MAP = {
    Navbar: NavbarSection,
    Hero: HeroSection,
    Text: TextSection,
    Gallery: GallerySection,
    CTA: CTASection,
    ContactForm: ContactFormSection,
    DynamicForm: DynamicFormSection,
    Footer: FooterSection,
};

// ─── Loading / Error screens ───────────────────────────────────────────────────
const LoadingScreen = () => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a" }}>
        <div style={{ textAlign: "center" }}>
            <div style={{ width: "48px", height: "48px", border: "3px solid rgba(99,102,241,0.25)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "sp-spin 0.85s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", fontFamily: "system-ui" }}>Loading your site…</p>
        </div>
    </div>
);

const ErrorScreen = ({ message }) => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a" }}>
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "40px" }}>
            <div style={{ fontSize: "56px", fontWeight: 900, color: "#6366f1", lineHeight: 1 }}>404</div>
            <p style={{ color: "rgba(255,255,255,0.5)", margin: "16px 0", lineHeight: 1.7, fontFamily: "system-ui" }}>{message}</p>
            <a href="/" style={{ color: "#6366f1", textDecoration: "none", fontWeight: 700, fontFamily: "system-ui" }}>← Go Home</a>
        </div>
    </div>
);

// ─── Main Renderer ─────────────────────────────────────────────────────────────
export default function PublicSiteRenderer() {
    const { tenantSlug, pageSlug } = useParams();
    const [searchParams] = useSearchParams();
    const [siteData, setSiteData] = useState(null);
    const [currentPage, setCurrentPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let slug = tenantSlug || window.location.hostname;
        const websiteId = searchParams.get("websiteId");
        const websiteSlug = searchParams.get("websiteSlug");
        let url = `/public/sites/${slug}`;
        const params = new URLSearchParams();
        if (websiteId) params.append("websiteId", websiteId);
        if (websiteSlug) params.append("websiteSlug", websiteSlug);
        if (tenantSlug && !websiteId && !websiteSlug) params.append("websiteSlug", tenantSlug);
        if (params.toString()) url += `?${params.toString()}`;

        api.get(url)
            .then(res => {
                setSiteData(res.data);
                setCurrentPage(res.data.pages.find(p => p.isHomePage) || res.data.pages[0]);
            })
            .catch(err => setError(err.response?.data?.message || "Site not found"))
            .finally(() => setLoading(false));
    }, [tenantSlug, searchParams]);

    useEffect(() => {
        if (!siteData || !pageSlug) return;
        const found = siteData.pages.find(p => p.slug === pageSlug);
        if (found) setCurrentPage(found);
    }, [pageSlug, siteData]);

    useEffect(() => {
        if (!siteData?.tenant?.branding) return;
        const { primaryColor, secondaryColor, font } = siteData.tenant.branding;
        if (primaryColor) document.documentElement.style.setProperty("--color-primary", primaryColor);
        if (secondaryColor) document.documentElement.style.setProperty("--color-secondary", secondaryColor);
        if (font) {
            loadFont(font);
            document.documentElement.style.setProperty("--font-family", `"${font}", sans-serif`);
        }
        if (siteData.website?.name) document.title = siteData.website.name;
    }, [siteData]);

    // ── Track this browser tab as a live visitor ──────────────────────────────
    // Must be called before any early returns (Rules of Hooks)
    const _trackedWebsiteId = siteData?.website?._id || siteData?.pages?.[0]?.websiteId || searchParams.get("websiteId");
    useEffect(() => {
        if (!_trackedWebsiteId) return;
        const visitorSocket = io(`${window.location.protocol}//${window.location.hostname}:5000/visitors`, {
            transports: ["websocket", "polling"],
        });
        visitorSocket.on("connect", () => {
            visitorSocket.emit("visitor:join", { websiteId: _trackedWebsiteId });
        });
        return () => {
            visitorSocket.disconnect();
        };
    }, [_trackedWebsiteId]);

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen message={error} />;

    const branding = siteData?.tenant?.branding;
    const sections = currentPage?.layoutConfig?.sections || [];
    const websiteId = searchParams.get("websiteId") || siteData?.website?._id || siteData?.pages?.[0]?.websiteId;

    // Extract brand name for the chatbot
    const navbarSection = sections.find(s => s.type === "Navbar");
    const brandName = navbarSection?.props?.brand || siteData?.website?.name || "AI Assistant";

    return (
        <div style={{ minHeight: "100vh", background: "#fff", overflowX: "hidden" }}>
            <style>{globalResponsiveCss}</style>

            {/* Multi-page floating nav - HIDDEN: Top navbar now handles navigation */}
            {false && siteData?.pages?.length > 1 && (
                <div className="sp-page-nav">
                    {siteData.pages.map(page => (
                        <button key={page._id} onClick={() => setCurrentPage(page)} style={{ padding: "6px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, background: currentPage?._id === page._id ? (branding?.primaryColor || "#6366f1") : "transparent", border: "none", color: currentPage?._id === page._id ? "#fff" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.2s", fontFamily: "system-ui" }}>
                            {page.title}
                        </button>
                    ))}
                </div>
            )}

            {[...sections].sort((a, b) => a.order - b.order).map(section => {
                const Component = SECTION_MAP[section.type];
                if (!Component) return null;

                // Pass additional props to Navbar for page navigation
                if (section.type === "Navbar") {
                    return <Component
                        key={section.id}
                        props={section.props || {}}
                        branding={branding}
                        websiteId={websiteId}
                        allPages={siteData?.pages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />;
                }

                return <Component key={section.id} props={section.props || {}} branding={branding} websiteId={websiteId} />;
            })}

            {sections.length === 0 && (
                <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ color: "rgba(0,0,0,0.25)", fontFamily: "system-ui" }}>This page has no content yet.</p>
                </div>
            )}

            {/* AI Chatbot Widget */}
            {websiteId && <ChatWidget websiteId={websiteId} branding={branding} brandName={brandName} />}
        </div>
    );
}
