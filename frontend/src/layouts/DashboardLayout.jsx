import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice.js";
import {
    LayoutDashboard, Globe, Wand2, Settings, LogOut,
    Menu, X, Zap,
} from "lucide-react";
import toast from "react-hot-toast";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Projects", icon: Globe, path: "/websites" },
    { label: "AI Playground", icon: Wand2, path: "/ai" },
    { label: "Settings", icon: Settings, path: "/settings" },
];

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, tenant } = useSelector((s) => s.auth);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const sidebarW = sidebarOpen ? 260 : 72;

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-base)" }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarW, minWidth: sidebarW, display: "flex", flexDirection: "column",
                background: "var(--bg-surface)", borderRight: "1px solid var(--border-color)",
                transition: "width 0.3s ease, min-width 0.3s ease", overflow: "hidden",
            }}>
                {/* Logo */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "20px 16px", borderBottom: "1px solid var(--border-color)",
                }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                        background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 0 20px rgba(99,102,241,0.2)",
                    }}>
                        <Zap size={20} color="white" />
                    </div>
                    {sidebarOpen && (
                        <span style={{ fontWeight: 800, fontSize: 20, color: "white", letterSpacing: "-0.02em" }}>
                            SitePilot
                        </span>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
                        marginLeft: "auto", padding: 4, borderRadius: 8,
                        background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)",
                    }}>
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Tenant badge */}
                {sidebarOpen && tenant && (
                    <div style={{ margin: "12px 12px 0", padding: "10px 14px", borderRadius: 10, background: "var(--bg-input)", border: "1px solid var(--border-color)" }}>
                        <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Workspace</p>
                        <p style={{ fontWeight: 700, fontSize: 14, marginTop: 2, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tenant.name}</p>
                    </div>
                )}

                {/* Nav */}
                <nav style={{ flex: 1, padding: "16px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
                    {navItems.map(({ label, icon: Icon, path }) => {
                        const active = location.pathname.startsWith(path);
                        return (
                            <Link key={path} to={path} title={!sidebarOpen ? label : ""} style={{
                                display: "flex", alignItems: "center", gap: 12,
                                padding: "10px 14px", borderRadius: 10, textDecoration: "none",
                                background: active ? "var(--bg-input)" : "transparent",
                                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                                transition: "all 0.15s ease",
                            }}>
                                <Icon size={20} style={{ flexShrink: 0 }} />
                                {sidebarOpen && (
                                    <span style={{ fontSize: 14, fontWeight: active ? 700 : 500 }}>{label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div style={{ padding: 12, borderTop: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                            background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "white", fontSize: 14, fontWeight: 700,
                        }}>
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        {sidebarOpen && (
                            <>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</p>
                                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{user?.role}</p>
                                </div>
                                <button onClick={handleLogout} title="Logout" style={{
                                    padding: 6, borderRadius: 8, background: "none", border: "none",
                                    cursor: "pointer", color: "var(--text-muted)",
                                }}>
                                    <LogOut size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, overflowY: "auto", background: "var(--bg-base)" }}>
                {children}
            </main>
        </div>
    );
}
