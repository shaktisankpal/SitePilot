import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/slices/authSlice.js";
import toast from "react-hot-toast";
import { Zap, Eye, EyeOff, ArrowRight, Rocket } from "lucide-react";

export default function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((s) => s.auth);

    const [formData, setFormData] = useState({
        tenantName: "", tenantSlug: "", name: "", email: "", password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        let val = e.target.value;
        if (e.target.name === "tenantName") {
            setFormData((p) => ({
                ...p,
                tenantName: val,
                tenantSlug: val.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20),
            }));
            return;
        }
        setFormData((p) => ({ ...p, [e.target.name]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(register(formData));
        if (register.fulfilled.match(result)) {
            toast.success("Workspace created! Welcome to SitePilot 🚀");
            navigate("/dashboard");
        } else {
            toast.error(result.payload || "Registration failed");
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
            minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center",
            padding: "60px 20px 20px", background: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.12) 0%, var(--bg-base) 50%, rgba(139,92,246,0.08) 100%)",
            position: "relative", overflow: "hidden",
        }}>
            {/* Decorative blobs */}
            <div style={{
                position: "fixed", top: "-15%", right: "-10%", width: 600, height: 600,
                borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1), transparent)",
                filter: "blur(80px)", pointerEvents: "none",
            }} />
            <div style={{
                position: "fixed", bottom: "-15%", left: "-10%", width: 500, height: 500,
                borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent)",
                filter: "blur(80px)", pointerEvents: "none",
            }} />

            {/* Card */}
            <div className="animate-fade-in" style={{
                width: "100%", maxWidth: 520, padding: "48px 44px",
                borderRadius: 28, position: "relative", overflow: "hidden",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(40px)", boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
            }}>
                {/* Top accent */}
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: "linear-gradient(90deg, var(--color-secondary), var(--color-primary))",
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
                <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: 8 }}>Create your workspace</h2>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 36 }}>Get started with your AI-powered website builder</p>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                        <label style={labelStyle}>Workspace Name</label>
                        <input
                            name="tenantName" value={formData.tenantName} onChange={handleChange}
                            placeholder="Acme Corp" required style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Workspace ID (auto-generated)</label>
                        <input
                            name="tenantSlug" value={formData.tenantSlug} onChange={handleChange}
                            placeholder="acmecorp" required maxLength={20}
                            style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace" }}
                        />
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                            <Rocket size={12} />
                            Your site will be at: <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>{formData.tenantSlug || "yourworkspace"}</span>.localhost:3000
                        </p>
                    </div>

                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            name="name" value={formData.name} onChange={handleChange}
                            placeholder="John Doe" required style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            name="email" type="email" value={formData.email} onChange={handleChange}
                            placeholder="john@acmecorp.com" required style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                name="password" type={showPassword ? "text" : "password"}
                                value={formData.password} onChange={handleChange}
                                placeholder="Min 6 characters" required
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

                    {error && (
                        <div style={{
                            padding: "14px 18px", borderRadius: 14,
                            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                            color: "#f87171", fontSize: 14, fontWeight: 600,
                        }}>
                            {error}
                        </div>
                    )}

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
                            <>Create Workspace <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 28, fontSize: 15, color: "rgba(255,255,255,0.35)" }}>
                    Already have a workspace?{" "}
                    <Link to="/login" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 700 }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
