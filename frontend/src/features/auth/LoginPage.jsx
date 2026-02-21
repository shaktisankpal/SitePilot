import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice.js";
import toast from "react-hot-toast";
import { Zap, Eye, EyeOff, ArrowRight } from "lucide-react";

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
        width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)",
        background: "var(--bg-input)", border: "1px solid var(--border-color)",
        color: "var(--text-primary)", fontSize: "14px", outline: "none",
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background: "radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.15) 0%, var(--bg-base) 50%, rgba(99,102,241,0.1) 100%)",
            }}
        >
            <div style={{
                position: "fixed", bottom: "-10%", left: "-10%", width: "500px", height: "500px",
                borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent)",
                filter: "blur(60px)", pointerEvents: "none",
            }} />

            <div
                className="glass animate-fade-in w-full"
                style={{ maxWidth: "420px", padding: "40px", borderRadius: "var(--radius-lg)" }}
            >
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

                <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Welcome back</h2>
                <p className="mb-6" style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                    Sign in to your workspace
                </p>

                {/* Demo credentials hint */}
                <div
                    className="p-3 rounded-lg mb-5 text-sm"
                    style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "var(--text-secondary)" }}
                >
                    <strong style={{ color: "var(--color-primary)" }}>Demo:</strong> alice@acme.com / acme / password123
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                            Workspace ID
                        </label>
                        <input
                            name="tenantSlug" value={formData.tenantSlug} onChange={handleChange}
                            placeholder="acme" required style={{ ...inputStyle, fontFamily: "monospace" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                            Email Address
                        </label>
                        <input
                            name="email" type="email" value={formData.email} onChange={handleChange}
                            placeholder="you@company.com" required style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                            Password
                        </label>
                        <div className="relative">
                            <input
                                name="password" type={showPassword ? "text" : "password"}
                                value={formData.password} onChange={handleChange}
                                placeholder="Your password" required style={{ ...inputStyle, paddingRight: "44px" }}
                            />
                            <button
                                type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold"
                        style={{
                            background: "var(--text-primary)",
                            color: "var(--bg-base)", border: "none", cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.6 : 1, fontSize: "15px",
                            boxShadow: "none",
                        }}
                    >
                        {loading ? (
                            <span style={{ width: "18px", height: "18px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite" }} />
                        ) : (
                            <>Sign In <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                <p className="text-center mt-5" style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                    New to SitePilot?{" "}
                    <Link to="/register" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: "500" }}>
                        Create workspace
                    </Link>
                </p>
            </div>
        </div>
    );
}
