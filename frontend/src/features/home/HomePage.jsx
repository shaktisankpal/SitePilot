import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────── Page-specific keyframes ──────────────────── */
const HERO_STYLES = `
  /* Paper aeroplane trajectory */
  @keyframes planeJourney {
    0%   { transform: translateX(-120px) translateY(0px)   rotate(-8deg); opacity: 0; }
    5%   { opacity: 1; }
    30%  { transform: translateX(28vw)   translateY(-40px) rotate(-4deg); }
    55%  { transform: translateX(52vw)   translateY(20px)  rotate(2deg);  }
    80%  { transform: translateX(78vw)   translateY(-25px) rotate(-6deg); }
    95%  { opacity: 1; }
    100% { transform: translateX(110vw)  translateY(-10px) rotate(-8deg); opacity: 0; }
  }

  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  @keyframes badgePop {
    0%   { opacity: 0; transform: scale(0.8) translateY(8px); }
    100% { opacity: 1; transform: scale(1)   translateY(0);   }
  }

  @keyframes orb1 {
    0%, 100% { transform: translate(0, 0)        scale(1);    }
    33%       { transform: translate(40px, -30px) scale(1.08); }
    66%       { transform: translate(-20px, 20px) scale(0.95); }
  }
  @keyframes orb2 {
    0%, 100% { transform: translate(0, 0)         scale(1);    }
    33%       { transform: translate(-30px, 40px)  scale(1.06); }
    66%       { transform: translate(25px, -15px)  scale(0.97); }
  }
  @keyframes orb3 {
    0%, 100% { transform: translate(0, 0)        scale(1);    }
    50%       { transform: translate(20px, 30px)  scale(1.04); }
  }

  @keyframes shimmerBg {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  @keyframes gridPulse {
    0%, 100% { opacity: 0.035; }
    50%       { opacity: 0.06;  }
  }

  @keyframes statCount {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  @keyframes hp-borderGlow {
    0%, 100% { box-shadow: 0 0 8px #6366f1; }
    50%       { box-shadow: 0 0 14px #8b5cf6; }
  }

  .hp-cta-primary {
    position: relative;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease;
    letter-spacing: -0.01em;
    font-family: 'Inter', sans-serif;
  }
  .hp-cta-primary:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 40px rgba(99,102,241,0.45), 0 0 0 1px rgba(139,92,246,0.3);
  }
  .hp-cta-primary:active { transform: translateY(0) scale(0.99); }

  .hp-cta-secondary {
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.85);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 14px 32px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s cubic-bezier(.34,1.56,.64,1);
    backdrop-filter: blur(12px);
    letter-spacing: -0.01em;
    font-family: 'Inter', sans-serif;
  }
  .hp-cta-secondary:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }

  .hp-feature-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 32px;
    transition: all 0.35s cubic-bezier(.34,1.56,.64,1);
    position: relative;
    overflow: hidden;
    cursor: default;
  }
  .hp-feature-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.35s ease;
    border-radius: 20px;
  }
  .hp-feature-card:hover {
    transform: translateY(-6px);
    border-color: rgba(99,102,241,0.3);
    box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08);
  }
  .hp-feature-card:hover::before { opacity: 1; }

  .hp-stat-card {
    padding: 28px 36px;
    border-radius: 20px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    transition: all 0.3s ease;
    text-align: center;
  }
  .hp-stat-card:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(99,102,241,0.25);
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  }
`;

/* ─── Paper Aeroplane SVG ─────────────────────────────────────────────── */
function PaperPlane() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            style={{ width: 52, height: 52, filter: "drop-shadow(0 0 12px rgba(139,92,246,0.6))" }}
        >
            <polygon points="2,32 62,16 44,48" fill="url(#planeGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <polygon points="2,32 44,48 32,36" fill="rgba(255,255,255,0.12)" />
            <line x1="2" y1="32" x2="62" y2="16" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            <defs>
                <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a5b4fc" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
            </defs>
        </svg>
    );
}

