"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) =>
        console.log("SW registration failed:", err)
      );
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner after 3 seconds
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const dismiss = () => {
    setShowBanner(false);
    // Don't show again for 24 hours
    localStorage.setItem("pwa_dismissed", Date.now().toString());
  };

  // Don't show if dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa_dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 86400000) {
      setShowBanner(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {showBanner && deferredPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          style={{
            position: "fixed", bottom: 20, left: 20, right: 20,
            background: "#fff", borderRadius: 16, padding: "16px 20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)", border: "1px solid #e5e7eb",
            display: "flex", alignItems: "center", gap: 14, zIndex: 1000,
            maxWidth: 400, margin: "0 auto",
          }}
        >
          <div style={{
            width: 44, height: 44, background: "#f0fdf4", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Download size={22} color="#16a34a" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Install FoodDash</p>
            <p style={{ fontSize: 11, color: "#6b7280" }}>Add to home screen for quick access</p>
          </div>
          <button onClick={handleInstall} style={{
            background: "#16a34a", color: "#fff", border: "none", padding: "8px 16px",
            borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>
            Install
          </button>
          <button onClick={dismiss} style={{
            background: "none", border: "none", cursor: "pointer", padding: 4,
          }}>
            <X size={16} color="#9ca3af" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
