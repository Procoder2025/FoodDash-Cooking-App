"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Bike, Package, MapPin, Clock, IndianRupee, CheckCircle2, Phone, Navigation, Star, TrendingUp, Zap, Calendar, Map, RefreshCw } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import TrackingMap from "@/components/TrackingMap";

interface DeliveryOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  kitchenName: string;
  kitchenAddress: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  distance: string;
  earnings: number;
  status: "new" | "picked" | "on_way" | "delivered";
  time: string;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; next: string; action: string }> = {
  new: { label: "New Order", color: "#ef4444", bg: "#fef2f2", next: "picked", action: "Accept & Pick Up" },
  picked: { label: "Picked Up", color: "#f59e0b", bg: "#fffbeb", next: "on_way", action: "Start Delivery" },
  on_way: { label: "On the Way", color: "#3b82f6", bg: "#eff6ff", next: "delivered", action: "Mark Delivered" },
  delivered: { label: "Delivered", color: "#16a34a", bg: "#f0fdf4", next: "", action: "" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  return `${Math.floor(hrs / 24)} day${hrs > 24 ? "s" : ""} ago`;
}

function mapStatus(status: string): "new" | "picked" | "on_way" | "delivered" {
  if (status === "placed" || status === "confirmed" || status === "preparing" || status === "ready") return "new";
  if (status === "picked") return "picked";
  if (status === "on_way") return "on_way";
  return "delivered";
}

export default function DeliveryDashboard() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [filter, setFilter] = useState("all");
  const [isOnline, setIsOnline] = useState(true);
  const [expandedMap, setExpandedMap] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      const mapped: DeliveryOrder[] = data.map((o: any) => ({
        id: o.id,
        orderId: o.order_id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone || "",
        customerAddress: o.customer_address || "",
        kitchenName: o.kitchen_name,
        kitchenAddress: "",
        items: (o.items || []).map((i: any) => typeof i === "string" ? i : `${i.name} x${i.qty}`),
        total: Number(o.total),
        distance: `${(Math.random() * 4 + 1).toFixed(1)} km`,
        earnings: Math.round(Number(o.total) * 0.15),
        status: mapStatus(o.status),
        time: timeAgo(o.created_at),
      }));
      setOrders(mapped);
    }
    if (error) console.error("Error fetching delivery orders:", error);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Real-time subscription
    const channel = supabase.channel("delivery-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (!isLoggedIn || user?.role !== "delivery") {
    if (typeof window !== "undefined") router.push("/auth/login");
    return null;
  }

  const todayStr = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
  const todayEarnings = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.earnings, 0);
  const todayDeliveries = orders.filter((o) => o.status === "delivered").length;
  const activeOrders = orders.filter((o) => o.status !== "delivered").length;

  const filteredOrders = filter === "all" ? orders
    : filter === "active" ? orders.filter((o) => o.status !== "delivered")
    : orders.filter((o) => o.status === "delivered");

  const updateStatus = async (id: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus as DeliveryOrder["status"] } : o));
    // Find the order_id for Supabase update
    const order = orders.find((o) => o.id === id);
    if (order) {
      await supabase.from("orders").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("order_id", order.orderId);
    }
  };

  if (loading) {
    return (
      <div style={{ width: "100%", textAlign: "center", padding: "100px 20px" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <RefreshCw size={32} color="#f59e0b" />
        </motion.div>
        <p style={{ color: "#6b7280", marginTop: 12 }}>Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "linear-gradient(135deg, #f59e0b, #d97706)", padding: "36px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, background: "rgba(255,255,255,0.15)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🚴</div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>Delivery Dashboard</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Welcome, {user.name}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255,255,255,0.12)", color: "#fff", padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={14} /> {todayStr}
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsOnline(!isOnline)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: isOnline ? "#fff" : "rgba(255,255,255,0.2)", color: isOnline ? "#16a34a" : "#fff", padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: isOnline ? "#16a34a" : "#ef4444" }} />
              {isOnline ? "Online" : "Offline"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Stats */}
        <FadeInUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { icon: IndianRupee, label: "Today's Earnings", value: `₹${todayEarnings}`, color: "#16a34a" },
              { icon: CheckCircle2, label: "Deliveries Done", value: todayDeliveries, color: "#3b82f6" },
              { icon: Zap, label: "Active Orders", value: activeOrders, color: "#f59e0b" },
              { icon: Star, label: "Rating", value: "4.8", color: "#8b5cf6" },
              { icon: TrendingUp, label: "Total Orders", value: orders.length, color: "#ef4444" },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ y: -3 }} style={{ background: "#fff", borderRadius: 14, padding: 18, border: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, background: `${s.color}12`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={20} color={s.color} />
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 900 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeInUp>

        {/* Vehicle Info */}
        <FadeInUp delay={0.05}>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fffbeb", padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, color: "#92400e" }}>
              <Bike size={14} /> {user.vehicleType || "Bike"} — {user.vehicleNumber || "TN 36 AB 1234"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0fdf4", padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, color: "#166534" }}>
              <MapPin size={14} /> {user.address || "Komarapalayam"}
            </div>
          </div>
        </FadeInUp>

        {/* Filter */}
        <FadeInUp delay={0.1}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
              <Package size={20} color="#f59e0b" /> Orders
            </h2>
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { id: "all", label: `All (${orders.length})` },
                { id: "active", label: `Active (${activeOrders})` },
                { id: "done", label: `Done (${todayDeliveries})` },
              ].map((f) => (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer",
                  background: filter === f.id ? "#f59e0b" : "#f3f4f6",
                  color: filter === f.id ? "#fff" : "#6b7280",
                }}>{f.label}</button>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* No Orders */}
        {orders.length === 0 && (
          <FadeInUp>
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6" }}>
              <Package size={48} color="#d1d5db" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>No orders yet</h3>
              <p style={{ color: "#6b7280" }}>New orders will appear here in real-time when customers place them</p>
            </div>
          </FadeInUp>
        )}

        {/* Orders List */}
        <StaggerContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filteredOrders.map((order) => {
              const config = statusConfig[order.status];
              return (
                <StaggerItem key={order.id}>
                  <motion.div whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
                    style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1px solid #f3f4f6" }}>
                    {/* Order Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 800 }}>#{order.orderId}</span>
                        <span style={{ background: config.bg, color: config.color, padding: "3px 12px", borderRadius: 50, fontSize: 11, fontWeight: 700 }}>{config.label}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {order.time}</span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: "#16a34a" }}>₹{order.earnings}</span>
                      </div>
                    </div>

                    {/* Pickup & Drop */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                      <div style={{ background: "#fffbeb", borderRadius: 10, padding: 12 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "#92400e", marginBottom: 4, textTransform: "uppercase" }}>Pickup</p>
                        <p style={{ fontSize: 13, fontWeight: 700 }}>{order.kitchenName}</p>
                        {order.kitchenAddress && <p style={{ fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}><MapPin size={10} /> {order.kitchenAddress}</p>}
                      </div>
                      <div style={{ background: "#eff6ff", borderRadius: 10, padding: 12 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "#1e40af", marginBottom: 4, textTransform: "uppercase" }}>Drop</p>
                        <p style={{ fontSize: 13, fontWeight: 700 }}>{order.customerName}</p>
                        <p style={{ fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}><MapPin size={10} /> {order.customerAddress}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                      {order.items.map((item, i) => (
                        <span key={i} style={{ background: "#f3f4f6", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500 }}>
                          {typeof item === "string" ? item : `${(item as any).name} x${(item as any).qty}`}
                        </span>
                      ))}
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Total: ₹{order.total}</span>
                    </div>

                    {/* Info & Actions */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: expandedMap === order.id ? 14 : 0 }}>
                      <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#6b7280" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Navigation size={12} /> {order.distance}</span>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setExpandedMap(expandedMap === order.id ? null : order.id)}
                          style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: expandedMap === order.id ? "#eff6ff" : "#fff", fontSize: 12, fontWeight: 600, color: expandedMap === order.id ? "#3b82f6" : "#374151", cursor: "pointer" }}>
                          <Map size={13} /> {expandedMap === order.id ? "Hide Map" : "Track"}
                        </button>
                        {order.status !== "delivered" && order.customerPhone && (
                          <a href={`tel:${order.customerPhone}`}
                            style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer", textDecoration: "none" }}>
                            <Phone size={13} /> Call
                          </a>
                        )}
                        {config.next && (
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateStatus(order.id, config.next)}
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, background: config.color, color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                            {order.status === "new" ? <Package size={13} /> : order.status === "picked" ? <Navigation size={13} /> : <CheckCircle2 size={13} />}
                            {config.action}
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Tracking Map */}
                    {expandedMap === order.id && (
                      <TrackingMap
                        pickupLabel={order.kitchenName}
                        pickupAddress={order.kitchenAddress || "Kitchen Location"}
                        dropLabel={order.customerName}
                        dropAddress={order.customerAddress}
                        status={order.status}
                        estimatedTime={order.status === "on_way" ? "12 min" : order.status === "picked" ? "18 min" : undefined}
                        distance={order.distance}
                        variant="delivery"
                      />
                    )}
                  </motion.div>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </div>
    </div>
  );
}