/* ─── Feature icons ────────────────────────────────────────────────────── */
const BoltIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 22, height: 22 }}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const BrushIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 22, height: 22 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L3 14.67V21h6.33l10.06-10.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" /><line x1="16" y1="5" x2="19" y2="8" strokeLinecap="round" /></svg>);
const GlobeIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 22, height: 22 }}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>);
const MagicIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 22, height: 22 }}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const ShieldIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 22, height: 22 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const ChartIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 22, height: 22 }}><line x1="18" y1="20" x2="18" y2="10" strokeLinecap="round" /><line x1="12" y1="20" x2="12" y2="4" strokeLinecap="round" /><line x1="6" y1="20" x2="6" y2="14" strokeLinecap="round" /><line x1="2" y1="20" x2="22" y2="20" strokeLinecap="round" /></svg>);

/* ─── Feature data ─────────────────────────────────────────────────────── */
const FEATURES = [
    { icon: <MagicIcon />, gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)", shadow: "rgba(99,102,241,0.35)", title: "AI-Powered Builder", desc: "Describe your vision in plain english. SitePilot's AI drafts pixel-perfect pages in seconds — no design skills required." },
    { icon: <BrushIcon />, gradient: "linear-gradient(135deg,#ec4899,#f43f5e)", shadow: "rgba(236,72,153,0.35)", title: "Visual Drag & Drop", desc: "A canvas that feels as natural as sketching. Move, resize, and style every element with professional-grade precision." },
    { icon: <GlobeIcon />, gradient: "linear-gradient(135deg,#06b6d4,#3b82f6)", shadow: "rgba(6,182,212,0.35)", title: "One-Click Publishing", desc: "A global CDN, automatic SSL, and custom domains. Your site goes live instantly and stays blazing fast worldwide." },
    { icon: <BoltIcon />, gradient: "linear-gradient(135deg,#f59e0b,#ef4444)", shadow: "rgba(245,158,11,0.35)", title: "Edge Performance", desc: "Sub-100ms load times. Intelligent caching, optimised assets, and Core Web Vitals built in from the ground up." },
    { icon: <ShieldIcon />, gradient: "linear-gradient(135deg,#10b981,#06b6d4)", shadow: "rgba(16,185,129,0.35)", title: "Enterprise Security", desc: "SOC 2 Type II certified. End-to-end encryption, DDoS protection, and granular team permissions out of the box." },
    { icon: <ChartIcon />, gradient: "linear-gradient(135deg,#8b5cf6,#6366f1)", shadow: "rgba(139,92,246,0.35)", title: "Built-in Analytics", desc: "Privacy-first visitor analytics with real-time dashboards. Understand your audience without sacrificing their data." },
];

const STATS = [
    { value: "50K+", label: "Sites Published" },
    { value: "99.99%", label: "Uptime SLA" },
    { value: "< 80ms", label: "Avg. Load Time" },
    { value: "140+", label: "Countries Served" },
];

