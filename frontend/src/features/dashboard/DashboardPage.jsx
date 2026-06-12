import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import {
    Globe, FileText, Wand2, Rocket, Activity,
    TrendingUp, Plus, Clock, LayoutGrid, CheckCircle2, XCircle, ArrowRight, Settings,
    LogIn, FilePlus, Trash2, UploadCloud, RefreshCw
} from "lucide-react";

// Per-item accent colors so list rows aren't a wall of grey + green.
const DASH_COLORS = ["#38bdf8", "#a855f7", "#34d399", "#fb923c", "#f472b6", "#22d3ee", "#fbbf24", "#818cf8"];
function dhash(s) { let h = 0; for (let i = 0; i < (s || "").length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function pickColor(s) { return DASH_COLORS[dhash(s) % DASH_COLORS.length]; }
// Activity action → { color, Icon }
function actionMeta(a) {
    const k = (a || "").toLowerCase();
    if (k.includes("login")) return { color: "#38bdf8", Icon: LogIn };
    if (k.includes("creat")) return { color: "#34d399", Icon: FilePlus };
    if (k.includes("publish") || k.includes("deploy")) return { color: "#a855f7", Icon: UploadCloud };
    if (k.includes("delet")) return { color: "#f87171", Icon: Trash2 };
    if (k.includes("updat")) return { color: "#fbbf24", Icon: RefreshCw };
    return { color: "#94a3b8", Icon: Activity };
}

export default function DashboardPage() {
    const { user, tenant } = useSelector((s) => s.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/analytics/dashboard")
            .then((res) => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <DashboardLayout>
            <style>{`
                @media (max-width: 1024px) {
                    .dash-bento > * { grid-column: span 6 !important; grid-row: auto !important; }
                }
                @media (max-width: 720px) {
                    .dash-page-pad { padding: 28px 18px 48px !important; }
                    .dash-bento { grid-template-columns: 1fr !important; }
                    .dash-bento > * { grid-column: 1 / -1 !important; grid-row: auto !important; }
                }
            `}</style>
            <div className="dash-page-pad" style={{ maxWidth: 1600, margin: "0 auto", padding: "40px 40px 60px" }}>

                {/* BENTO GRID */}
                <div className="dash-bento" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(12, 1fr)",
                    gridAutoRows: "minmax(180px, auto)",
                    gap: 20,
                }}>

                    {/* 1. HERO CELL — compact (span 8, 1 row) */}
                    <div className="glass-card" style={{
                        gridColumn: "span 8", gridRow: "span 1", borderRadius: 24,
                        padding: 30, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18,
                        position: "relative", overflow: "hidden"
                    }}>
                        {/* Decorative mesh element */}
                        <div className="sz-mesh" style={{ opacity: 0.4 }} />
                        <div style={{ position: "absolute", right: -40, bottom: -40, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

                        <div style={{ position: "relative", zIndex: 1 }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 13px", borderRadius: 100, background: "rgba(var(--fg),0.03)", border: "1px solid var(--border-color)", marginBottom: 14 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary)" }} />
                                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>{tenant?.name}</span>
                            </div>

                            <h1 className="font-display" style={{ fontSize: 33, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1.1 }}>
                                Welcome back, <span className="serif-accent gradient-text">{user?.name?.split(" ")[0]}</span>
                            </h1>
                            <p style={{ fontSize: 14.5, color: "var(--text-secondary)", maxWidth: 440, lineHeight: 1.5, marginTop: 8 }}>
                                Build, deploy, and manage your high-performance websites from your command center.
                            </p>
                        </div>

                        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <Link to="/websites" style={{
                                display: "inline-flex", alignItems: "center", gap: 9,
                                padding: "12px 22px", borderRadius: 100, textDecoration: "none",
                                background: "var(--grad-btn)", color: "#fff", border: "1px solid rgba(var(--fg),0.12)",
                                fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, transition: "all 0.2s ease",
                                boxShadow: "0 5px 16px rgba(8,90,72,0.35), inset 0 1px 0 rgba(var(--fg),0.14)"
                            }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                                <Plus size={17} strokeWidth={2.5} /> Create Project
                            </Link>

                            <Link to="/ai" style={{
                                display: "inline-flex", alignItems: "center", gap: 9,
                                padding: "12px 22px", borderRadius: 100, textDecoration: "none",
                                background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-color)",
                                fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, transition: "background 0.15s ease"
                            }} onMouseEnter={e => e.currentTarget.style.background = "rgba(var(--fg),0.05)"} onMouseLeave={e => e.currentTarget.style.background = "var(--bg-input)"}>
                                <Wand2 size={17} /> AI Playground
                            </Link>
                        </div>
                    </div>

                    {/* 2. STATS COMPACT CELL (Span 4 cols, 1 row) */}
                    <div style={{
                        gridColumn: "span 4", gridRow: "span 1",
                        background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 24,
                        backdropFilter: "blur(28px) saturate(1.6)", WebkitBackdropFilter: "blur(28px) saturate(1.6)", boxShadow: "var(--shadow-glass)",
                        padding: 28, display: "flex", flexDirection: "column", justifyContent: "center"
                    }}>
                        <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginBottom: 18 }}>At a Glance</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            {[
                                { label: "Websites", value: stats?.stats?.websiteCount || 0, Icon: Globe, color: "#38bdf8" },
                                { label: "Deploys", value: stats?.stats?.deploymentCount || 0, Icon: Rocket, color: "#a855f7" },
                            ].map(({ label, value, Icon, color }) => (
                                <div key={label} style={{ padding: "18px 18px 16px", borderRadius: 18, background: `${color}0f`, border: `1px solid ${color}26` }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 11, background: `${color}1f`, color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                                        <Icon size={18} strokeWidth={2.2} />
                                    </div>
                                    <div className="font-display" style={{ fontSize: 36, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                                        {loading ? "—" : value}
                                    </div>
                                    <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-muted)", marginTop: 5 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. QUICK NAV CELL (Span 4 cols, 1 row) */}
                    <div style={{
                        gridColumn: "span 4", gridRow: "span 1",
                        background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 24,
                        backdropFilter: "blur(28px) saturate(1.6)", WebkitBackdropFilter: "blur(28px) saturate(1.6)", boxShadow: "var(--shadow-glass)",
                        padding: 24, display: "flex", flexDirection: "column", gap: 8
                    }}>
                        <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginBottom: 12, paddingLeft: 8 }}>Quick Links</h3>
                        <Link to="/settings" style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "12px 16px", borderRadius: 12, background: "rgba(var(--fg),0.02)",
                            textDecoration: "none", color: "var(--text-primary)", border: "1px solid transparent",
                            transition: "all 0.15s ease"
                        }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(var(--fg),0.04)"; e.currentTarget.style.borderColor = "var(--border-color)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(var(--fg),0.02)"; e.currentTarget.style.borderColor = "transparent"; }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                                <span style={{ fontSize: 14, fontWeight: 600 }}>Custom Domains</span>
                            </div>
                            <ArrowRight size={14} color="var(--text-muted)" />
                        </Link>
                        <Link to="/settings" style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "12px 16px", borderRadius: 12, background: "rgba(var(--fg),0.02)",
                            textDecoration: "none", color: "var(--text-primary)", border: "1px solid transparent",
                            transition: "all 0.15s ease"
                        }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(var(--fg),0.04)"; e.currentTarget.style.borderColor = "var(--border-color)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(var(--fg),0.02)"; e.currentTarget.style.borderColor = "transparent"; }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                                <span style={{ fontSize: 14, fontWeight: 600 }}>Team Settings</span>
                            </div>
                            <ArrowRight size={14} color="var(--text-muted)" />
                        </Link>
                    </div>

                    {/* 4 + 5. Section launchers → dedicated full pages */}
                    {[
                        { to: "/deployments", title: "Recent Deployments", desc: `${stats?.stats?.deploymentCount ?? 0} deployments · view full history`, Icon: Rocket, color: "#a855f7" },
                        { to: "/activity", title: "Activity Log", desc: "Every action across your workspace", Icon: Activity, color: "#38bdf8" },
                    ].map(({ to, title, desc, Icon, color }) => (
                        <Link key={to} to={to} style={{
                            gridColumn: "span 4", gridRow: "span 1", textDecoration: "none",
                            background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 24,
                            backdropFilter: "blur(28px) saturate(1.6)", WebkitBackdropFilter: "blur(28px) saturate(1.6)", boxShadow: "var(--shadow-glass)",
                            padding: 28, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                            transition: "transform 0.25s var(--ease-spring), border-color 0.25s ease",
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = `${color}66`; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--glass-border)"; }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                                <div style={{ width: 50, height: 50, borderRadius: 14, background: `${color}1c`, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Icon size={24} strokeWidth={2.2} />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <p className="font-display" style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{title}</p>
                                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>{desc}</p>
                                </div>
                            </div>
                            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(var(--fg),0.05)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", flexShrink: 0 }}>
                                <ArrowRight size={17} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

