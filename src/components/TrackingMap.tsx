"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Bike, Home, ChefHat, Clock, Phone, Route } from "lucide-react";

interface TrackingMapProps {
  pickupLabel: string;
  pickupAddress: string;
  dropLabel: string;
  dropAddress: string;
  riderName?: string;
  riderPhone?: string;
  status: "new" | "picked" | "on_way" | "delivered" | "preparing";
  estimatedTime?: string;
  distance?: string;
  variant?: "customer" | "delivery";
}

export default function TrackingMap({
  pickupLabel, pickupAddress, dropLabel, dropAddress,
  riderName, riderPhone, status, estimatedTime, distance, variant = "customer",
}: TrackingMapProps) {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Determine progress based on status
  useEffect(() => {
    const targets: Record<string, number> = { new: 0, preparing: 15, picked: 40, on_way: 75, delivered: 100 };
    const target = targets[status] || 0;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < target) return Math.min(prev + 1, target);
        if (prev > target) return Math.max(prev - 1, target);
        clearInterval(timer);
        return prev;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [status]);

  // Draw map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const cw = w / 2;
    const ch = h / 2;

    // Clear
    ctx.clearRect(0, 0, cw, ch);

    // Background grid (street-like)
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let x = 0; x < cw; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke();
    }
    for (let y = 0; y < ch; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
    }

    // Main roads
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, ch * 0.4); ctx.lineTo(cw, ch * 0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cw * 0.3, 0); ctx.lineTo(cw * 0.3, ch); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cw * 0.7, 0); ctx.lineTo(cw * 0.7, ch); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, ch * 0.7); ctx.lineTo(cw, ch * 0.7); ctx.stroke();

    // Buildings (small rectangles)
    ctx.fillStyle = "#f3f4f6";
    const buildings = [
      [20, 20, 30, 25], [70, 15, 25, 30], [20, 55, 35, 20], [130, 10, 30, 25],
      [180, 50, 25, 30], [10, 100, 30, 20], [80, 90, 25, 25], [150, 95, 30, 20],
      [220, 15, 25, 30], [250, 80, 30, 25], [60, 130, 25, 20], [140, 140, 30, 25],
      [210, 130, 25, 20], [20, 160, 30, 20], [100, 170, 25, 20], [180, 165, 30, 25],
    ];
    buildings.forEach(([bx, by, bw, bh]) => {
      if (bx < cw && by < ch) {
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 0.5;
        ctx.strokeRect(bx, by, bw, bh);
      }
    });

    // Route path
    const pickupX = cw * 0.15;
    const pickupY = ch * 0.75;
    const dropX = cw * 0.85;
    const dropY = ch * 0.25;
    const midX1 = cw * 0.3;
    const midY1 = ch * 0.75;
    const midX2 = cw * 0.3;
    const midY2 = ch * 0.4;
    const midX3 = cw * 0.7;
    const midY3 = ch * 0.4;
    const midX4 = cw * 0.7;
    const midY4 = ch * 0.25;

    // Draw dashed route
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(pickupX, pickupY);
    ctx.lineTo(midX1, midY1);
    ctx.lineTo(midX2, midY2);
    ctx.lineTo(midX3, midY3);
    ctx.lineTo(midX4, midY4);
    ctx.lineTo(dropX, dropY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Active route (colored based on progress)
    const points = [
      [pickupX, pickupY], [midX1, midY1], [midX2, midY2],
      [midX3, midY3], [midX4, midY4], [dropX, dropY],
    ];
    const totalSegments = points.length - 1;
    const activeSegments = (progress / 100) * totalSegments;

    ctx.strokeStyle = variant === "delivery" ? "#f59e0b" : "#16a34a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i <= Math.floor(activeSegments) && i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    const frac = activeSegments - Math.floor(activeSegments);
    if (frac > 0 && Math.floor(activeSegments) < totalSegments) {
      const si = Math.floor(activeSegments);
      const nx = points[si][0] + (points[si + 1][0] - points[si][0]) * frac;
      const ny = points[si][1] + (points[si + 1][1] - points[si][1]) * frac;
      ctx.lineTo(nx, ny);
    }
    ctx.stroke();

    // Pickup marker
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath(); ctx.arc(pickupX, pickupY, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("P", pickupX, pickupY + 3);

    // Drop marker
    ctx.fillStyle = "#16a34a";
    ctx.beginPath(); ctx.arc(dropX, dropY, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "bold 9px sans-serif";
    ctx.fillText("D", dropX, dropY + 3);

    // Rider position
    if (progress > 0 && progress < 100) {
      const riderSeg = (progress / 100) * totalSegments;
      const ri = Math.min(Math.floor(riderSeg), totalSegments - 1);
      const rf = riderSeg - ri;
      const rx = points[ri][0] + (points[ri + 1][0] - points[ri][0]) * rf;
      const ry = points[ri][1] + (points[ri + 1][1] - points[ri][1]) * rf;

      // Glow
      ctx.fillStyle = "rgba(59,130,246,0.15)";
      ctx.beginPath(); ctx.arc(rx, ry, 16, 0, Math.PI * 2); ctx.fill();
      // Marker
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath(); ctx.arc(rx, ry, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "bold 8px sans-serif";
      ctx.fillText("🏍", rx, ry + 3);
    }

  }, [progress, variant]);

  const statusSteps = [
    { key: "new", label: "Order Placed", icon: "📋" },
    { key: "preparing", label: "Preparing", icon: "👩‍🍳" },
    { key: "picked", label: "Picked Up", icon: "📦" },
    { key: "on_way", label: "On the Way", icon: "🚴" },
    { key: "delivered", label: "Delivered", icon: "✅" },
  ];
  const currentIdx = statusSteps.findIndex((s) => s.key === status);

  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #f3f4f6" }}>
      {/* Map Canvas */}
      <div style={{ position: "relative", height: 220, background: "#f9fafb" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

        {/* Legend overlay */}
        <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.9)", borderRadius: 8, padding: "6px 10px", fontSize: 10, display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} /> Pickup</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} /> Drop</span>
          {progress > 0 && progress < 100 && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} /> Rider</span>
          )}
        </div>

        {/* ETA & Distance */}
        <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", gap: 6 }}>
          {estimatedTime && status !== "delivered" && (
            <div style={{ background: "rgba(22,163,74,0.9)", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={13} /> ETA: {estimatedTime}
            </div>
          )}
          {distance && (
            <div style={{ background: "rgba(59,130,246,0.9)", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <Route size={13} /> {distance}
            </div>
          )}
        </div>
      </div>

      {/* Status Progress */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          {statusSteps.map((step, i) => {
            const done = i <= currentIdx;
            return (
              <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative" }}>
                {i > 0 && (
                  <div style={{
                    position: "absolute", top: 14, right: "50%", left: "-50%",
                    height: 3, background: i <= currentIdx ? "#16a34a" : "#e5e7eb",
                    borderRadius: 2, zIndex: 0,
                  }} />
                )}
                <motion.div
                  animate={{ scale: i === currentIdx ? [1, 1.2, 1] : 1 }}
                  transition={{ repeat: i === currentIdx ? Infinity : 0, duration: 1.5 }}
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: done ? "#16a34a" : "#e5e7eb",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, zIndex: 1, position: "relative",
                  }}>
                  {step.icon}
                </motion.div>
                <p style={{ fontSize: 9, fontWeight: 600, color: done ? "#16a34a" : "#9ca3af", marginTop: 4, textAlign: "center" }}>{step.label}</p>
              </div>
            );
          })}
        </div>

        {/* Pickup & Drop Info */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div style={{ background: "#fffbeb", borderRadius: 10, padding: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <ChefHat size={12} color="#f59e0b" />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#92400e", textTransform: "uppercase" }}>Pickup</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 700 }}>{pickupLabel}</p>
            <p style={{ fontSize: 10, color: "#6b7280" }}>{pickupAddress}</p>
          </div>
          <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <Home size={12} color="#16a34a" />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>Drop</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 700 }}>{dropLabel}</p>
            <p style={{ fontSize: 10, color: "#6b7280" }}>{dropAddress}</p>
          </div>
        </div>

        {/* Rider Info (for customer view) */}
        {variant === "customer" && riderName && status !== "new" && status !== "preparing" && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#eff6ff", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🚴</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700 }}>{riderName}</p>
                <p style={{ fontSize: 11, color: "#6b7280" }}>Delivery Partner</p>
              </div>
            </div>
            {riderPhone && (
              <a href={`tel:${riderPhone}`} style={{ display: "flex", alignItems: "center", gap: 4, background: "#3b82f6", color: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                <Phone size={13} /> Call
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
