"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { LogIn, UserPlus, ShoppingBag, Lock, MapPin, CreditCard, Receipt, ShoppingCart, Shield, IndianRupee, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "14px 16px",
  background: "#f9fafb", border: "1px solid #e5e7eb",
  borderRadius: 12, fontSize: 14, outline: "none",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart, kitchenName } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", doorNo: "", street: "", area: "", city: "", pincode: "", instructions: "", payment: "card" });
  const platformFee = 5;

  useEffect(() => {
    if (!isLoggedIn) { router.push("/auth/signup?role=customer"); return; }
    if (items.length === 0) router.push("/cart");
  }, [items.length, router, isLoggedIn]);

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      const parts = (user.address || "").split(",").map((s) => s.trim());
      setForm((p) => ({
        ...p,
        name: p.name || user.name || "",
        phone: p.phone || user.phone || "",
        area: p.area || parts[0] || "",
        city: p.city || parts[1] || "",
      }));
    }
  }, [user]);

  if (items.length === 0) return null;

  // If NOT logged in, show signup/login prompt
  if (!isLoggedIn) {
    return (
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a)", padding: "48px 20px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
            <Lock size={28} color="#fff" />
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>Sign Up to Complete Order</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>Create a free account to place your order</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 500, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 40 }}>
            🔐
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Almost there!</h2>
          <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.6, marginBottom: 10 }}>
            You have <strong>{items.length} item{items.length !== 1 ? "s" : ""}</strong> in your cart from <strong>{kitchenName}</strong>.
          </p>
          <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
            Sign up or login to place your order and get it delivered!
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360, margin: "0 auto" }}>
            <Link href="/auth/signup" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#16a34a", color: "#fff", padding: "14px 24px", borderRadius: 12,
              fontSize: 16, fontWeight: 700, boxShadow: "0 4px 15px rgba(22,163,74,0.3)",
            }}>
              <UserPlus size={18} /> Create Free Account
            </Link>
            <Link href="/auth/login" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#f9fafb", color: "#374151", padding: "14px 24px", borderRadius: 12,
              fontSize: 16, fontWeight: 600, border: "1px solid #e5e7eb",
            }}>
              <LogIn size={18} /> Already have an account? Login
            </Link>
          </div>

          <p style={{ marginTop: 24, fontSize: 12, color: "#9ca3af" }}>
            <Shield size={14} color="#9ca3af" /> Your cart items are saved • Free signup • No spam
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);

    const orderId = `FD-${Date.now().toString(36).toUpperCase()}`;

    // Save order to Supabase
    const orderData = {
      order_id: orderId,
      customer_id: user?.id || null,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_address: [form.doorNo, form.street, form.area, form.city, form.pincode].filter(Boolean).join(", "),
      cooker_id: items[0]?.cookId || null,
      kitchen_name: kitchenName || "",
      items: items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price })),
      subtotal: total,
      delivery_fee: 0,
      platform_fee: platformFee,
      total: total + platformFee,
      status: "placed",
      payment_method: form.payment,
    };

    const { error } = await supabase.from("orders").insert(orderData);
    if (error) console.error("Order save error:", error);

    clearCart();
    router.push(`/track?id=${orderId}`);
  };

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const payments = [
    { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
    { id: "upi", label: "UPI Payment", icon: "📱", desc: "GPay, PhonePe, Paytm" },
    { id: "cash", label: "Cash on Delivery", icon: "💵", desc: "Pay when food arrives" },
  ];

  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a)", padding: "48px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <ShoppingBag size={28} color="#fff" />
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}><Package size={24} /> Checkout</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>
              {items.length} item{items.length !== 1 ? "s" : ""} from <strong>{kitchenName}</strong>
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 60px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Delivery Details */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #f3f4f6" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={18} color="#16a34a" /> Delivery Details
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Full Name</label>
                <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter your full name" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Phone Number</label>
                <input type="tel" required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Delivery Address</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8, marginBottom: 8 }}>
                  <input required value={form.doorNo} onChange={(e) => update("doorNo", e.target.value)} placeholder="Door No." style={inputStyle} />
                  <input required value={form.street} onChange={(e) => update("street", e.target.value)} placeholder="Street Name" style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <input required value={form.area} onChange={(e) => update("area", e.target.value)} placeholder="Area / Locality" style={inputStyle} />
                  <input required value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" style={inputStyle} />
                  <input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} placeholder="Pincode" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Delivery Instructions (optional)</label>
                <input type="text" value={form.instructions} onChange={(e) => update("instructions", e.target.value)} placeholder="Ring the doorbell, leave at gate..." style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #f3f4f6" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <CreditCard size={18} color="#16a34a" /> Payment Method
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {payments.map((m) => {
                const selected = form.payment === m.id;
                return (
                  <label key={m.id} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: 16,
                    borderRadius: 14, cursor: "pointer",
                    border: selected ? "2px solid #16a34a" : "2px solid #e5e7eb",
                    background: selected ? "#f0fdf4" : "#fff",
                  }}>
                    <input type="radio" name="payment" value={m.id} checked={selected} onChange={(e) => update("payment", e.target.value)} style={{ display: "none" }} />
                    <span style={{ fontSize: 26 }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{m.label}</p>
                      <p style={{ fontSize: 12, color: "#9ca3af" }}>{m.desc}</p>
                    </div>
                    {selected && <div style={{ width: 22, height: 22, background: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>✓</div>}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #f3f4f6" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Receipt size={18} color="#16a34a" /> Order Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, marginBottom: 16 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#4b5563" }}>{item.name} x{item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 14, display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 900 }}>
              <span>Total</span>
              <span style={{ color: "#16a34a" }}>₹{(total + platformFee).toFixed(0)}</span>
            </div>
          </div>

          {/* Place Order */}
          <button type="submit" disabled={placing} style={{
            width: "100%", padding: "16px 24px", borderRadius: 14,
            background: "#16a34a", color: "#fff", border: "none",
            fontSize: 17, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 15px rgba(22,163,74,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            opacity: placing ? 0.7 : 1,
          }}>
            {placing ? "Placing Order..." : <><ShoppingCart size={18} /> Place Order — ₹{(total + platformFee).toFixed(0)}</>}
          </button>
        </form>
      </div>
    </div>
  );
}
