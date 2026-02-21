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
    <div
        className="glass rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
        style={{ border: "1px solid var(--border-color)", background: "var(--bg-card)" }}
    >
        {/* Subtle background glow */}
        <div
            className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-[0.15] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20"
            style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
        />

        <div className="flex items-center justify-between mb-6 relative z-10 w-full">
            <div
                className="flex items-center justify-center rounded-[14px] p-3 shadow-sm ring-1 ring-white/5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
            >
                <Icon size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold tracking-[0.1em] uppercase" style={{ color: "var(--text-secondary)" }}>{label}</span>
        </div>

        <div className="relative z-10 w-full mt-2">
            <div className="text-[40px] leading-tight font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>{value}</div>
        </div>
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
        { icon: Wand2, label: "Generations", value: stats.stats.aiUsageCount, color: "#ec4899" },
        { icon: Rocket, label: "Deployments", value: stats.stats.deploymentCount, color: "#10b981" },
    ] : [];

    const actionStyle = (primary) => ({
        display: "inline-flex", alignItems: "center", gap: "10px",
        padding: "14px 26px", borderRadius: "14px",
        fontSize: "15px", fontWeight: "600", textDecoration: "none",
        border: primary ? "1px solid transparent" : "1px solid var(--border-color)",
        cursor: "pointer", transition: "all 0.2s ease",
        background: primary ? "var(--color-primary)" : "rgba(255,255,255,0.03)",
        color: primary ? "#ffffff" : "var(--text-primary)",
        boxShadow: primary ? "0 4px 14px 0 rgba(99, 102, 241, 0.3)" : "none",
    });

    return (
        <DashboardLayout>
            <div className="w-full max-w-[1400px] mx-auto p-6 md:p-10 space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight" style={{ color: "var(--text-primary)" }}>
                            Welcome back, {user?.name?.split(" ")[0]} 👋
                        </h1>
                        <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>
                            Here's what's happening in <span className="font-semibold" style={{ color: "var(--color-primary)" }}>{tenant?.name}</span> today.
                        </p>
                    </div>
                    <Link
                        to="/websites"
                        className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-white shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
                        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", fontWeight: "600", fontSize: "15px" }}
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        Create Project
                    </Link>
                </div>

                {/* Stats Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl shimmer" style={{ height: "160px" }} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Activity */}
                    <div
                        className="glass rounded-[24px] p-6 md:p-8 flex flex-col"
                        style={{ border: "1px solid var(--border-color)" }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3.5">
                                <div className="p-2.5 rounded-[12px] shadow-sm" style={{ background: "color-mix(in srgb, var(--color-primary) 15%, transparent)", color: "var(--color-primary)" }}>
                                    <Activity size={20} strokeWidth={2.5} />
                                </div>
                                <h3 className="font-bold text-xl tracking-tight" style={{ color: "var(--text-primary)" }}>Activity Log</h3>
                            </div>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="shimmer rounded-[14px]" style={{ height: "70px" }} />
                                ))}
                            </div>
                        ) : stats?.recentActivity?.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                                <div className="p-5 rounded-full mb-4" style={{ background: "var(--bg-input)" }}>
                                    <Activity size={32} style={{ color: "var(--text-muted)" }} />
                                </div>
                                <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>No recent activity to show.</p>
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {stats?.recentActivity?.slice(0, 8).map((log, index) => (
                                    <div
                                        key={log._id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[14px] transition-colors border border-transparent hover:border-white/5 hover:bg-white/5"
                                        style={{ background: "rgba(255, 255, 255, 0.015)" }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full shadow-[0_0_10px_var(--color-primary)]" style={{ background: "var(--color-primary)" }} />
                                            <div>
                                                <p className="text-[15px] font-semibold tracking-wide" style={{ color: "var(--text-primary)" }}>
                                                    {log.action.replace(/_/g, " ")}
                                                </p>
                                                <p className="text-[13px] mt-1 font-medium" style={{ color: "var(--text-muted)" }}>
                                                    by <span style={{ color: "var(--text-secondary)" }}>{log.userId?.name || "System"}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-3 sm:mt-0 text-[12px] font-medium px-3 flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                                            <Clock size={14} />
                                            <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                                            <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Deployments */}
                    <div
                        className="glass rounded-[24px] p-6 md:p-8 flex flex-col"
                        style={{ border: "1px solid var(--border-color)" }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3.5">
                                <div className="p-2.5 rounded-[12px] shadow-sm" style={{ background: "color-mix(in srgb, #10b981 15%, transparent)", color: "#10b981" }}>
                                    <Rocket size={20} strokeWidth={2.5} />
                                </div>
                                <h3 className="font-bold text-xl tracking-tight" style={{ color: "var(--text-primary)" }}>Deployments</h3>
                            </div>
                            <Link to="/websites" className="text-[14px] font-semibold flex items-center gap-1.5 hover:underline transition-all" style={{ color: "var(--color-primary)" }}>
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="shimmer rounded-[14px]" style={{ height: "76px" }} />
                                ))}
                            </div>
                        ) : stats?.recentDeployments?.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                                <div className="p-5 rounded-full mb-4" style={{ background: "var(--bg-input)" }}>
                                    <Rocket size={32} style={{ color: "var(--text-muted)" }} />
                                </div>
                                <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>No completed deployments.</p>
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {stats?.recentDeployments?.map((dep, index) => (
                                    <div
                                        key={dep._id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[14px] transition-colors border border-transparent hover:border-white/5 hover:bg-white/5"
                                        style={{ background: "rgba(255, 255, 255, 0.015)" }}
                                    >
                                        <div className="flex items-start sm:items-center gap-4">
                                            <div
                                                className="flex flex-shrink-0 items-center justify-center rounded-[10px] shadow-sm"
                                                style={{ width: "42px", height: "42px", background: "color-mix(in srgb, #10b981 15%, transparent)", color: "#10b981" }}
                                            >
                                                <LayoutGrid size={20} strokeWidth={2} />
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
                                                    {dep.websiteId?.name || "Website Project"}
                                                    <span className="text-[12px] font-medium opacity-60 ml-2 px-1.5 py-0.5 rounded-md bg-white/10 uppercase">
                                                        v{dep.version}
                                                    </span>
                                                </p>
                                                <p className="text-[13px] mt-1 font-medium flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                                                    <Clock size={12} /> {new Date(dep.createdAt).toLocaleDateString()}
                                                    <span className="mx-1">•</span>
                                                    by <span style={{ color: "var(--text-secondary)" }}>{dep.deployedBy?.name}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-3 sm:mt-0">
                                            <span
                                                className="text-[11px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                                                style={{
                                                    background: dep.status === "success" ? "color-mix(in srgb, #10b981 12%, transparent)" : "color-mix(in srgb, #ef4444 12%, transparent)",
                                                    color: dep.status === "success" ? "#10b981" : "#ef4444",
                                                    border: `1px solid color-mix(in srgb, ${dep.status === "success" ? "#10b981" : "#ef4444"} 30%, transparent)`
                                                }}
                                            >
                                                {dep.status === "success" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                                {dep.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-2">
                    <h3 className="font-bold text-[17px] mb-5 tracking-tight px-1" style={{ color: "var(--text-primary)" }}>Launch Quick Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/websites" className="group hover:border-indigo-500/30" style={actionStyle(false)}>
                            <Globe size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                            Manage Websites
                        </Link>
                        <Link to="/ai" className="group hover:border-pink-500/30" style={actionStyle(false)}>
                            <Wand2 size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
                            Generate with AI
                        </Link>
                        <Link to="/settings" className="group hover:border-emerald-500/30" style={actionStyle(false)}>
                            <Activity size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                            Tenant Settings
                        </Link>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
