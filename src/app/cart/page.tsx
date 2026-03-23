"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, Receipt, Truck, IndianRupee, BadgePercent } from "lucide-react";
import { FadeInUp } from "@/components/AnimatedSection";

export default function CartPage() {
  const { items, kitchenName, updateQuantity, removeItem, clearCart, subtotal, deliveryFee, total } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  if (!isLoggedIn) {
    router.push("/auth/signup?role=customer");
    return null;
  }
  const platformFee = 5;

  if (items.length === 0) {
    return (
      <div style={{ width: "100%" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a)", padding: "48px 20px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
            <ShoppingBag size={28} color="#fff" />
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>Your Cart</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>Review your items before checkout</p>
            </div>
          </div>
        </motion.div>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <div style={{ width: 80, height: 80, background: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <ShoppingBag size={36} color="#9ca3af" />
            </div>
          </motion.div>
          <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Your cart is empty</motion.h2>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ color: "#6b7280", marginBottom: 28 }}>Add some delicious homemade food from our home chefs</motion.p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/menu" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#16a34a", color: "#fff", padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700, boxShadow: "0 4px 15px rgba(22,163,74,0.3)" }}>
                🍱 Browse Home Kitchens
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/track" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#3b82f6", color: "#fff", padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700, boxShadow: "0 4px 15px rgba(59,130,246,0.3)" }}>
                📍 Track Your Order
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a)", padding: "48px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <ShoppingBag size={28} color="#fff" />
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>Your Cart</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>from {kitchenName}</p>
          </div>
        </div>
      </motion.div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 60px" }}>
        <FadeInUp>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearCart} style={{
              display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 13, fontWeight: 600,
            }}>
              <Trash2 size={14} /> Clear Cart
            </motion.button>
          </div>

          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", overflow: "hidden", marginBottom: 24 }}>
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: 18, borderTop: i > 0 ? "1px solid #f3f4f6" : "none" }}>
                  <img src={item.image} alt={item.name} style={{ width: 60, height: 60, borderRadius: 12, objectFit: "cover" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ width: 12, height: 12, border: `2px solid ${item.isVeg ? "#16a34a" : "#ef4444"}`, borderRadius: 2, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 6, color: item.isVeg ? "#16a34a" : "#ef4444" }}>●</span>
                      <h3 style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</h3>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 800 }}>₹{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", border: "2px solid #16a34a", borderRadius: 10, overflow: "hidden" }}>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}
                      style={{ padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer", color: "#16a34a", display: "flex" }}>
                      {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                    </motion.button>
                    <span style={{ padding: "8px 6px", fontSize: 14, fontWeight: 700, color: "#16a34a", borderLeft: "2px solid #16a34a", borderRight: "2px solid #16a34a", minWidth: 32, textAlign: "center" as const }}>{item.quantity}</span>
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer", color: "#16a34a", display: "flex" }}>
                      <Plus size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #f3f4f6", marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}><Receipt size={20} color="#16a34a" /> Bill Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6b7280" }}>Item Total</span><span style={{ fontWeight: 600 }}>₹{subtotal.toFixed(0)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6b7280" }}>Delivery Fee</span><span style={{ fontWeight: 600, color: deliveryFee === 0 ? "#16a34a" : "#111" }}>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(0)}`}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#6b7280" }}>Platform Fee</span><span style={{ fontWeight: 600 }}>₹{platformFee}</span></div>
              <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 900 }}>
                <span>Grand Total</span><span style={{ color: "#16a34a" }}>₹{(total + platformFee).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/checkout" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              width: "100%", background: "#16a34a", color: "#fff",
              padding: "16px 24px", borderRadius: 14, fontSize: 17, fontWeight: 700,
              boxShadow: "0 4px 15px rgba(22,163,74,0.3)",
            }}>
              Proceed to Checkout <ArrowRight size={20} />
            </Link>
          </motion.div>
        </FadeInUp>
      </div>
    </div>
  );
}
