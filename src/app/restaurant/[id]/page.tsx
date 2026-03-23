"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { homeCooks } from "@/data/restaurants";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { Star, Clock, Truck, MapPin, IndianRupee, ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";

export default function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const cook = homeCooks.find((c) => c.id === id);
  const { items, totalItems, total } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    if (!cook) return [];
    const cats = [...new Set(cook.menu.map((item) => item.category))];
    return ["all", ...cats];
  }, [cook]);

  const filteredMenu = useMemo(() => {
    if (!cook) return [];
    if (activeCategory === "all") return cook.menu;
    return cook.menu.filter((item) => item.category === activeCategory);
  }, [cook, activeCategory]);

  if (!cook) {
    return (
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a)", padding: "48px 20px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>Kitchen Not Found</h1>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <p style={{ fontSize: 60, marginBottom: 16 }}>🔍</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>This kitchen doesn&apos;t exist</h2>
          <Link href="/menu" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#16a34a", color: "#fff",
            padding: "14px 32px", borderRadius: 12,
            fontSize: 15, fontWeight: 700,
          }}>
            🍱 Browse All Kitchens
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Cover Image Header */}
      <div style={{ position: "relative", width: "100%", height: 280, overflow: "hidden" }}>
        <img src={cook.coverImage} alt={cook.kitchenName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.2), transparent)" }} />

        {/* Back Button */}
        <Link href="/menu" style={{
          position: "absolute", top: 16, left: 16,
          width: 40, height: 40, background: "rgba(255,255,255,0.9)",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)", fontSize: 18,
        }}>
          <ArrowLeft size={18} />
        </Link>

        {/* Chef Info on Cover */}
        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, display: "flex", alignItems: "flex-end", gap: 16 }}>
          <img src={cook.image} alt={cook.name} style={{
            width: 72, height: 72, borderRadius: 18,
            border: "3px solid #fff", objectFit: "cover",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 2 }}>{cook.kitchenName}</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
              by {cook.name} • {cook.speciality.join(" • ")}
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 100px" }}>
        {/* Info Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          {[
            { icon: <Star size={14} color="#f59e0b" fill="#f59e0b" />, text: `${cook.rating} (${(cook.totalOrders / 1000).toFixed(1)}k+ orders)` },
            { icon: <Clock size={14} color="#3b82f6" />, text: cook.deliveryTime },
            { icon: <Truck size={14} color="#16a34a" />, text: cook.deliveryFee === 0 ? "Free delivery" : `₹${cook.deliveryFee} delivery` },
            { icon: <MapPin size={14} color="#ef4444" />, text: cook.location },
          ].map((b, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#fff", padding: "8px 14px", borderRadius: 10,
              fontSize: 13, fontWeight: 600, border: "1px solid #f3f4f6",
              transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {b.icon} {b.text}
            </div>
          ))}
          {!cook.isOpen && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#fef2f2", color: "#dc2626", padding: "8px 14px",
              borderRadius: 10, fontSize: 13, fontWeight: 700,
            }}>
              🔴 Currently Closed
            </div>
          )}
        </div>

        {/* Tagline */}
        <div style={{
          background: "#f0fdf4", borderRadius: 14, padding: 16,
          textAlign: "center", marginBottom: 24, border: "1px solid #dcfce7",
        }}>
          <p style={{ color: "#16a34a", fontWeight: 600, fontStyle: "italic", fontSize: 15 }}>
            &ldquo;{cook.tagline}&rdquo;
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 24, paddingBottom: 4 }} className="no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "9px 20px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                border: "none", cursor: "pointer", whiteSpace: "nowrap",
                background: activeCategory === cat ? "#16a34a" : "#f3f4f6",
                color: activeCategory === cat ? "#fff" : "#4b5563",
                boxShadow: activeCategory === cat ? "0 2px 8px rgba(22,163,74,0.3)" : "none",
                transition: "all 0.2s",
              }}
            >
              {cat === "all" ? "All Items" : cat}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredMenu.map((item) => (
            <MenuItemCard key={item.id} item={item} cook={cook} />
          ))}
        </div>
      </div>

      {/* Floating Cart Bar */}
      {totalItems > 0 && items.some((i) => i.cookId === cook.id) && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#16a34a", padding: "14px 20px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.15)", zIndex: 50,
        }}>
          <Link href="/cart" style={{
            maxWidth: 900, margin: "0 auto",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            color: "#fff",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{
                background: "rgba(255,255,255,0.2)", padding: "4px 14px",
                borderRadius: 8, fontWeight: 700, fontSize: 14,
              }}>
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
                from {cook.kitchenName}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 16 }}>
              <span style={{ display: "flex", alignItems: "center" }}><IndianRupee size={14} strokeWidth={3} />{total.toFixed(0)}</span> <ShoppingCart size={18} />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
