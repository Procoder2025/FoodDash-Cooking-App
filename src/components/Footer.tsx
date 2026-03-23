"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ width: "100%", background: "#0f172a", color: "#94a3b8" }}>
      {/* Green top line */}
      <div style={{ height: 3, background: "linear-gradient(to right, #16a34a, #4ade80, #16a34a)" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 40,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40,
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 900, fontSize: 18,
              }}>F</div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>
                Food<span style={{ color: "#4ade80" }}>Dash</span>
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
              Connecting food lovers with talented home chefs.
              Fresh, authentic, homemade meals delivered daily.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["FB", "IG", "TW", "YT"].map((s) => (
                <span key={s} style={{
                  width: 36, height: 36, background: "#1e293b",
                  borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, cursor: "pointer",
                }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 18 }}>Quick Links</h4>
            {[
              { href: "/menu", label: "Order Food" },
              { href: "/subscription", label: "Subscriptions" },
              { href: "/party-orders", label: "Party Orders" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact Us" },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{
                display: "block", fontSize: 13, marginBottom: 10,
                transition: "color 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#4ade80"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cities */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 18 }}>We Deliver In</h4>
            {["Komarapalayam", "Hosur", "Coimbatore"].map((c) => (
              <div key={c} style={{ fontSize: 13, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, background: "#4ade80", borderRadius: "50%", display: "inline-block" }} />
                {c}
              </div>
            ))}
            <p style={{ fontSize: 11, color: "#475569", marginTop: 14, background: "#1e293b", padding: "8px 12px", borderRadius: 8 }}>
              Coming soon: Salem, Erode, Chennai
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 18 }}>Contact Us</h4>
            <div style={{ fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
              📍 Main Road, Near Bus Stand,<br />Komarapalayam, Tamil Nadu 638183
            </div>
            <div style={{ fontSize: 13, marginBottom: 10 }}>📧 support@fooddash.in</div>
            <div style={{ fontSize: 13 }}>📞 +91 98765 43210</div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid #1e293b", marginTop: 48, paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12, fontSize: 12, color: "#475569",
        }}>
          <p>© {new Date().getFullYear()} FoodDash Technologies Pvt Ltd. All rights reserved.</p>
          <div style={{ display: "flex", gap: 20 }}>
            <span style={{ cursor: "pointer" }}>Privacy Policy</span>
            <span style={{ cursor: "pointer" }}>Terms</span>
            <span style={{ cursor: "pointer" }}>FAQs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
