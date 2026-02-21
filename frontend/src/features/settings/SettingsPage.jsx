import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe, updateTenantBranding } from "../../store/slices/authSlice.js";
import api from "../../services/api.js";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import toast from "react-hot-toast";
import {
    Palette, Users, Globe, Plus, Trash2, Shield,
    Save, Crown, Pencil, Code2, Eye,
} from "lucide-react";

const ROLE_COLORS = {
    OWNER: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "rgba(251,191,36,0.3)" },
    ADMIN: { bg: "rgba(99,102,241,0.15)", color: "#818cf8", border: "rgba(99,102,241,0.3)" },
    EDITOR: { bg: "rgba(16,185,129,0.15)", color: "#34d399", border: "rgba(16,185,129,0.3)" },
    DEVELOPER: { bg: "rgba(236,72,153,0.15)", color: "#f472b6", border: "rgba(236,72,153,0.3)" },
};

const ROLE_ICONS = { OWNER: Crown, ADMIN: Shield, EDITOR: Pencil, DEVELOPER: Code2 };

export default function SettingsPage() {
    const dispatch = useDispatch();
    const { user, tenant } = useSelector((s) => s.auth);
    const [activeTab, setActiveTab] = useState("branding");
    const [users, setUsers] = useState([]);
    const [domains, setDomains] = useState([]);
    const [branding, setBranding] = useState(tenant?.branding || {});
    const [inviteForm, setInviteForm] = useState({ name: "", email: "", password: "", role: "EDITOR" });
    const [newDomain, setNewDomain] = useState("");
    const [saving, setSaving] = useState(false);

    const isOwner = user?.role === "OWNER";
    const isAdmin = ["OWNER", "ADMIN"].includes(user?.role);

    useEffect(() => {
        if (isAdmin) {
            api.get("/auth/users").then((res) => setUsers(res.data.users)).catch(console.error);
            api.get("/domains").then((res) => setDomains(res.data.domains)).catch(console.error);
        }
    }, [isAdmin]);

    const handleSaveBranding = async () => {
        setSaving(true);
        try {
            await api.put("/tenant/branding", branding);
            dispatch(updateTenantBranding(branding));
            // Apply CSS vars live
            if (branding.primaryColor) document.documentElement.style.setProperty("--color-primary", branding.primaryColor);
            if (branding.secondaryColor) document.documentElement.style.setProperty("--color-secondary", branding.secondaryColor);
            toast.success("Branding updated! ✨");
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
        setSaving(false);
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/invite", inviteForm);
            toast.success(`${inviteForm.name} invited as ${inviteForm.role}`);
            setInviteForm({ name: "", email: "", password: "", role: "EDITOR" });
            const res = await api.get("/auth/users");
            setUsers(res.data.users);
        } catch (err) {
            toast.error(err.response?.data?.message || "Invite failed");
        }
    };

    const handleRemoveUser = async (userId, name) => {
        if (!confirm(`Remove ${name} from workspace?`)) return;
        try {
            await api.delete(`/auth/users/${userId}`);
            setUsers((u) => u.filter((x) => x._id !== userId));
            toast.success("User removed");
        } catch (err) {
            toast.error(err.response?.data?.message || "Remove failed");
        }
    };

    const handleRoleChange = async (userId, role) => {
        try {
            await api.put(`/auth/users/${userId}/role`, { role });
            setUsers((u) => u.map((x) => x._id === userId ? { ...x, role } : x));
            toast.success("Role updated");
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    const handleAddDomain = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/domains", { domain: newDomain });
            setDomains((d) => [...d, res.data.domain]);
            setNewDomain("");
            toast.success("Domain added! Check verification instructions.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add domain");
        }
    };

    const handleVerifyDomain = async (domainId) => {
        try {
            await api.post(`/domains/${domainId}/verify`);
            setDomains((d) => d.map((x) => x._id === domainId ? { ...x, verified: true } : x));
            toast.success("Domain verified!");
        } catch (err) {
            toast.error("Verification failed");
        }
    };

    const tabs = [
        { id: "branding", label: "Branding", icon: Palette },
        ...(isAdmin ? [{ id: "team", label: "Team", icon: Users }] : []),
        ...(isOwner ? [{ id: "domains", label: "Domains", icon: Globe }] : []),
    ];

    const inputStyle = {
        width: "100%", padding: "10px 14px", borderRadius: "var(--radius-sm)",
        background: "var(--bg-input)", border: "1px solid var(--border-color)",
        color: "var(--text-primary)", fontSize: "14px", outline: "none",
    };

    return (
        <DashboardLayout>
            <div className="p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Settings</h1>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Manage your workspace settings</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "0" }}>
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id} onClick={() => setActiveTab(id)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all"
                            style={{
                                background: "none", border: "none",
                                borderBottom: activeTab === id ? "2px solid var(--color-primary)" : "2px solid transparent",
                                color: activeTab === id ? "var(--color-primary)" : "var(--text-secondary)",
                                cursor: "pointer", marginBottom: "-1px",
                            }}
                        >
                            <Icon size={15} />{label}
                        </button>
                    ))}
                </div>

                {/* Branding Tab */}
                {activeTab === "branding" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass rounded-2xl p-5" style={{ border: "1px solid var(--border-color)" }}>
                            <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Colors & Typography</h3>
                            <div className="space-y-4">
                                <div>
                                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                                        Primary Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input type="color" value={branding.primaryColor || "#6366f1"}
                                            onChange={(e) => setBranding((p) => ({ ...p, primaryColor: e.target.value }))}
                                            style={{ width: "44px", height: "40px", borderRadius: "8px", border: "1px solid var(--border-color)", cursor: "pointer", background: "var(--bg-input)", padding: "2px" }}
                                        />
                                        <input value={branding.primaryColor || "#6366f1"} onChange={(e) => setBranding((p) => ({ ...p, primaryColor: e.target.value }))}
                                            placeholder="#6366f1" style={{ ...inputStyle }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                                        Secondary Color
                                    </label>
                                    <div className="flex gap-2">
                                        <input type="color" value={branding.secondaryColor || "#8b5cf6"}
                                            onChange={(e) => setBranding((p) => ({ ...p, secondaryColor: e.target.value }))}
                                            style={{ width: "44px", height: "40px", borderRadius: "8px", border: "1px solid var(--border-color)", cursor: "pointer", background: "var(--bg-input)", padding: "2px" }}
                                        />
                                        <input value={branding.secondaryColor || "#8b5cf6"} onChange={(e) => setBranding((p) => ({ ...p, secondaryColor: e.target.value }))}
                                            placeholder="#8b5cf6" style={{ ...inputStyle }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                                        Font Family
                                    </label>
                                    <select value={branding.font || "Google Sans"} onChange={(e) => setBranding((p) => ({ ...p, font: e.target.value }))}
                                        style={{ ...inputStyle, appearance: "none" }}>
                                        {["Google Sans", "Inter", "Roboto", "Outfit", "Playfair Display", "Montserrat", "Poppins"].map((f) => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>

                                {isOwner && (
                                    <button onClick={handleSaveBranding} disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-[100px] text-sm font-medium"
                                        style={{
                                            background: "var(--text-primary)",
                                            color: "var(--bg-base)", border: "none", cursor: "pointer",
                                            opacity: saving ? 0.6 : 1,
                                        }}
                                    >
                                        <Save size={14} /> {saving ? "Saving..." : "Save Branding"}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="glass rounded-2xl p-5" style={{ border: "1px solid var(--border-color)" }}>
                            <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Live Preview</h3>
                            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-color)" }}>
                                <div style={{
                                    padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
                                    background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(255,255,255,0.05)",
                                }}>
                                    <span style={{ fontWeight: "700", color: branding.primaryColor || "#6366f1" }}>
                                        {tenant?.name}
                                    </span>
                                    <div style={{ display: "flex", gap: "16px" }}>
                                        {["Home", "About", "Contact"].map((l) => (
                                            <span key={l} style={{ fontSize: "12px", color: "#a0a0c0" }}>{l}</span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{
                                    padding: "32px 20px", textAlign: "center",
                                    background: `radial-gradient(ellipse at 50% 0%, ${branding.primaryColor || "#6366f1"}25 0%, transparent 70%)`,
                                }}>
                                    <div style={{
                                        fontSize: "22px", fontWeight: "800", marginBottom: "8px",
                                        background: `linear-gradient(135deg, ${branding.primaryColor || "#6366f1"}, ${branding.secondaryColor || "#8b5cf6"})`,
                                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                                        fontFamily: `"${branding.font || "Google Sans"}", sans-serif`,
                                    }}>
                                        Welcome to {tenant?.name}
                                    </div>
                                    <p style={{ fontSize: "12px", color: "#80809a", marginBottom: "16px" }}>Your AI-powered website</p>
                                    <div style={{
                                        display: "inline-block", padding: "8px 20px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
                                        background: `linear-gradient(135deg, ${branding.primaryColor || "#6366f1"}, ${branding.secondaryColor || "#8b5cf6"})`,
                                        color: "white",
                                    }}>
                                        Get Started
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Team Tab */}
                {activeTab === "team" && (
                    <div className="space-y-6">
                        {isAdmin && (
                            <div className="glass rounded-2xl p-5" style={{ border: "1px solid var(--border-color)" }}>
                                <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Invite Team Member</h3>
                                <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <input value={inviteForm.name} onChange={(e) => setInviteForm((p) => ({ ...p, name: e.target.value }))}
                                        placeholder="Full name" required style={inputStyle} />
                                    <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))}
                                        placeholder="Email" required style={inputStyle} />
                                    <input type="password" value={inviteForm.password} onChange={(e) => setInviteForm((p) => ({ ...p, password: e.target.value }))}
                                        placeholder="Temp password" required minLength={6} style={inputStyle} />
                                    <div className="flex gap-2">
                                        <select value={inviteForm.role} onChange={(e) => setInviteForm((p) => ({ ...p, role: e.target.value }))}
                                            style={{ ...inputStyle, flex: 1, appearance: "none" }}>
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="EDITOR">EDITOR</option>
                                            <option value="DEVELOPER">DEVELOPER</option>
                                        </select>
                                        <button type="submit"
                                            style={{
                                                padding: "10px 16px", borderRadius: "var(--radius-sm)",
                                                background: "var(--text-primary)",
                                                color: "var(--bg-base)", border: "none", cursor: "pointer", whiteSpace: "nowrap",
                                            }}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="glass rounded-2xl p-5" style={{ border: "1px solid var(--border-color)" }}>
                            <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Team Members ({users.length})</h3>
                            <div className="space-y-3">
                                {users.map((u) => {
                                    const RoleIcon = ROLE_ICONS[u.role] || Shield;
                                    const roleStyle = ROLE_COLORS[u.role] || {};
                                    return (
                                        <div key={u._id} className="flex items-center gap-3 p-3 rounded-xl"
                                            style={{ background: "var(--bg-input)", border: "1px solid var(--border-color)" }}>
                                            <div className="flex items-center justify-center rounded-full font-bold text-sm"
                                                style={{ width: "40px", height: "40px", background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)", flexShrink: 0 }}>
                                                {u.name[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>{u.name}</p>
                                                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{u.email}</p>
                                            </div>
                                            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                                                style={{ background: roleStyle.bg, color: roleStyle.color, border: `1px solid ${roleStyle.border}` }}>
                                                <RoleIcon size={10} />{u.role}
                                            </span>
                                            {isOwner && u.role !== "OWNER" && (
                                                <div className="flex items-center gap-1">
                                                    <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                        style={{ fontSize: "12px", padding: "4px 8px", borderRadius: "6px", background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-primary)", cursor: "pointer", outline: "none" }}>
                                                        <option value="ADMIN">ADMIN</option>
                                                        <option value="EDITOR">EDITOR</option>
                                                        <option value="DEVELOPER">DEVELOPER</option>
                                                    </select>
                                                    <button onClick={() => handleRemoveUser(u._id, u.name)}
                                                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", color: "#f87171", cursor: "pointer", padding: "4px 8px" }}>
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Domains Tab */}
                {activeTab === "domains" && (
                    <div className="space-y-6">
                        <div className="glass rounded-2xl p-5" style={{ border: "1px solid var(--border-color)" }}>
                            <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Add Custom Domain</h3>
                            <form onSubmit={handleAddDomain} className="flex gap-3">
                                <input value={newDomain} onChange={(e) => setNewDomain(e.target.value)}
                                    placeholder="example.com" required style={{ ...inputStyle, flex: 1 }} />
                                <button type="submit"
                                    style={{ padding: "10px 20px", borderRadius: "100px", background: "var(--text-primary)", color: "var(--bg-base)", border: "none", cursor: "pointer", fontWeight: "600" }}>
                                    Add Domain
                                </button>
                            </form>
                        </div>

                        <div className="glass rounded-2xl p-5" style={{ border: "1px solid var(--border-color)" }}>
                            <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Domains</h3>
                            <div className="space-y-3">
                                {domains.map((d) => (
                                    <div key={d._id} className="flex items-center gap-3 p-3 rounded-xl"
                                        style={{ background: "var(--bg-input)", border: "1px solid var(--border-color)" }}>
                                        <Globe size={16} style={{ color: d.verified ? "#10b981" : "var(--text-muted)", flexShrink: 0 }} />
                                        <span className="flex-1 font-mono text-sm" style={{ color: "var(--text-primary)" }}>{d.domain}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full`}
                                            style={{
                                                background: d.verified ? "rgba(16,185,129,0.15)" : "rgba(251,191,36,0.15)",
                                                color: d.verified ? "#10b981" : "#fbbf24",
                                                border: `1px solid ${d.verified ? "rgba(16,185,129,0.3)" : "rgba(251,191,36,0.3)"}`,
                                            }}>
                                            {d.verified ? "Verified" : "Pending"}
                                        </span>
                                        {!d.verified && !d.isDefault && (
                                            <button onClick={() => handleVerifyDomain(d._id)}
                                                style={{ fontSize: "12px", color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}>
                                                Verify (simulate)
                                            </button>
                                        )}
                                        {d.isDefault && <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Default</span>}
                                    </div>
                                ))}
                                {domains.length === 0 && (
                                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No domains configured yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
