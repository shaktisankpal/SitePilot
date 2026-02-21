import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice.js";
import {
    LayoutDashboard, Globe, Wand2, Settings, LogOut,
    Menu, X, ChevronRight, Zap,
} from "lucide-react";
import toast from "react-hot-toast";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Websites", icon: Globe, path: "/websites" },
    { label: "AI Generator", icon: Wand2, path: "/ai" },
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

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
            {/* Sidebar */}
            <aside
                className="flex flex-col transition-all duration-300 ease-in-out"
                style={{
                    width: sidebarOpen ? "260px" : "72px",
                    minWidth: sidebarOpen ? "260px" : "72px",
                    background: "var(--bg-surface)",
                    borderRight: "1px solid var(--border-color)",
                    overflow: "hidden",
                }}
            >
                {/* Logo */}
                <div
                    className="flex items-center gap-3 px-4 py-5"
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                >
                    <div
                        className="flex items-center justify-center rounded-xl flex-shrink-0"
                        style={{
                            width: "40px", height: "40px",
                            background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                            boxShadow: "var(--shadow-glow)",
                        }}
                    >
                        <Zap size={20} color="white" />
                    </div>
                    {sidebarOpen && (
                        <span className="font-bold text-lg text-white tracking-tight animate-fade-in">
                            SitePilot
                        </span>
                    )}
                    <button
                        className="ml-auto p-1 rounded-lg hover:bg-white/5 transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                {/* Tenant badge */}
                {sidebarOpen && tenant && (
                    <div
                        className="mx-3 mt-3 px-3 py-2 rounded-lg"
                        style={{ background: "var(--bg-input)", border: "1px solid var(--border-color)" }}
                    >
                        <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Workspace</p>
                        <p className="font-semibold text-sm mt-0.5 truncate" style={{ color: "var(--text-primary)" }}>{tenant.name}</p>
                    </div>
                )}

                {/* Nav Items */}
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navItems.map(({ label, icon: Icon, path }) => {
                        const active = location.pathname.startsWith(path);
                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${active ? '' : 'hover:bg-white/5'}`}
                                style={{
                                    background: active ? "var(--bg-input)" : "transparent",
                                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                                }}
                                title={!sidebarOpen ? label : ""}
                            >
                                <Icon size={18} className="flex-shrink-0" />
                                {sidebarOpen && (
                                    <span className="text-sm font-medium animate-fade-in">{label}</span>
                                )}
                                {sidebarOpen && active && (
                                    <ChevronRight size={14} className="ml-auto" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info */}
                <div
                    className="p-3 mt-auto"
                    style={{ borderTop: "1px solid var(--border-color)" }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center rounded-full flex-shrink-0 text-sm font-bold"
                            style={{
                                width: "36px", height: "36px",
                                background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                                color: "white",
                            }}
                        >
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0 animate-fade-in">
                                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{user?.name}</p>
                                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{user?.role}</p>
                            </div>
                        )}
                        {sidebarOpen && (
                            <button
                                onClick={handleLogout}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                style={{ color: "var(--text-muted)" }}
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto" style={{ background: "var(--bg-base)" }}>
                {children}
            </main>
        </div>
    );
}
