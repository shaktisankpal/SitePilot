import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice.js";
import toast from "react-hot-toast";
import { Zap, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((s) => s.auth);

    const [formData, setFormData] = useState({ email: "", tenantSlug: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(login(formData));
        if (login.fulfilled.match(result)) {
            toast.success(`Welcome back, ${result.payload.user.name}! 👋`);
            navigate("/dashboard");
        } else {
            toast.error(result.payload || "Login failed");
        }
    };

    const inputStyle = {
        width: "100%", padding: "16px 20px", borderRadius: 14,
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
        color: "var(--text-primary)", fontSize: 15, outline: "none",
        transition: "all 0.2s ease", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
    };

    const labelStyle = {
        display: "block", marginBottom: 10, fontSize: 12, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)",
    };

    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, background: "radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.12) 0%, var(--bg-base) 50%, rgba(99,102,241,0.08) 100%)",
            position: "relative", overflow: "hidden",
        }}>
            {/* Decorative blobs */}
            <div style={{
                position: "fixed", bottom: "-15%", left: "-10%", width: 600, height: 600,
                borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent)",
                filter: "blur(80px)", pointerEvents: "none",
            }} />
            <div style={{
                position: "fixed", top: "-15%", right: "-10%", width: 500, height: 500,
                borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08), transparent)",
                filter: "blur(80px)", pointerEvents: "none",
            }} />

            {/* Card */}
            <div className="animate-fade-in" style={{
                width: "100%", maxWidth: 480, padding: "48px 44px",
                borderRadius: 28, position: "relative", overflow: "hidden",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(40px)", boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
            }}>
                {/* Top accent */}
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                }} />

                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
                        background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                        boxShadow: "0 0 30px rgba(99,102,241,0.25)",
                    }}>
                        <Zap size={26} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: "white" }}>SitePilot</h1>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>AI Website Builder</p>
                    </div>
                </div>

                {/* Heading */}
                <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 8 }}>Welcome back</h2>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 32 }}>Sign in to your workspace</p>

                {/* Demo hint */}
                <div style={{
                    padding: "14px 18px", borderRadius: 14, marginBottom: 28,
                    background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)",
                    display: "flex", alignItems: "center", gap: 12,
                }}>
                    <Sparkles size={16} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                        <strong style={{ color: "var(--color-primary)" }}>Demo:</strong> alice@acme.com / acme / password123
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                    <div>
                        <label style={labelStyle}>Workspace ID</label>
                        <input
                            name="tenantSlug" value={formData.tenantSlug} onChange={handleChange}
                            placeholder="acme" required
                            style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace" }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            name="email" type="email" value={formData.email} onChange={handleChange}
                            placeholder="you@company.com" required style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                name="password" type={showPassword ? "text" : "password"}
                                value={formData.password} onChange={handleChange}
                                placeholder="Your password" required
                                style={{ ...inputStyle, paddingRight: 52 }}
                            />
                            <button
                                type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                                    color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer",
                                    padding: 4,
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        padding: "18px 0", borderRadius: 16, fontSize: 16, fontWeight: 800,
                        background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                        color: loading ? "rgba(255,255,255,0.3)" : "white",
                        border: "none", cursor: loading ? "not-allowed" : "pointer",
                        boxShadow: loading ? "none" : "0 8px 24px rgba(99,102,241,0.35)",
                        transition: "all 0.2s ease", marginTop: 4,
                    }}>
                        {loading ? (
                            <span style={{
                                width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)",
                                borderTopColor: "white", borderRadius: "50%", display: "inline-block",
                                animation: "spin 1s linear infinite",
                            }} />
                        ) : (
                            <>Sign In <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 28, fontSize: 15, color: "rgba(255,255,255,0.35)" }}>
                    New to SitePilot?{" "}
                    <Link to="/register" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 700 }}>
                        Create workspace
                    </Link>
                </p>
            </div>
        </div>
    );
}
