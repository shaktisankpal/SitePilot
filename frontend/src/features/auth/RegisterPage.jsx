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
                width: "100%", maxWidth: 460, margin: "0 auto", position: "relative"
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    }}>
                        <Zap size={24} color="var(--text-primary)" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>SitePilot</h1>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>Workspace Setup</p>
                    </div>
                </div>

                {/* Heading */}
                <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: 8 }}>Create your workspace</h2>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 36 }}>Get started with your AI-powered website builder</p>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                        <label style={labelStyle}>Workspace Name</label>
                        <input
                            className="saas-input"
                            name="tenantName" value={formData.tenantName} onChange={handleChange}
                            placeholder="Acme Corp" required style={{ width: "100%" }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Workspace ID (auto-generated)</label>
                        <input
                            className="saas-input"
                            name="tenantSlug" value={formData.tenantSlug} onChange={handleChange}
                            placeholder="acmecorp" required maxLength={20}
                            style={{ width: "100%", fontFamily: "'JetBrains Mono', monospace" }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            className="saas-input"
                            name="name" value={formData.name} onChange={handleChange}
                            placeholder="John Doe" required style={{ width: "100%" }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Email Address</label>
                        <input
                            className="saas-input"
                            name="email" type="email" value={formData.email} onChange={handleChange}
                            placeholder="john@acmecorp.com" required style={{ width: "100%" }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                className="saas-input"
                                name="password" type={showPassword ? "text" : "password"}
                                value={formData.password} onChange={handleChange}
                                placeholder="Min 6 characters" required
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

                    {error && (
                        <div style={{
                            padding: "12px 14px", borderRadius: 8,
                            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                            color: "#f87171", fontSize: 13, fontWeight: 500,
                        }}>
                            {error}
                        </div>
                    )}

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
                            <>Create Workspace <ArrowRight size={16} style={{ marginLeft: 8 }} /></>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-muted)" }}>
                    Already have a workspace?{" "}
                    <Link to="/login" style={{ color: "var(--text-primary)", textDecoration: "none", fontWeight: 600 }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
