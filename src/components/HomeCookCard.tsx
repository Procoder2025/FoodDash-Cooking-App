"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { HomeCook } from "@/data/restaurants";
import { Clock, MapPin, TrendingUp, Star } from "lucide-react";

export default memo(function HomeCookCard({ cook }: { cook: HomeCook }) {
  return (
    <Link href={`/restaurant/${cook.id}`} style={{ display: "block" }}>
      <div style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        border: "1px solid #f3f4f6",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "all 0.3s",
        cursor: "pointer",
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 12px 35px rgba(0,0,0,0.1)";
          e.currentTarget.style.transform = "translateY(-6px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Cover */}
        <div style={{ position: "relative", height: 170, overflow: "hidden" }}>
          <Image src={cook.coverImage} alt={cook.kitchenName} fill sizes="(max-width: 640px) 100vw, 33vw" style={{ objectFit: "cover", transition: "transform 0.5s" }} loading="lazy" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />

          {!cook.isOpen && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ background: "#ef4444", color: "#fff", padding: "6px 18px", borderRadius: 50, fontSize: 13, fontWeight: 700 }}>
                Currently Closed
              </span>
            </div>
          )}

          {cook.deliveryFee === 0 && cook.isOpen && (
            <span style={{
              position: "absolute", top: 12, left: 12,
              background: "#16a34a", color: "#fff",
              padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 700,
            }}>
              FREE Delivery
            </span>
          )}

          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "#fff", borderRadius: 8, padding: "4px 10px",
            display: "flex", alignItems: "center", gap: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}>
            <Star size={12} color="#fbbf24" fill="#fbbf24" />
            <span style={{ fontSize: 12, fontWeight: 700 }}>{cook.rating}</span>
          </div>

          {/* Chef Avatar */}
          <div style={{ position: "absolute", bottom: -24, left: 16 }}>
            <Image src={cook.image} alt={cook.name} width={52} height={52} style={{
              borderRadius: 14,
              border: "3px solid #fff", objectFit: "cover",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }} loading="lazy" />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "34px 16px 16px" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{cook.kitchenName}</h3>
          <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 8 }}>by {cook.name}</p>
          <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", marginBottom: 12 }}>
            &ldquo;{cook.tagline}&rdquo;
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
            {cook.speciality.map((s) => (
              <span key={s} style={{
                background: "#f3f4f6", color: "#6b7280",
                padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
              }}>
                {s}
              </span>
            ))}
          </div>

          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingTop: 12, borderTop: "1px solid #f3f4f6",
            fontSize: 11, color: "#9ca3af",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} color="#f59e0b" /> {cook.deliveryTime}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={11} color="#ef4444" /> {cook.location}</span>
            <span style={{ color: "#16a34a", fontWeight: 600, display: "flex", alignItems: "center", gap: 3 }}><TrendingUp size={11} color="#16a34a" /> {(cook.totalOrders / 1000).toFixed(1)}k+</span>
          </div>
        </div>
      </div>
    </Link>
  );
})