/* ─── HomePage ─────────────────────────────────────────────────────────── */
export default function HomePage() {
    const [planeKey, setPlaneKey] = useState(0);
    const timerRef = useRef(null);

    // Re-trigger plane every 6.5 s
    useEffect(() => {
        const cycle = () => {
            setPlaneKey((k) => k + 1);
            timerRef.current = setTimeout(cycle, 6500);
        };
        timerRef.current = setTimeout(cycle, 700);
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <>
            <style>{HERO_STYLES}</style>
            <div style={{ fontFamily: "'Inter','DM Sans',sans-serif", color: "white", background: "#000" }}>

                {/* ══════ HERO ══════ */}
                <section style={{
                    position: "relative",
                    minHeight: "calc(100vh - 68px)",   /* account for fixed navbar */
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    paddingTop: 120,
                    paddingBottom: 80,
                }}>
                    {/* Background orbs */}
                    {[
                        { w: 700, h: 700, color: "rgba(99,102,241,0.12)", top: "5%", left: "50%", tx: "-80%", anim: "orb1 12s ease-in-out infinite" },
                        { w: 500, h: 500, color: "rgba(139,92,246,0.10)", top: "30%", right: "5%", anim: "orb2 14s ease-in-out infinite" },
                        { w: 300, h: 300, color: "rgba(236,72,153,0.07)", bottom: "10%", left: "15%", anim: "orb3 10s ease-in-out infinite" },
                    ].map((o, i) => (
                        <div key={i} style={{
                            position: "absolute", width: o.w, height: o.h, borderRadius: "50%",
                            background: `radial-gradient(circle,${o.color},transparent 70%)`,
                            top: o.top, left: o.left, right: o.right, bottom: o.bottom,
                            transform: o.tx ? `translateX(${o.tx})` : undefined,
                            animation: o.anim, pointerEvents: "none",
                        }} />
                    ))}

                    {/* Grid overlay */}
                    <div style={{
                        position: "absolute", inset: 0,
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
                        backgroundSize: "72px 72px",
                        animation: "gridPulse 6s ease-in-out infinite",
                        pointerEvents: "none",
                    }} />

                    {/* Bottom grid fade */}
                    <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
                        background: "linear-gradient(to top,#000,transparent)", pointerEvents: "none",
                    }} />

                    {/* ── Paper plane ── */}
                    <div key={planeKey} style={{
                        position: "absolute", top: "38%", left: 0,
                        animation: "planeJourney 5s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
                        pointerEvents: "none", zIndex: 10,
                    }}>
                        <PaperPlane />
                    </div>

                    {/* ── Hero copy ── */}
                    <div style={{ position: "relative", zIndex: 5, textAlign: "center", maxWidth: 820, padding: "0 24px" }}>

                        {/* Badge */}
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 8,
                            padding: "7px 16px", borderRadius: 100,
                            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
                            fontSize: 12, fontWeight: 600, color: "#a5b4fc", letterSpacing: "0.04em", textTransform: "uppercase",
                            marginBottom: 32,
                            animation: "badgePop 0.6s cubic-bezier(.34,1.56,.64,1) 0.2s both",
                            backdropFilter: "blur(8px)",
                        }}>
                            <span style={{
                                width: 6, height: 6, borderRadius: "50%", background: "#6366f1",
                                boxShadow: "0 0 8px #6366f1", display: "inline-block",
                                animation: "hp-borderGlow 2s ease infinite",
                            }} />
                            Now in Public Beta — Deploy in seconds
                        </div>

                        {/* Headline */}
                        <h1 style={{
                            fontSize: "clamp(42px,7vw,80px)", fontWeight: 900, lineHeight: 1.05,
                            letterSpacing: "-0.04em", marginBottom: 24,
                            animation: "heroFadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.3s both",
                        }}>
                            <span style={{ color: "white" }}>Build websites</span>
                            <br />
                            <span style={{
                                background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 40%,#ec4899 80%)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                backgroundSize: "200% 100%", animation: "shimmerBg 4s linear infinite",
                            }}>
                                at the speed of thought.
                            </span>
                        </h1>

                        {/* Subline */}
                        <p style={{
                            fontSize: "clamp(16px,2vw,20px)", lineHeight: 1.65, color: "rgba(255,255,255,0.55)",
                            maxWidth: 580, margin: "0 auto 44px", fontWeight: 400, letterSpacing: "-0.01em",
                            animation: "heroFadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.45s both",
                        }}>
                            SitePilot combines a professional drag-and-drop editor with generative AI — so you can go from idea to live website in{" "}
                            <span style={{ color: "rgba(165,180,252,0.9)", fontWeight: 500 }}>minutes, not months.</span>
                        </p>

                        {/* CTAs */}
                        <div style={{
                            display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
                            animation: "heroFadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.6s both",
                        }}>
                            <Link to="/register" className="hp-cta-primary">
                                Start building free
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                            <a href="#features" className="hp-cta-secondary">
                                See how it works
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                                    <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        </div>

                        {/* Social proof */}
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 52,
                            animation: "heroFadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.75s both",
                        }}>
                            <div style={{ display: "flex" }}>
                                {["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981"].map((c, i) => (
                                    <div key={i} style={{
                                        width: 30, height: 30, borderRadius: "50%", background: c,
                                        border: "2px solid #000", marginLeft: i === 0 ? 0 : -10,
                                        fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center",
                                        justifyContent: "center", color: "white", flexShrink: 0,
                                    }}>
                                        {["J", "S", "A", "M", "K"][i]}
                                    </div>
                                ))}
                            </div>
                            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", letterSpacing: "-0.01em" }}>
                                Trusted by <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>50,000+</span> creators worldwide
                            </span>
                        </div>
                    </div>
                </section>

                {/* ══════ STATS ══════ */}
                <section style={{ padding: "0 5% 80px" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                        {STATS.map(({ value, label }, i) => (
                            <div key={label} className="hp-stat-card" style={{ animation: `statCount 0.5s cubic-bezier(0.4,0,0.2,1) ${0.1 * i}s both` }}>
                                <div style={{
                                    fontSize: "clamp(28px,3vw,40px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 6,
                                    background: "linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.6) 100%)",
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                }}>
                                    {value}
                                </div>
                                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 450, letterSpacing: "-0.01em" }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════ FEATURES ══════ */}
                <section id="features" style={{ padding: "80px 5% 100px" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                        <div style={{ textAlign: "center", marginBottom: 72 }}>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "6px 16px", borderRadius: 100,
                                background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)",
                                fontSize: 11, fontWeight: 700, color: "#c4b5fd", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20,
                            }}>
                                Everything you need
                            </div>
                            <h2 style={{
                                fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, letterSpacing: "-0.04em",
                                color: "white", lineHeight: 1.1, marginBottom: 16,
                            }}>
                                The complete platform<br />
                                <span style={{
                                    background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                }}>
                                    for modern web teams.
                                </span>
                            </h2>
                            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", maxWidth: 540, margin: "0 auto", lineHeight: 1.65, fontWeight: 400, letterSpacing: "-0.01em" }}>
                                From first sketch to global live — every tool you need lives in one beautifully designed workspace.
                            </p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
                            {FEATURES.map(({ icon, gradient, shadow, title, desc }) => (
                                <div key={title} className="hp-feature-card">
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 14, background: gradient,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        marginBottom: 22, color: "white", boxShadow: `0 8px 24px ${shadow}`, flexShrink: 0,
                                    }}>
                                        {icon}
                                    </div>
                                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "white", marginBottom: 10, letterSpacing: "-0.025em" }}>{title}</h3>
                                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontWeight: 400, letterSpacing: "-0.01em" }}>{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════ CTA BANNER ══════ */}
                <section style={{ padding: "0 5% 120px" }}>
                    <div style={{
                        maxWidth: 1100, margin: "0 auto", borderRadius: 28, padding: "72px 60px",
                        background: "linear-gradient(135deg,rgba(99,102,241,0.15) 0%,rgba(139,92,246,0.15) 50%,rgba(236,72,153,0.08) 100%)",
                        border: "1px solid rgba(99,102,241,0.2)", textAlign: "center",
                        position: "relative", overflow: "hidden",
                        boxShadow: "0 40px 80px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}>
                        <div style={{
                            position: "absolute", width: 400, height: 400, borderRadius: "50%",
                            background: "radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)",
                            top: "-50%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none",
                        }} />
                        <div style={{ position: "relative", zIndex: 1 }}>
                            <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16, color: "white", lineHeight: 1.1 }}>
                                Ready to ship something<br />
                                <span style={{
                                    background: "linear-gradient(135deg,#a5b4fc,#c4b5fd,#f9a8d4)",
                                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                }}>
                                    extraordinary?
                                </span>
                            </h2>
                            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", marginBottom: 40, lineHeight: 1.65, maxWidth: 460, margin: "0 auto 40px", letterSpacing: "-0.01em" }}>
                                Join 50,000+ teams who chose SitePilot to build, launch, and scale their online presence.
                            </p>
                            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                                <Link to="/register" className="hp-cta-primary" style={{ fontSize: 15, padding: "15px 36px" }}>
                                    Start for free — no card needed
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}>
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                                <Link to="/login" className="hp-cta-secondary" style={{ fontSize: 15, padding: "15px 36px" }}>
                                    Sign in to your account
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}
