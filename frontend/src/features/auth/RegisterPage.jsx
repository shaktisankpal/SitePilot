import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/slices/authSlice.js";
import toast from "react-hot-toast";
import { Zap, Eye, EyeOff, ArrowRight } from "lucide-react";

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
        // Auto-generate slug from tenant name
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
        width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)",
        background: "var(--bg-input)", border: "1px solid var(--border-color)",
        color: "var(--text-primary)", fontSize: "14px", outline: "none",
        transition: "var(--transition)",
    };

    const labelStyle = {
        display: "block", marginBottom: "6px", fontSize: "13px",
        fontWeight: "500", color: "var(--text-secondary)",
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.15) 0%, var(--bg-base) 50%, rgba(139,92,246,0.1) 100%)",
            }}
        >
            {/* Decorative blobs */}
            <div style={{
                position: "fixed", top: "-10%", right: "-10%", width: "500px", height: "500px",
                borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent)",
                filter: "blur(60px)", pointerEvents: "none",
            }} />

            <div
                className="glass animate-fade-in w-full"
                style={{ maxWidth: "460px", padding: "40px", borderRadius: "var(--radius-lg)" }}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                    <div
                        className="flex items-center justify-center rounded-xl"
                        style={{
                            width: "48px", height: "48px",
                            background: "var(--bg-input)",
                            border: "1px solid var(--border-color)",
                            boxShadow: "var(--shadow-glow)",
                        }}
                    >
                        <Zap size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl gradient-text">SitePilot</h1>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>AI Website Builder</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                    Create your workspace
                </h2>
                <p className="mb-6" style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                    Get started with your AI-powered website builder
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label style={labelStyle}>Workspace Name</label>
                        <input
                            name="tenantName" value={formData.tenantName} onChange={handleChange}
                            placeholder="Acme Corp" required style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Workspace ID (auto-generated)</label>
                        <div className="flex items-center gap-2">
                            <input
                                name="tenantSlug" value={formData.tenantSlug} onChange={handleChange}
                                placeholder="acmecorp" required maxLength={20}
                                style={{ ...inputStyle, fontFamily: "monospace" }}
                            />
                        </div>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                            Your site will be at: {formData.tenantSlug || "yourworkspace"}.localhost:3000
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
                        <div className="relative">
                            <input
                                name="password" type={showPassword ? "text" : "password"}
                                value={formData.password} onChange={handleChange}
                                placeholder="Min 6 characters" required style={{ ...inputStyle, paddingRight: "44px" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div
                            className="p-3 rounded-lg text-sm"
                            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all"
                        style={{
                            background: loading ? "var(--bg-input)" : "var(--text-primary)",
                            color: loading ? "var(--text-muted)" : "var(--bg-base)", border: "none", cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: "none",
                            fontSize: "15px",
                        }}
                    >
                        {loading ? (
                            <span className="animate-spin" style={{ width: "18px", height: "18px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} />
                        ) : (
                            <>Create Workspace <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                <p className="text-center mt-5" style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                    Already have a workspace?{" "}
                    <Link to="/login" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: "500" }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
