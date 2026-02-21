import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import {
    Globe, FileText, Wand2, Rocket, Activity,
    TrendingUp, Plus, Clock, LayoutGrid, CheckCircle2, XCircle, ArrowRight, Settings
} from "lucide-react";

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

    const activityList = stats?.recentActivity?.slice(0, 5) || [];
    const deploymentList = stats?.recentDeployments?.slice(0, 5) || [];

    return (
        <DashboardLayout>
            <div style={{ maxWidth: 1600, margin: "0 auto", padding: "40px 40px 60px" }}>

                {/* BENTO GRID */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(12, 1fr)",
                    gridAutoRows: "minmax(180px, auto)",
                    gap: 20,
                }}>

                    {/* 1. HERO CELL (Span 8 cols, 2 rows) */}
                    <div style={{
                        gridColumn: "span 8", gridRow: "span 2",
                        background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 24,
                        padding: 40, display: "flex", flexDirection: "column", justifyContent: "space-between",
                        position: "relative", overflow: "hidden"
                    }}>
                        {/* Decorative background element */}
                        <div style={{ position: "absolute", right: -40, bottom: -40, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

                        <div style={{ position: "relative", zIndex: 1 }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", marginBottom: 24 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary)" }} />
                                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>{tenant?.name} Workspace</span>
                            </div>

                            <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: 16, lineHeight: 1.1 }}>
                                Welcome back,<br />{user?.name?.split(" ")[0]}
                            </h1>
                            <p style={{ fontSize: 16, color: "var(--text-secondary)", maxWidth: 400, lineHeight: 1.5 }}>
                                Start building, deploying, and managing your high-performance websites from your command center.
                            </p>
                        </div>

                        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 16, marginTop: 40 }}>
                            <Link to="/websites" style={{
                                display: "inline-flex", alignItems: "center", gap: 10,
                                padding: "16px 28px", borderRadius: 14, textDecoration: "none",
                                background: "var(--text-primary)", color: "var(--bg-base)",
                                fontWeight: 600, fontSize: 15, transition: "transform 0.15s ease"
                            }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                                <Plus size={18} strokeWidth={2.5} /> Create Project
                            </Link>

                            <Link to="/ai" style={{
                                display: "inline-flex", alignItems: "center", gap: 10,
                                padding: "16px 28px", borderRadius: 14, textDecoration: "none",
                                background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-color)",
                                fontWeight: 600, fontSize: 15, transition: "background 0.15s ease"
                            }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background = "var(--bg-input)"}>
                                <Wand2 size={18} /> AI Playground
                            </Link>
                        </div>
                    </div>

                    {/* 2. STATS COMPACT CELL (Span 4 cols, 1 row) */}
                    <div style={{
                        gridColumn: "span 4", gridRow: "span 1",
                        background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 24,
                        padding: 28, display: "flex", flexDirection: "column", justifyContent: "center"
                    }}>
                        <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginBottom: 20 }}>At a Glance</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", marginBottom: 8 }}>
                                    <Globe size={14} /> <span style={{ fontSize: 13, fontWeight: 500 }}>Websites</span>
                                </div>
                                <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                                    {loading ? "-" : stats?.stats?.websiteCount || 0}
                                </div>
                            </div>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", marginBottom: 8 }}>
                                    <Rocket size={14} /> <span style={{ fontSize: 13, fontWeight: 500 }}>Deploys</span>
                                </div>
                                <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                                    {loading ? "-" : stats?.stats?.deploymentCount || 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. QUICK NAV CELL (Span 4 cols, 1 row) */}
                    <div style={{
                        gridColumn: "span 4", gridRow: "span 1",
                        background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 24,
                        padding: 24, display: "flex", flexDirection: "column", gap: 8
                    }}>
                        <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginBottom: 12, paddingLeft: 8 }}>Quick Links</h3>
                        <Link to="/settings" style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)",
                            textDecoration: "none", color: "var(--text-primary)", border: "1px solid transparent",
                            transition: "all 0.15s ease"
                        }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "var(--border-color)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "transparent"; }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                                <span style={{ fontSize: 14, fontWeight: 600 }}>Custom Domains</span>
                            </div>
                            <ArrowRight size={14} color="var(--text-muted)" />
                        </Link>
                        <Link to="/settings" style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)",
                            textDecoration: "none", color: "var(--text-primary)", border: "1px solid transparent",
                            transition: "all 0.15s ease"
                        }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "var(--border-color)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "transparent"; }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                                <span style={{ fontSize: 14, fontWeight: 600 }}>Team Settings</span>
                            </div>
                            <ArrowRight size={14} color="var(--text-muted)" />
                        </Link>
                    </div>

                    {/* 4. DEPLOYMENTS CELL (Span 6 cols, 2+ rows) */}
                    <div style={{
                        gridColumn: "span 6", gridRow: "span 2",
                        background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 24,
                        padding: 32, display: "flex", flexDirection: "column"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Recent Deployments</h3>
                            <Link to="/websites" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-primary)", textDecoration: "none" }}>View All</Link>
                        </div>

                        {loading ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {[...Array(3)].map((_, i) => <div key={i} className="shimmer" style={{ height: 60, borderRadius: 12 }} />)}
                            </div>
                        ) : deploymentList.length === 0 ? (
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center", justifyContent: "center", padding: "40px 0" }}>
                                <Rocket size={24} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
                                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No completed deployments.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {deploymentList.map((dep) => (
                                    <div key={dep._id} style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "16px", borderRadius: 16, background: "rgba(255,255,255,0.02)",
                                        border: "1px solid rgba(255,255,255,0.03)"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}>
                                                <LayoutGrid size={16} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                                                    {dep.websiteId?.name || "Website"} <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, marginLeft: 8, padding: "2px 6px", borderRadius: 6, background: "rgba(255,255,255,0.1)" }}>v{dep.version}</span>
                                                </p>
                                                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Clock size={11} /> {new Date(dep.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                                            display: "flex", alignItems: "center", gap: 4, color: dep.status === "success" ? "#10b981" : "#ef4444"
                                        }}>
                                            {dep.status === "success" ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                                            {dep.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 5. ACTIVITY CELL (Span 6 cols, 2+ rows) */}
                    <div style={{
                        gridColumn: "span 6", gridRow: "span 2",
                        background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 24,
                        padding: 32, display: "flex", flexDirection: "column"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                            <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Activity Log</h3>
                        </div>

                        {loading ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {[...Array(3)].map((_, i) => <div key={i} className="shimmer" style={{ height: 60, borderRadius: 12 }} />)}
                            </div>
                        ) : activityList.length === 0 ? (
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
                                <Activity size={24} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
                                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No recent activity.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {activityList.map((log) => (
                                    <div key={log._id} style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "16px", borderRadius: 16, background: "rgba(255,255,255,0.02)",
                                        border: "1px solid rgba(255,255,255,0.03)"
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--text-secondary)" }} />
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{log.action.replace(/_/g, " ")}</p>
                                                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                                                    by <span style={{ color: "var(--text-secondary)" }}>{log.userId?.name || "System"}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "right", display: "flex", flexDirection: "column", gap: 2 }}>
                                            <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                                            <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

