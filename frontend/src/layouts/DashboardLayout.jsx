import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice.js";
import {
    LayoutDashboard, Globe, Wand2, Settings, LogOut,
    Menu, X, ChevronRight, Zap, SidebarClose, SidebarOpen
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

    return (
        <div className="flex h-screen overflow-hidden text-white" style={{ background: "var(--bg-base)" }}>
            {/* Sidebar */}
            <aside
                className="flex flex-col transition-all duration-300 ease-in-out relative z-20"
                style={{
                    width: sidebarOpen ? "280px" : "88px",
                    minWidth: sidebarOpen ? "280px" : "88px",
                    background: "var(--bg-card)",
                    borderRight: "1px solid var(--border-color)",
                    overflow: "hidden",
                    boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.2)" : "none",
                }}
            >
                {/* Logo Area */}
                <div
                    className="flex items-center gap-3 px-6 py-8"
                >
                    <div
                        className="flex items-center justify-center rounded-[14px] flex-shrink-0 relative overflow-hidden group"
                        style={{
                            width: "44px", height: "44px",
                            background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                            boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                        }}
                    >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Zap size={22} color="white" strokeWidth={2.5} />
                    </div>

                    <div className={`flex-1 transition-opacity duration-300 min-w-0 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        <span className="font-extrabold text-2xl text-white tracking-tight animate-fade-in block leading-none">
                            SitePilot
                        </span>
                    </div>

                    <button
                        className="p-2 rounded-[12px] hover:bg-white/10 transition-colors ml-auto absolute right-4 top-8"
                        style={{ color: "var(--text-secondary)" }}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <SidebarClose size={20} /> : <SidebarOpen size={20} />}
                    </button>
                </div>

                {/* Tenant Context */}
                {sidebarOpen && tenant && (
                    <div className="px-6 mb-6 animate-fade-in">
                        <div
                            className="px-4 py-3 rounded-[16px] flex flex-col items-start"
                            style={{ background: "var(--bg-input)", border: "1px solid var(--border-color)" }}
                        >
                            <span style={{ fontSize: "11px", color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: "800" }}>Workspace</span>
                            <span className="font-bold text-[15px] mt-0.5 truncate w-full tracking-tight" style={{ color: "var(--text-primary)" }}>{tenant.name}</span>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className={`flex-1 overflow-y-auto custom-scrollbar px-4 pt-2 space-y-2 ${!sidebarOpen ? 'mt-8' : ''}`}>
                    {navItems.map(({ label, icon: Icon, path }) => {
                        const active = location.pathname.startsWith(path);
                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-[16px] transition-all duration-200 group relative border border-transparent`}
                                style={{
                                    background: active ? "var(--bg-input)" : "transparent",
                                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                                    borderColor: active ? "var(--border-color)" : "transparent"
                                }}
                                title={!sidebarOpen ? label : ""}
                            >
                                {active && (
                                    <div
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-md"
                                        style={{ background: "var(--color-primary)" }}
                                    />
                                )}
                                <div className={`flex items-center justify-center ${active ? 'text-indigo-400' : 'group-hover:text-white transition-colors'}`}>
                                    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                                </div>
                                <div className={`flex-1 transition-all duration-300 min-w-0 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                    <span className={`text-[15px] ${active ? 'font-bold' : 'font-semibold'} animate-fade-in truncate block`}>{label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div
                    className="p-5"
                    style={{ borderTop: "1px solid var(--border-color)" }}
                >
                    <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'} bg-white/5 p-2 rounded-[16px] border border-white/5`}>
                        <div
                            className="flex items-center justify-center rounded-[12px] flex-shrink-0 text-[15px] font-bold ring-2 ring-white/10 relative"
                            style={{
                                width: "42px", height: "42px",
                                background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                                color: "white",
                            }}
                        >
                            {user?.name?.[0]?.toUpperCase()}
                            <div className="absolute right-[-4px] bottom-[-4px] w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                        </div>

                        <div className={`flex-1 min-w-0 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                            <p className="text-[14px] font-bold truncate tracking-wide" style={{ color: "var(--text-primary)" }}>{user?.name}</p>
                            <p className="text-[12px] font-medium tracking-wider truncate uppercase opacity-60" style={{ color: "var(--color-primary)" }}>{user?.role}</p>
                        </div>

                        <div className={`${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                            <button
                                onClick={handleLogout}
                                className="p-2.5 rounded-[12px] hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                style={{ color: "var(--text-muted)" }}
                                title="Sign Out"
                            >
                                <LogOut size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main
                className="flex-1 overflow-auto custom-scrollbar relative"
                style={{
                    background: "var(--bg-base)",
                    backgroundImage: "radial-gradient(ellipse at top right, rgba(99,102,241,0.05) 0%, transparent 60%)"
                }}
            >
                {children}
            </main>
        </div>
    );
}
