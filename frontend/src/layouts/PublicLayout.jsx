import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

/* ─── Shared CSS for the public navbar & footer ──────────────────────────── */
export const PUBLIC_LAYOUT_STYLES = `
/* Removed Inter font import, inheriting from global styles instead */

  .sp-nav-link {
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    font-size: 14px;
    font-weight: 450;
    transition: color 0.15s ease;
    letter-spacing: -0.01em;
  }
  .sp-nav-link:hover { color: rgba(255,255,255,0.95); }

  .sp-cta-primary {
    position: relative;
    background: var(--color-primary);
    color: #000;
    border: none;
    padding: 9px 20px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease;
    letter-spacing: -0.01em;
  }
  .sp-cta-primary:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 6px 28px rgba(249, 115, 22, 0.45); /* Orange glow */
  }
  .sp-cta-primary:active { transform: translateY(0) scale(0.99); }

  .sp-logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 18px rgba(249, 115, 22, 0.35); /* Orange glow */
    flex-shrink: 0;
  }
`;

/* ─── Logo ──────────────────────────────────────────────────────────────── */
function Logo() {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="sp-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 16, height: 16 }}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <span style={{
                fontWeight: 700,
                fontSize: 19,
                letterSpacing: "-0.04em",
                color: "white",
                lineHeight: 1,
            }}>
                Site<span style={{ color: "var(--color-primary)" }}>Pilot</span>
            </span>
        </div>
    );
}

/* ─── Public Navbar ─────────────────────────────────────────────────────── */
export function PublicNavbar({ scrolled }) {
    return (
        <nav style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: "0 5%",
            height: 68,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: scrolled ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.3)",
            backdropFilter: "blur(20px) saturate(1.8)",
            borderBottom: scrolled
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(255,255,255,0.04)",
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}>
            <Link to="/home" style={{ textDecoration: "none" }}>
                <Logo />
            </Link>

            {/* Nav links — hidden on small viewports via inline style max-width */}
            <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
                {["Features", "Pricing", "Docs", "Blog"].map((l) => (
                    <a key={l} href="#" className="sp-nav-link">{l}</a>
                ))}
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Link to="/login" className="sp-nav-link" style={{ padding: "8px 14px" }}>Sign in</Link>
                <Link to="/register" className="sp-cta-primary">
                    Get Started Free
                </Link>
            </div>
        </nav>
    );
}

/* ─── Public Footer ─────────────────────────────────────────────────────── */
export function PublicFooter() {
    return (
        <footer style={{
            padding: "36px 5% 44px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "#000",
        }}>
            <div style={{
                maxWidth: 1100,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 20,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Logo />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", marginLeft: 8 }}>
                        © 2026 SitePilot, Inc.
                    </span>
                </div>
                <div style={{ display: "flex", gap: 28 }}>
                    {["Privacy", "Terms", "Security", "Status"].map((l) => (
                        <a key={l} href="#" className="sp-nav-link" style={{ fontSize: 13 }}>{l}</a>
                    ))}
                </div>
            </div>
        </footer>
    );
}

/* ─── PublicLayout wrapper (used via <Outlet />) ─────────────────────────── */
export default function PublicLayout() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <style>{PUBLIC_LAYOUT_STYLES}</style>
            <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column" }}>
                <PublicNavbar scrolled={scrolled} />
                {/* main fills remaining space */}
                <main style={{ flex: 1 }}>
                    <Outlet />
                </main>
                <PublicFooter />
            </div>
        </>
    );
}
