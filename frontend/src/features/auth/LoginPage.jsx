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

    const labelStyle = {
        display: "block", marginBottom: 10, fontSize: 12, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)",
    };

    return (
        <div style={{
            minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center",
            padding: "80px 20px", background: "var(--bg-base)"
        }}>
            {/* Card */}
            <div className="animate-fade-in saas-card" style={{
                width: "100%", maxWidth: 440, margin: "0 auto", position: "relative"
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.1)",
                    }}>
                        <Zap size={24} color="#000" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>SitePilot</h1>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>Workspace Login</p>
                    </div>
                </div>

                {/* Heading */}
                <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: 8 }}>Welcome back</h2>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 32 }}>Sign in to continue to your dashboard</p>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                    <div>
                        <label style={labelStyle}>Workspace ID</label>
                        <input
                            className="saas-input"
                            name="tenantSlug" value={formData.tenantSlug} onChange={handleChange}
                            placeholder="acme" required
                            style={{ width: "100%", fontFamily: "'JetBrains Mono', monospace" }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            className="saas-input"
                            name="email" type="email" value={formData.email} onChange={handleChange}
                            placeholder="you@company.com" required style={{ width: "100%" }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                className="saas-input"
                                name="password" type={showPassword ? "text" : "password"}
                                value={formData.password} onChange={handleChange}
                                placeholder="Your password" required
                                style={{ width: "100%", paddingRight: 52 }}
                            />
                            <button
                                type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                                    color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer",
                                    padding: 4,
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="saas-button" style={{
                        width: "100%", padding: "12px 0", fontSize: 14, marginTop: 8,
                        opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer"
                    }}>
                        {loading ? (
                            <span style={{
                                width: 16, height: 16, border: "2px solid rgba(0,0,0,0.3)",
                                borderTopColor: "#000", borderRadius: "50%", display: "inline-block",
                                animation: "spin 1s linear infinite",
                            }} />
                        ) : (
                            <>Sign In <ArrowRight size={16} style={{ marginLeft: 8 }} /></>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-muted)" }}>
                    New to SitePilot?{" "}
                    <Link to="/register" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 600 }}>
                        Create workspace
                    </Link>
                </p>
            </div>
        </div>
    );
}
