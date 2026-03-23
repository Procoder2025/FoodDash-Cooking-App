"use client";

import { memo } from "react";
import Image from "next/image";
import type { MenuItem, HomeCook } from "@/data/restaurants";
import { useCart } from "@/context/CartContext";
import { IndianRupee } from "lucide-react";

export default memo(function MenuItemCard({ item, cook }: { item: MenuItem; cook: HomeCook }) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const cartItem = items.find((i) => i.id === item.id);

  return (
    <div style={{
      display: "flex", gap: 16,
      background: "#fff", borderRadius: 16, padding: 18,
      border: "1px solid #f3f4f6",
      transition: "box-shadow 0.2s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.06)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{
            width: 16, height: 16,
            border: `2px solid ${item.isVeg ? "#16a34a" : "#ef4444"}`,
            borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 7, color: item.isVeg ? "#16a34a" : "#ef4444",
          }}>●</span>
          {item.bestseller && (
            <span style={{
              background: "#fef3c7", color: "#92400e",
              padding: "2px 10px", borderRadius: 50, fontSize: 10, fontWeight: 700,
            }}>★ Bestseller</span>
          )}
        </div>
        <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.name}</h4>
        <p style={{ fontSize: 17, fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", color: "#16a34a" }}><IndianRupee size={15} strokeWidth={3} />{item.price}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8, fontSize: 12, color: "#6b7280" }}>
          <span style={{ color: "#fbbf24" }}>★</span> {item.rating}
        </div>
        <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
          {item.description}
        </p>
      </div>

      {/* Image + Add Button */}
      <div style={{ position: "relative", flexShrink: 0, width: 130, height: 110 }}>
        <Image src={item.image} alt={item.name} fill sizes="130px" style={{ objectFit: "cover", borderRadius: 14 }} loading="lazy" />
        <div style={{ position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)" }}>
          {cartItem ? (
            <div style={{
              display: "flex", alignItems: "center",
              background: "#16a34a", color: "#fff",
              borderRadius: 10, overflow: "hidden",
              boxShadow: "0 4px 12px rgba(22,163,74,0.35)",
            }}>
              <button onClick={() => cartItem.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, cartItem.quantity - 1)}
                style={{ padding: "8px 12px", background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>
                −
              </button>
              <span style={{ padding: "8px 4px", fontSize: 13, fontWeight: 700, minWidth: 24, textAlign: "center" as const }}>
                {cartItem.quantity}
              </span>
              <button onClick={() => addItem(item, cook)}
                style={{ padding: "8px 12px", background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addItem(item, cook)}
              disabled={!cook.isOpen}
              style={{
                background: "#fff", color: "#16a34a",
                border: "2px solid #16a34a",
                padding: "8px 24px", borderRadius: 10,
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
                opacity: cook.isOpen ? 1 : 0.5,
              }}
              onMouseEnter={(e) => { if (cook.isOpen) { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#16a34a"; }}
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
})
