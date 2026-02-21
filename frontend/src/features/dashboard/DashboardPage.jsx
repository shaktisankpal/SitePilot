import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import {
    Globe, FileText, Wand2, Rocket, Activity,
    TrendingUp, Plus, Clock,
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div
        className="glass rounded-2xl p-5 animate-fade-in"
        style={{ border: "1px solid var(--border-color)" }}
    >
        <div className="flex items-center gap-3 mb-3">
            <div
                className="flex items-center justify-center rounded-lg p-2"
                style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
            >
                <Icon size={18} />
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</span>
        </div>
        <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</div>
    </div>
);

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

    const statCards = stats ? [
        { icon: Globe, label: "Total Websites", value: stats.stats.websiteCount, color: "#6366f1" },
        { icon: FileText, label: "Total Pages", value: stats.stats.pageCount, color: "#0ea5e9" },
        { icon: Wand2, label: "AI Generations", value: stats.stats.aiUsageCount, color: "#ec4899" },
        { icon: Rocket, label: "Deployments", value: stats.stats.deploymentCount, color: "#10b981" },
    ] : [];

    const actionStyle = (primary) => ({
        display: "inline-flex", alignItems: "center", gap: "8px",
        padding: "10px 20px", borderRadius: "100px",
        fontSize: "13px", fontWeight: "600", textDecoration: "none",
        border: "1px solid var(--border-color)", cursor: "pointer", transition: "var(--transition)",
        background: primary ? "var(--text-primary)" : "var(--bg-input)",
        color: primary ? "var(--bg-base)" : "var(--text-primary)",
    });

    return (
        <DashboardLayout>
            <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                            Good morning, {user?.name?.split(" ")[0]} 👋
                        </h1>
                        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                            Here's what's happening in <strong style={{ color: "var(--color-primary)" }}>{tenant?.name}</strong>
                        </p>
                    </div>
                    <Link to="/websites" style={actionStyle(true)}>
                        <Plus size={16} /> New Website
                    </Link>
                </div>

                {/* Stats Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl shimmer" style={{ height: "120px" }} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div
                        className="glass rounded-2xl p-5"
                        style={{ border: "1px solid var(--border-color)" }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Activity size={18} style={{ color: "var(--color-primary)" }} />
                            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Recent Activity</h3>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="shimmer rounded-lg" style={{ height: "40px" }} />
                                ))}
                            </div>
                        ) : stats?.recentActivity?.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No activity yet. Start building!</p>
                        ) : (
                            <div className="space-y-1">
                                {stats?.recentActivity?.slice(0, 8).map((log, index) => (
                                    <div
                                        key={log._id}
                                        className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        <div
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ background: "#6366f1", opacity: 0.8 }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                                                {log.action.replace(/_/g, " ")}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                                by {log.userId?.name || "System"}
                                            </p>
                                            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                                {new Date(log.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Deployments */}
                    <div
                        className="glass rounded-2xl p-5"
                        style={{ border: "1px solid var(--border-color)" }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Rocket size={18} style={{ color: "#10b981" }} />
                            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Recent Deployments</h3>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="shimmer rounded-lg" style={{ height: "52px" }} />
                                ))}
                            </div>
                        ) : stats?.recentDeployments?.length === 0 ? (
                            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No deployments yet.</p>
                        ) : (
                            <div className="space-y-1">
                                {stats?.recentDeployments?.map((dep, index) => (
                                    <div
                                        key={dep._id}
                                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className="flex items-center justify-center rounded-lg"
                                                style={{ width: "32px", height: "32px", background: "color-mix(in srgb, #10b981 10%, transparent)", color: "#10b981", flexShrink: 0 }}
                                            >
                                                <Rocket size={14} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                                                    {dep.websiteId?.name || "Website"} — v{dep.version}
                                                </p>
                                                <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                                                    {new Date(dep.createdAt).toLocaleDateString()} by {dep.deployedBy?.name}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className="text-[11px] font-medium px-2 py-0.5 rounded-full ml-4"
                                            style={{
                                                background: dep.status === "success" ? "color-mix(in srgb, #10b981 10%, transparent)" : "color-mix(in srgb, #ef4444 10%, transparent)",
                                                color: dep.status === "success" ? "#10b981" : "#ef4444",
                                            }}
                                        >
                                            {dep.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div
                    className="mt-6 glass rounded-2xl p-5"
                    style={{ border: "1px solid var(--border-color)" }}
                >
                    <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/websites" style={actionStyle(false)}>
                            <Globe size={16} /> Manage Websites
                        </Link>
                        <Link to="/ai" style={actionStyle(true)}>
                            <Wand2 size={16} /> Generate with AI
                        </Link>
                        <Link to="/settings" style={actionStyle(false)}>
                            <Activity size={16} /> Manage Team
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
