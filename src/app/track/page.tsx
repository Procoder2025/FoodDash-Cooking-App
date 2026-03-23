"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Package, Clock, IndianRupee, RefreshCw } from "lucide-react";
import TrackingMap from "@/components/TrackingMap";
import { FadeInUp } from "@/components/AnimatedSection";

interface TrackedOrder {
  id: string;
  order_id: string;
  kitchen_name: string;
  cooker_id: string;
  customer_name: string;
  customer_address: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "placed" | "confirmed" | "preparing" | "ready" | "picked" | "on_way" | "delivered";
  delivery_partner_id: string | null;
  created_at: string;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("id");
  const { user } = useAuth();
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(orderIdParam);
  const [loading, setLoading] = useState(true);
  const [riderInfo, setRiderInfo] = useState<{ name: string; phone: string } | null>(null);
  const [cookerAddress, setCookerAddress] = useState<string>("");

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

    // If logged in, show user's orders; otherwise show all for demo
    if (user) {
      query = query.eq("customer_id", user.id);
    }

    const { data, error } = await query;
    if (data && data.length > 0) {
      setOrders(data);
      if (!selectedOrder) setSelectedOrder(data[0].order_id);
    }
    if (error) console.error("Error fetching orders:", error);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Real-time subscription for order updates
    const channel = supabase.channel("order-tracking")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "UPDATE") {
          setOrders((prev) => prev.map((o) =>
            o.id === payload.new.id ? { ...o, ...payload.new } : o
          ));
        } else {
          fetchOrders();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Fetch rider info and cooker address
  useEffect(() => {
    const active = orders.find((o) => o.order_id === selectedOrder);
    if (!active) return;

    // Fetch rider
    if (active.delivery_partner_id) {
      supabase.from("users").select("name, phone").eq("id", active.delivery_partner_id).single()
        .then(({ data }) => {
          if (data) setRiderInfo({ name: data.name, phone: data.phone });
        });
    } else {
      setRiderInfo(null);
    }

    // Fetch cooker address
    if (active.cooker_id) {
      supabase.from("users").select("address").eq("id", active.cooker_id).single()
        .then(({ data }) => {
          if (data?.address) setCookerAddress(data.address);
        });
    }
  }, [selectedOrder, orders]);

  // Calculate simulated distance based on addresses
  const getDistance = (): string => {
    const active = orders.find((o) => o.order_id === selectedOrder);
    if (!active) return "";
    const pickup = cookerAddress || "";
    const drop = active.customer_address || "";
    // Simple distance estimation based on whether same area
    const pickupCity = pickup.split(",").pop()?.trim().toLowerCase() || "";
    const dropCity = drop.split(",").pop()?.trim().toLowerCase() || "";
    if (pickupCity === dropCity) return `${(Math.random() * 3 + 1).toFixed(1)} km`;
    return `${(Math.random() * 8 + 3).toFixed(1)} km`;
  };

  const activeOrder = orders.find((o) => o.order_id === selectedOrder) || orders[0];

  // Map Supabase status to TrackingMap status
  const mapStatus = (status: string): "new" | "preparing" | "picked" | "on_way" | "delivered" => {
    if (status === "placed" || status === "confirmed") return "new";
    if (status === "preparing" || status === "ready") return "preparing";
    if (status === "picked") return "picked";
    if (status === "on_way") return "on_way";
    return "delivered";
  };

  const getETA = (status: string): string | undefined => {
    if (status === "preparing") return "20-25 min";
    if (status === "ready") return "10-15 min";
    if (status === "picked" || status === "on_way") return "8-12 min";
    return undefined;
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string; bg: string }> = {
      placed: { text: "Placed", color: "#f59e0b", bg: "#fffbeb" },
      confirmed: { text: "Confirmed", color: "#3b82f6", bg: "#eff6ff" },
      preparing: { text: "Preparing", color: "#f59e0b", bg: "#fffbeb" },
      ready: { text: "Ready", color: "#8b5cf6", bg: "#f5f3ff" },
      picked: { text: "Picked Up", color: "#3b82f6", bg: "#eff6ff" },
      on_way: { text: "On the Way", color: "#3b82f6", bg: "#eff6ff" },
      delivered: { text: "Delivered", color: "#16a34a", bg: "#f0fdf4" },
    };
    return labels[status] || labels.placed;
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  if (loading) {
    return (
      <div style={{ width: "100%", textAlign: "center", padding: "100px 20px" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <RefreshCw size={32} color="#16a34a" />
        </motion.div>
        <p style={{ color: "#6b7280", marginTop: 12 }}>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ width: "100%" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ width: "100%", background: "linear-gradient(135deg, #3b82f6, #2563eb)", padding: "36px 20px", textAlign: "center" }}>
          <MapPin size={36} color="#fff" style={{ margin: "0 auto 10px", opacity: 0.9 }} />
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>Track Your Order</h1>
        </motion.div>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <Package size={48} color="#d1d5db" style={{ margin: "0 auto 12px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>No active orders</h3>
          <p style={{ color: "#6b7280", marginBottom: 20 }}>Place an order to start tracking</p>
          <a href="/browse" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#16a34a", color: "#fff", padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            Browse Food
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ width: "100%", background: "linear-gradient(135deg, #3b82f6, #2563eb)", padding: "36px 20px", textAlign: "center" }}>
        <MapPin size={36} color="#fff" style={{ margin: "0 auto 10px", opacity: 0.9 }} />
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Track Your Order</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>Live tracking — updates in real-time</p>
      </motion.div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Order Selector */}
        <FadeInUp>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
            {orders.map((o) => {
              const sl = statusLabel(o.status);
              return (
                <button key={o.order_id} onClick={() => setSelectedOrder(o.order_id)} style={{
                  padding: "10px 18px", borderRadius: 10, fontSize: 12, fontWeight: 700, border: "2px solid",
                  borderColor: selectedOrder === o.order_id ? "#3b82f6" : "#e5e7eb",
                  background: selectedOrder === o.order_id ? "#eff6ff" : "#fff",
                  color: selectedOrder === o.order_id ? "#3b82f6" : "#374151",
                  cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
                }}>
                  <Package size={13} /> #{o.order_id}
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 50, background: sl.bg, color: sl.color }}>
                    {sl.text}
                  </span>
                </button>
              );
            })}
          </div>
        </FadeInUp>

        {/* Tracking Map */}
        {activeOrder && (
          <>
            <FadeInUp delay={0.1}>
              <TrackingMap
                pickupLabel={activeOrder.kitchen_name}
                pickupAddress={cookerAddress || "Kitchen Location"}
                dropLabel="Your Location"
                dropAddress={activeOrder.customer_address || "Delivery Address"}
                riderName={riderInfo?.name}
                riderPhone={riderInfo?.phone}
                status={mapStatus(activeOrder.status)}
                estimatedTime={getETA(activeOrder.status)}
                distance={getDistance()}
                variant="customer"
              />
            </FadeInUp>

            {/* Live Status Badge */}
            <FadeInUp delay={0.15}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, marginBottom: 16 }}>
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ width: 10, height: 10, borderRadius: "50%", background: activeOrder.status === "delivered" ? "#16a34a" : "#3b82f6", display: "inline-block" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: statusLabel(activeOrder.status).color }}>
                  {statusLabel(activeOrder.status).text}
                </span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>— updates automatically</span>
              </div>
            </FadeInUp>

            {/* Order Details */}
            <FadeInUp delay={0.2}>
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f3f4f6", padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800 }}>Order #{activeOrder.order_id}</h3>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>{activeOrder.kitchen_name}</p>
                  </div>
                  <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={12} /> {formatTime(activeOrder.created_at)}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                  {(activeOrder.items || []).map((item: any, i: number) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < activeOrder.items.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
                        <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 6 }}>x{item.qty}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "2px solid #f3f4f6" }}>
                  <span style={{ fontSize: 15, fontWeight: 800 }}>Total</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#16a34a", display: "flex", alignItems: "center" }}>
                    <IndianRupee size={16} strokeWidth={3} />{activeOrder.total}
                  </span>
                </div>
              </div>
            </FadeInUp>
          </>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "80px 20px", color: "#6b7280" }}>Loading...</div>}>
      <TrackContent />
    </Suspense>
  );
}
