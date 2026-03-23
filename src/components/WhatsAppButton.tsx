"use client";

import { motion } from "framer-motion";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/919092241237?text=Hi!%20I%20want%20to%20order%20food"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ y: { repeat: Infinity, duration: 2.5, ease: "easeInOut" } }}
      style={{
        position: "fixed", bottom: 20, right: 16, zIndex: 100,
        width: 50, height: 50,
        background: "#25D366", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 14px rgba(37,211,102,0.45)",
      }}
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.742 3.047 9.379L1.054 31.14l5.957-1.964A15.91 15.91 0 0016.004 32C24.826 32 32 24.826 32 16.004S24.826 0 16.004 0zm9.316 22.594c-.39 1.1-1.932 2.014-3.17 2.281-.847.18-1.953.324-5.676-1.22-4.763-1.977-7.826-6.81-8.065-7.126-.23-.316-1.932-2.574-1.932-4.91s1.222-3.48 1.657-3.957c.435-.478.95-.597 1.266-.597.316 0 .632.003.907.016.29.014.682-.11 1.067.815.39.94 1.327 3.236 1.445 3.472.118.236.197.51.04.826-.158.316-.237.512-.474.789-.236.277-.498.618-.71.83-.237.236-.483.493-.208.968.277.474 1.228 2.025 2.636 3.28 1.81 1.613 3.337 2.114 3.81 2.35.475.237.752.198 1.03-.118.276-.316 1.186-1.384 1.503-1.86.316-.475.632-.395 1.067-.236.435.158 2.77 1.306 3.245 1.543.474.237.79.355.908.553.118.197.118 1.147-.272 2.247z"/>
      </svg>
    </motion.a>
  );
}
