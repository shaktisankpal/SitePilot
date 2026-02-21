import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import {
    Globe, FileText, Wand2, Rocket, Activity,
    TrendingUp, Plus, Clock, LayoutGrid, CheckCircle2, XCircle, ArrowRight
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border-color)",
        borderRadius: 20, padding: 28, position: "relative", overflow: "hidden",
        transition: "transform 0.3s ease", cursor: "default",
        display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 160,
    }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
        {/* Glow */}
        <div style={{
            position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%",
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`, opacity: 0.12, pointerEvents: "none",
        }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, position: "relative", zIndex: 1 }}>
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 14, padding: 12, background: `color-mix(in srgb, ${color} 15%, transparent)`, color,
            }}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-secondary)" }}>{label}</span>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 42, lineHeight: 1, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>{value}</div>
        </div>
    </div>
);

export default function DashboardPage() {
    const { user, tenant } = useSelector((s) => s.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllActivity, setShowAllActivity] = useState(false);
    const [showAllDeployments, setShowAllDeployments] = useState(false);

    useEffect(() => {
        api.get("/analytics/dashboard")
            .then((res) => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const statCards = stats ? [
        { icon: Globe, label: "Total Websites", value: stats.stats.websiteCount, color: "#6366f1" },
        { icon: FileText, label: "Total Pages", value: stats.stats.pageCount, color: "#0ea5e9" },
        { icon: Wand2, label: "Generations", value: stats.stats.aiUsageCount, color: "#ec4899" },
        { icon: Rocket, label: "Deployments", value: stats.stats.deploymentCount, color: "#10b981" },
    ] : [];

    const activityList = showAllActivity ? stats?.recentActivity : stats?.recentActivity?.slice(0, 5);
    const deploymentList = showAllDeployments ? stats?.recentDeployments : stats?.recentDeployments?.slice(0, 5);

    return (
        <DashboardLayout>
            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 40px 60px" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
                    <div>
                        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 6 }}>
                            Welcome back, {user?.name?.split(" ")[0]} 👋
                        </h1>
                        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
                            Here's what's happening in <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>{tenant?.name}</span> today.
                        </p>
                    </div>
                    <Link to="/websites" style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: "14px 28px", borderRadius: 14, textDecoration: "none",
                        background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                        color: "white", fontWeight: 700, fontSize: 15,
                        boxShadow: "0 6px 20px rgba(99,102,241,0.3)",
                    }}>
                        <Plus size={18} strokeWidth={2.5} /> Create Project
                    </Link>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 24, marginBottom: 40,
                }}>
                    {loading
                        ? [...Array(4)].map((_, i) => (
                            <div key={i} className="shimmer" style={{ height: 160, borderRadius: 20 }} />
                        ))
                        : statCards.map((s) => <StatCard key={s.label} {...s} />)
                    }
                </div>

                {/* Activity + Deployments */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 40 }}>
                    {/* Activity Log */}
                    <div style={{
                        background: "var(--bg-card)", border: "1px solid var(--border-color)",
                        borderRadius: 24, padding: 32, display: "flex", flexDirection: "column",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                            <div style={{
                                padding: 10, borderRadius: 12,
                                background: "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                                color: "var(--color-primary)",
                            }}>
                                <Activity size={20} strokeWidth={2.5} />
                            </div>
                            <h3 style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.01em", color: "var(--text-primary)" }}>Activity Log</h3>
                        </div>

                        {loading ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {[...Array(4)].map((_, i) => <div key={i} className="shimmer" style={{ height: 64, borderRadius: 14 }} />)}
                            </div>
                        ) : stats?.recentActivity?.length === 0 ? (
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", textAlign: "center" }}>
                                <div style={{ padding: 20, borderRadius: "50%", background: "var(--bg-input)", marginBottom: 16 }}>
                                    <Activity size={32} style={{ color: "var(--text-muted)" }} />
                                </div>
                                <p style={{ color: "var(--text-muted)", fontSize: 15 }}>No recent activity to show.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {activityList?.map((log) => (
                                    <div key={log._id} style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.02)",
                                        border: "1px solid transparent", transition: "all 0.15s ease",
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "transparent"; }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-primary)", boxShadow: "0 0 8px var(--color-primary)", flexShrink: 0 }} />
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{log.action.replace(/_/g, " ")}</p>
                                                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                                                    by <span style={{ color: "var(--text-secondary)" }}>{log.userId?.name || "System"}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
                                            <Clock size={12} />
                                            <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                                            <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                ))}
                                {stats?.recentActivity?.length > 5 && (
                                    <button onClick={() => setShowAllActivity(!showAllActivity)} style={{
                                        background: "none", border: "1px solid rgba(255,255,255,0.06)",
                                        borderRadius: 14, padding: "12px", color: "var(--text-secondary)",
                                        fontSize: 13, fontWeight: 700, cursor: "pointer",
                                        marginTop: 8, transition: "all 0.15s ease",
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                                    >
                                        {showAllActivity ? "View Less" : "View All Activity"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Deployments */}
                    <div style={{
                        background: "var(--bg-card)", border: "1px solid var(--border-color)",
                        borderRadius: 24, padding: 32, display: "flex", flexDirection: "column",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{ padding: 10, borderRadius: 12, background: "color-mix(in srgb, #10b981 15%, transparent)", color: "#10b981" }}>
                                    <Rocket size={20} strokeWidth={2.5} />
                                </div>
                                <h3 style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-0.01em", color: "var(--text-primary)" }}>Deployments</h3>
                            </div>
                            <Link to="/websites" style={{ fontSize: 14, fontWeight: 600, color: "var(--color-primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>

                        {loading ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {[...Array(4)].map((_, i) => <div key={i} className="shimmer" style={{ height: 72, borderRadius: 14 }} />)}
                            </div>
                        ) : stats?.recentDeployments?.length === 0 ? (
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0", textAlign: "center" }}>
                                <div style={{ padding: 20, borderRadius: "50%", background: "var(--bg-input)", marginBottom: 16 }}>
                                    <Rocket size={32} style={{ color: "var(--text-muted)" }} />
                                </div>
                                <p style={{ color: "var(--text-muted)", fontSize: 15 }}>No completed deployments.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {deploymentList?.map((dep) => (
                                    <div key={dep._id} style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between",
                                        padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.02)",
                                        transition: "all 0.15s ease",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                            <div style={{
                                                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                                                background: "color-mix(in srgb, #10b981 15%, transparent)", color: "#10b981",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                <LayoutGrid size={20} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                                                    {dep.websiteId?.name || "Website Project"}
                                                    <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.5, marginLeft: 8, padding: "2px 6px", borderRadius: 6, background: "rgba(255,255,255,0.1)", textTransform: "uppercase" }}>
                                                        v{dep.version}
                                                    </span>
                                                </p>
                                                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}>
                                                    <Clock size={11} /> {new Date(dep.createdAt).toLocaleDateString()} · by <span style={{ color: "var(--text-secondary)" }}>{dep.deployedBy?.name}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em",
                                            padding: "6px 12px", borderRadius: 100, display: "flex", alignItems: "center", gap: 5,
                                            background: dep.status === "success" ? "color-mix(in srgb, #10b981 12%, transparent)" : "color-mix(in srgb, #ef4444 12%, transparent)",
                                            color: dep.status === "success" ? "#10b981" : "#ef4444",
                                            border: `1px solid ${dep.status === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                                        }}>
                                            {dep.status === "success" ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                                            {dep.status}
                                        </span>
                                    </div>
                                ))}
                                {stats?.recentDeployments?.length > 5 && (
                                    <button onClick={() => setShowAllDeployments(!showAllDeployments)} style={{
                                        background: "none", border: "1px solid rgba(255,255,255,0.06)",
                                        borderRadius: 14, padding: "12px", color: "var(--text-secondary)",
                                        fontSize: 13, fontWeight: 700, cursor: "pointer",
                                        marginTop: 8, transition: "all 0.15s ease",
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                                    >
                                        {showAllDeployments ? "View Less" : "View All Deployments"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 20, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Launch Quick Actions</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                        {[
                            { to: "/websites", icon: Globe, label: "Manage Websites", iconColor: "#818cf8" },
                            { to: "/ai", icon: Wand2, label: "Generate with AI", iconColor: "#f472b6" },
                            { to: "/settings", icon: Activity, label: "Tenant Settings", iconColor: "#34d399" },
                        ].map(({ to, icon: QIcon, label, iconColor }) => (
                            <Link key={to} to={to} style={{
                                display: "inline-flex", alignItems: "center", gap: 10,
                                padding: "14px 26px", borderRadius: 14, textDecoration: "none",
                                background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)",
                                color: "var(--text-primary)", fontSize: 15, fontWeight: 600,
                                transition: "all 0.15s ease",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                            >
                                <QIcon size={18} style={{ color: iconColor }} /> {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
