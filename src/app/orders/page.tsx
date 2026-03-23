"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ClipboardList, Package, ChefHat, Truck, CheckCircle, MapPin, Phone, Clock, IndianRupee, Star, ShoppingBag, RefreshCw } from "lucide-react";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  restaurant: string;
  items: OrderItem[];
  total: number;
  status: "placed" | "confirmed" | "preparing" | "on_the_way" | "delivered";
  time: string;
  estimatedTime?: string;
  deliveryPerson?: { name: string; phone: string; rating: number };
}

const statusSteps = [
  { key: "placed", label: "Order Placed", icon: ShoppingBag, color: "#6b7280" },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle, color: "#3b82f6" },
  { key: "preparing", label: "Preparing", icon: ChefHat, color: "#f59e0b" },
  { key: "on_the_way", label: "On the Way", icon: Truck, color: "#8b5cf6" },
  { key: "delivered", label: "Delivered", icon: CheckCircle, color: "#16a34a" },
];

const statusIndex = (s: string) => statusSteps.findIndex((st) => st.key === s);

function OrdersContent() {
  const searchParams = useSearchParams();
  const newOrderId = searchParams.get("new");
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"active" | "delivered" | "all">("all");

  useEffect(() => {
    const mock: Order[] = [
      {
        id: "FDMNO456", restaurant: "Royal Biryani House", time: "Today, 1:15 PM", estimatedTime: "15 min",
        items: [{ name: "Hyderabadi Dum Biryani", qty: 1, price: 219 }, { name: "Phirni", qty: 1, price: 59 }],
        total: 278, status: "on_the_way",
        deliveryPerson: { name: "Ravi Kumar", phone: "+91 90922 41237", rating: 4.8 },
      },
      {
        id: "FDPQR321", restaurant: "Amma's Kitchen", time: "Today, 12:30 PM", estimatedTime: "25 min",
        items: [{ name: "Sambar Rice Combo", qty: 2, price: 89 }, { name: "Masala Dosa", qty: 1, price: 79 }, { name: "Filter Coffee", qty: 2, price: 29 }],
        total: 315, status: "preparing",
      },
      {
        id: "FDABC123", restaurant: "Amma's Kitchen", time: "Yesterday, 7:30 PM",
        items: [{ name: "Sambar Rice Combo", qty: 2, price: 89 }, { name: "Filter Coffee", qty: 2, price: 29 }],
        total: 236, status: "delivered",
      },
      {
        id: "FDXYZ789", restaurant: "Spice Trail Kitchen", time: "Mar 17, 12:45 PM",
        items: [{ name: "Butter Chicken", qty: 1, price: 189 }, { name: "Garlic Naan", qty: 2, price: 49 }],
        total: 287, status: "delivered",
      },
    ];
    if (newOrderId) {
      mock.unshift({
        id: newOrderId, restaurant: "Your Order", time: "Just now", estimatedTime: "30-40 min",
        items: [{ name: "Order placed successfully!", qty: 1, price: 0 }],
        total: 0, status: "placed",
      });
      setExpandedId(newOrderId);
    }
    setOrders(mock);
  }, [newOrderId]);

  // Simulate live status update for new orders
  useEffect(() => {
    if (!newOrderId) return;
    const t1 = setTimeout(() => {
      setOrders((prev) => prev.map((o) => o.id === newOrderId ? { ...o, status: "confirmed" as const } : o));
    }, 4000);
    const t2 = setTimeout(() => {
      setOrders((prev) => prev.map((o) => o.id === newOrderId ? { ...o, status: "preparing" as const, estimatedTime: "25-30 min" } : o));
    }, 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [newOrderId]);

  const filtered = filter === "all" ? orders
    : filter === "active" ? orders.filter((o) => o.status !== "delivered")
    : orders.filter((o) => o.status === "delivered");

  const activeCount = orders.filter((o) => o.status !== "delivered").length;

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "linear-gradient(135deg, #15803d, #16a34a)", padding: "40px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ClipboardList size={26} color="#fff" />
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>My Orders</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Track your deliveries in real-time</p>
            </div>
          </div>
          {activeCount > 0 && (
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ background: "#fff", color: "#16a34a", padding: "7px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                style={{ width: 8, height: 8, background: "#f97316", borderRadius: "50%" }} />
              {activeCount} Active
            </motion.div>
          )}
        </div>
      </motion.div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            { id: "all" as const, label: `All (${orders.length})` },
            { id: "active" as const, label: `Active (${activeCount})` },
            { id: "delivered" as const, label: `Delivered (${orders.filter((o) => o.status === "delivered").length})` },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
              padding: "9px 18px", borderRadius: 50, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer",
              background: filter === tab.id ? "#16a34a" : "#f3f4f6",
              color: filter === tab.id ? "#fff" : "#4b5563",
              transition: "all 0.2s",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <Package size={56} color="#d1d5db" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No orders yet</h2>
            <p style={{ color: "#6b7280", marginBottom: 28 }}>Your order history will appear here</p>
            <Link href="/browse" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#16a34a", color: "#fff", padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700,
            }}>
              Browse Food
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map((order) => {
              const si = statusIndex(order.status);
              const isActive = order.status !== "delivered";
              const isExpanded = expandedId === order.id;

              return (
                <motion.div key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "#fff", borderRadius: 16, overflow: "hidden",
                    border: isActive ? "2px solid #dcfce7" : "1px solid #f3f4f6",
                    boxShadow: isActive ? "0 4px 15px rgba(22,163,74,0.08)" : "none",
                  }}
                >
                  {/* Order Header — click to expand */}
                  <div onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    style={{ padding: "18px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700 }}>{order.restaurant}</h3>
                        {isActive && order.estimatedTime && (
                          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>
                            <Clock size={11} /> ETA: {order.estimatedTime}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 11, color: "#9ca3af" }}>#{order.id} • {order.time}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {order.total > 0 && (
                        <span style={{ fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", color: "#16a34a" }}>
                          <IndianRupee size={14} strokeWidth={3} />{order.total}
                        </span>
                      )}
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        background: statusSteps[si].color + "15",
                        color: statusSteps[si].color,
                        padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 700,
                      }}>
                        {(() => { const Icon = statusSteps[si].icon; return <Icon size={12} />; })()}
                        {statusSteps[si].label}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ padding: "0 20px 20px" }}>
                          {/* Live Progress Tracker */}
                          {isActive && (
                            <div style={{ background: "#f9fafb", borderRadius: 14, padding: "18px 16px", marginBottom: 16 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", marginBottom: 6 }}>
                                {/* Progress Line */}
                                <div style={{ position: "absolute", top: 15, left: 20, right: 20, height: 3, background: "#e5e7eb", borderRadius: 2, zIndex: 0 }}>
                                  <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${(si / (statusSteps.length - 1)) * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    style={{ height: "100%", background: "#16a34a", borderRadius: 2 }}
                                  />
                                </div>
                                {statusSteps.map((step, i) => {
                                  const done = i <= si;
                                  const current = i === si;
                                  const Icon = step.icon;
                                  return (
                                    <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative", zIndex: 1, flex: 1 }}>
                                      <motion.div
                                        animate={current ? { scale: [1, 1.15, 1] } : {}}
                                        transition={{ repeat: current ? Infinity : 0, duration: 1.5 }}
                                        style={{
                                          width: 32, height: 32, borderRadius: "50%",
                                          display: "flex", alignItems: "center", justifyContent: "center",
                                          background: done ? "#16a34a" : "#e5e7eb",
                                          color: done ? "#fff" : "#9ca3af",
                                          border: current ? "3px solid #bbf7d0" : "none",
                                        }}
                                      >
                                        <Icon size={14} />
                                      </motion.div>
                                      <span style={{ fontSize: 9, fontWeight: 600, color: done ? "#166534" : "#9ca3af", textAlign: "center", maxWidth: 60 }}>{step.label}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Delivery Person */}
                          {order.deliveryPerson && isActive && (
                            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f0fdf4", borderRadius: 12, marginBottom: 16, border: "1px solid #dcfce7" }}>
                              <motion.div
                                animate={{ x: [0, 3, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                style={{ width: 40, height: 40, background: "#16a34a", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}
                              >
                                <Truck size={20} color="#fff" />
                              </motion.div>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 13, fontWeight: 700 }}>{order.deliveryPerson.name}</p>
                                <p style={{ fontSize: 11, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
                                  <Star size={10} color="#f59e0b" fill="#f59e0b" /> {order.deliveryPerson.rating} • Delivery Partner
                                </p>
                              </div>
                              <a href={`tel:${order.deliveryPerson.phone.replace(/\s/g, "")}`}
                                style={{ width: 38, height: 38, borderRadius: 10, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Phone size={16} color="#fff" />
                              </a>
                            </div>
                          )}

                          {/* Order Items */}
                          <div style={{ marginBottom: 14 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 8 }}>ORDER ITEMS</p>
                            {order.items.map((item, j) => (
                              <div key={j} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", color: "#374151" }}>
                                <span>{item.name} {item.qty > 1 && `x${item.qty}`}</span>
                                {item.price > 0 && <span style={{ fontWeight: 600 }}>₹{item.price * item.qty}</span>}
                              </div>
                            ))}
                            {order.total > 0 && (
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, paddingTop: 10, marginTop: 8, borderTop: "1px solid #e5e7eb", color: "#16a34a" }}>
                                <span>Total</span>
                                <span style={{ display: "flex", alignItems: "center" }}><IndianRupee size={13} strokeWidth={3} />{order.total}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div style={{ display: "flex", gap: 10 }}>
                            {order.status !== "delivered" && (
                              <Link href={`/track?id=${order.id}`} style={{
                                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                                background: "#3b82f6", color: "#fff",
                              }}>
                                <MapPin size={14} /> Track Order
                              </Link>
                            )}
                            {order.status === "delivered" && (
                              <Link href="/browse" style={{
                                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                                background: "#16a34a", color: "#fff",
                              }}>
                                <RefreshCw size={14} /> Reorder
                              </Link>
                            )}
                            <Link href={`https://wa.me/919092241237?text=Hi!%20Order%20%23${order.id}%20query`} target="_blank" style={{
                              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                              padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                              border: "1px solid #e5e7eb", color: "#374151",
                            }}>
                              Need Help?
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  if (!isLoggedIn) {
    router.push("/auth/signup?role=customer");
    return null;
  }

  return (
    <Suspense fallback={
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#6b7280" }}>Loading orders...</div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
