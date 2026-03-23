"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, LogOut, User, ChefHat, Home, UtensilsCrossed, Search, ClipboardList, Info, Phone, Package, TrendingUp, CalendarCheck, PartyPopper, Heart, Settings, BookOpen, ShoppingBasket, Bike, IndianRupee, Navigation } from "lucide-react";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileDrop, setProfileDrop] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [hasOrders, setHasOrders] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Check if user has any orders
  useEffect(() => {
    if (!isLoggedIn || !user) { setHasOrders(false); return; }
    const checkOrders = async () => {
      const { data } = await supabase?.from("orders").select("id").eq("customer_id", user.id).limit(1);
      setHasOrders(!!data && data.length > 0);
    };
    checkOrders();
  }, [isLoggedIn, user]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDrop(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const pathname = usePathname();

  const isCooker = isLoggedIn && user?.role === "cooker";
  const isDelivery = isLoggedIn && user?.role === "delivery";

  // Different nav links per role
  const navLinks = isDelivery
    ? [
        { href: "/dashboard/delivery", label: "My Deliveries", icon: Bike },
        { href: "/contact", label: "Support", icon: Phone },
      ]
    : isCooker
    ? [
        { href: "/dashboard/cooker", label: "My Kitchen", icon: ChefHat },
        { href: "/dashboard/cooker/recipes", label: "My Recipes", icon: BookOpen },
        { href: "/dashboard/cooker/orders", label: "Orders Received", icon: Package },
        { href: "/dashboard/cooker/earnings", label: "Earnings", icon: TrendingUp },
        { href: "/contact", label: "Support", icon: Phone },
      ]
    : [
        { href: "/", label: "Home", icon: Home },
        { href: "/browse", label: "Browse Food", icon: Search },
        ...(isLoggedIn && hasOrders ? [
          { href: "/orders", label: "My Orders", icon: ClipboardList, children: [
            { href: "/track", label: "Track Order", icon: Navigation },
          ] },
        ] : []),
        ...(isLoggedIn ? [
          { href: "/favorites", label: "Favorites", icon: Heart },
        ] : []),
        { href: "/recipes", label: "Recipes", icon: BookOpen, children: [
          { href: "/recipes", label: "Recipes", icon: BookOpen },
          { href: "/grocery", label: "Grocery", icon: ShoppingBasket },
        ] },
        { href: "/subscription", label: "Subscriptions", icon: CalendarCheck },
        { href: "/party-orders", label: "Party Orders", icon: PartyPopper },
        { href: "/about", label: "About", icon: Info },
        { href: "/contact", label: "Contact", icon: Phone },
      ];

  return (
    <header ref={navRef} style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(229,231,235,0.5)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ maxWidth: "100%", margin: "0", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, position: "relative" }}>
        {/* Logo */}
        <Link href={isCooker ? "/dashboard/cooker" : "/"} style={{ display: "flex", alignItems: "center", gap: 10, marginRight: "auto" }}>
          <div style={{ width: 42, height: 42, background: "linear-gradient(135deg, #16a34a, #15803d)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UtensilsCrossed size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111", lineHeight: 1.1 }}>Food<span style={{ color: "#16a34a" }}>Dash</span></div>
            <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500, marginTop: -2 }}>
              {isCooker ? "Chef Dashboard" : "Cook • Sell • Order"}
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", gap: 2, alignItems: "center", position: "absolute", left: "50%", transform: "translateX(-50%)", flexWrap: "nowrap" }} className="hidden-mobile">
          {navLinks.map((item: any) => {
            const active = pathname === item.href;
            if (item.children) {
              const isChildActive = item.children.some((c: any) => pathname === c.href);
              const dropId = item.label;
              return (
                <div key={item.href} style={{ position: "relative" }}>
                  <button onClick={() => setOpenDrop(openDrop === dropId ? null : dropId)} style={{
                    padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                    color: (active || isChildActive) ? "#16a34a" : "#4b5563",
                    background: (active || isChildActive) ? "#f0fdf4" : "transparent",
                    display: "flex", alignItems: "center", gap: 6,
                    whiteSpace: "nowrap", border: "none", cursor: "pointer",
                    transition: "all 0.2s",
                  }}>
                    <item.icon size={15} />
                    {item.label} <span style={{ fontSize: 9 }}>▾</span>
                  </button>
                  {openDrop === dropId && (
                    <div style={{
                      position: "absolute", top: "100%", left: 0, marginTop: 4,
                      background: "#fff", borderRadius: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                      border: "1px solid #e5e7eb", overflow: "hidden", minWidth: 160, zIndex: 50,
                    }}>
                      {item.children.map((child: any, ci: number) => (
                        <a key={child.href} href={child.href} style={{
                          display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                          fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", textDecoration: "none",
                          color: pathname === child.href ? "#16a34a" : "#374151",
                          background: pathname === child.href ? "#f0fdf4" : "transparent",
                          borderTop: ci > 0 ? "1px solid #f3f4f6" : "none",
                        }}>
                          <child.icon size={15} /> {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link key={item.href} href={item.href} style={{
                padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                color: active ? "#16a34a" : "#4b5563",
                background: active ? "#f0fdf4" : "transparent",
                display: "flex", alignItems: "center", gap: 6,
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}>
                <item.icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Cart — only for logged-in customers */}
          {isLoggedIn && !isCooker && !isDelivery && (
            <Link href="/cart" style={{
              position: "relative", display: "flex", alignItems: "center", gap: 6,
              background: "#16a34a", color: "#fff", padding: "9px 16px", borderRadius: 10,
              fontSize: 13, fontWeight: 700, boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
            }}>
              <ShoppingBag size={16} /> <span className="nav-cart-text">Cart</span>
              {totalItems > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{
                  position: "absolute", top: -6, right: -6, background: "#f97316", color: "#fff",
                  borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800, border: "2px solid #fff",
                }}>{totalItems}</motion.span>
              )}
            </Link>
          )}

          {isLoggedIn ? (
            <>
              {/* Profile */}
              <div style={{ position: "relative" }}>
                <button onClick={() => setProfileDrop(!profileDrop)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#f3f4f6", border: "none", borderRadius: 10,
                  padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600,
                }}>
                  <span style={{ fontSize: 20 }}>{user?.avatar}</span>
                  <span className="hidden-mobile">{user?.name?.split(" ")[0]}</span>
                </button>
                <AnimatePresence>
                  {profileDrop && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: "#fff", borderRadius: 14, boxShadow: "0 10px 40px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", minWidth: 220, overflow: "hidden", zIndex: 50 }}>
                      <div style={{ padding: "16px 18px", borderBottom: "1px solid #f3f4f6" }}>
                        <p style={{ fontSize: 14, fontWeight: 700 }}>{user?.name}</p>
                        <p style={{ fontSize: 12, color: "#6b7280" }}>{user?.email}</p>
                        {isCooker && user?.kitchenName && (
                          <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 600, marginTop: 2 }}>{user.kitchenName}</p>
                        )}
                        {isDelivery && user?.vehicleType && (
                          <p style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600, marginTop: 2 }}>{user.vehicleType} — {user.vehicleNumber}</p>
                        )}
                        <span style={{
                          display: "inline-block", marginTop: 6, fontSize: 10, fontWeight: 700,
                          background: isCooker ? "#f0fdf4" : isDelivery ? "#fffbeb" : "#eff6ff",
                          color: isCooker ? "#16a34a" : isDelivery ? "#d97706" : "#2563eb",
                          padding: "3px 10px", borderRadius: 50,
                          textTransform: "uppercase",
                        }}>{isCooker ? "🍳 Home Chef" : isDelivery ? "🚴 Delivery Partner" : "🛒 Customer"}</span>
                      </div>
                      <Link href="/profile" onClick={() => setProfileDrop(false)}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        <Settings size={16} /> My Profile
                      </Link>
                      <Link href={isCooker ? "/dashboard/cooker" : isDelivery ? "/dashboard/delivery" : "/dashboard/customer"} onClick={() => setProfileDrop(false)}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        <User size={16} /> My Dashboard
                      </Link>
                      {isCooker && (
                        <Link href="/dashboard/cooker/orders" onClick={() => setProfileDrop(false)}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                          <Package size={16} /> Orders Received
                        </Link>
                      )}
                      <button onClick={() => { logout(); setProfileDrop(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", fontSize: 13, fontWeight: 600, color: "#ef4444", width: "100%", background: "transparent", border: "none", cursor: "pointer", borderTop: "1px solid #f3f4f6" }}>
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: 8 }} className="hidden-mobile">
              {/* Login Dropdown */}
              <div style={{ position: "relative" }}>
                <button onClick={() => setOpenDrop(openDrop === "login" ? null : "login")} style={{
                  padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                  border: "2px solid #16a34a", color: "#16a34a", background: "transparent",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                }}>
                  Login <span style={{ fontSize: 10 }}>▾</span>
                </button>
                {openDrop === "login" && (
                  <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, background: "#fff", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", overflow: "hidden", minWidth: 190, zIndex: 50 }}>
                    {[
                      { role: "customer", label: "Customer", icon: ShoppingBag, color: "#3b82f6" },
                      { role: "cooker", label: "Home Chef", icon: ChefHat, color: "#16a34a" },
                      { role: "delivery", label: "Delivery Partner", icon: Bike, color: "#f59e0b" },
                    ].map((item, i) => (
                      <a key={item.role} href={`/auth/login?role=${item.role}`}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#374151", borderTop: i > 0 ? "1px solid #f3f4f6" : "none", whiteSpace: "nowrap", textDecoration: "none" }}>
                        <item.icon size={16} color={item.color} />
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Sign Up Dropdown */}
              <div style={{ position: "relative" }}>
                <button onClick={() => setOpenDrop(openDrop === "signup" ? null : "signup")} style={{
                  padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                  background: "#16a34a", color: "#fff", border: "none",
                  boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                }}>
                  Sign Up <span style={{ fontSize: 10 }}>▾</span>
                </button>
                {openDrop === "signup" && (
                  <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 6, background: "#fff", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", overflow: "hidden", minWidth: 190, zIndex: 50 }}>
                    {[
                      { role: "customer", label: "Customer", icon: ShoppingBag, color: "#3b82f6" },
                      { role: "cooker", label: "Home Chef", icon: ChefHat, color: "#16a34a" },
                      { role: "delivery", label: "Delivery Partner", icon: Bike, color: "#f59e0b" },
                    ].map((item, i) => (
                      <a key={item.role} href={`/auth/signup?role=${item.role}`}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#374151", borderTop: i > 0 ? "1px solid #f3f4f6" : "none", whiteSpace: "nowrap", textDecoration: "none" }}>
                        <item.icon size={16} color={item.color} />
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(!open)} className="show-mobile"
            style={{ display: "none", width: 42, height: 42, background: "#f3f4f6", border: "none", borderRadius: 10, cursor: "pointer", alignItems: "center", justifyContent: "center" }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Bottom tab bar moved to BottomTabBar component in layout */}
      <nav className="mobile-bottom-bar" style={{ display: "none" }}>
        {[
          { href: "/", label: "Home", icon: Home },
          { href: "/browse", label: "Browse", icon: Search },
          { href: "/recipes", label: "Recipes", icon: BookOpen },
          { href: "/grocery", label: "Grocery", icon: ShoppingBasket },
          ...(isLoggedIn ? [
            { href: "/favorites", label: "Favorites", icon: Heart },
          ] : [
            { href: "/auth/login?role=customer", label: "Login", icon: User },
          ]),
        ].map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              fontSize: 10, fontWeight: active ? 700 : 500, padding: "4px 8px",
              color: active ? "#16a34a" : "#6b7280",
              textDecoration: "none",
            }}>
              <item.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Dropdown (hamburger) — kept for login/signup role selection */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ background: "#fff", borderTop: "1px solid #e5e7eb", overflow: "hidden", position: "relative", zIndex: 999 }}>
            <div style={{ padding: "12px 16px 16px" }}>
              {/* All nav links */}
              {navLinks.flatMap((item: any) => item.children ? item.children : [item]).map((link: any) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
                  borderRadius: 10, fontSize: 14, fontWeight: 600, marginBottom: 2,
                  color: pathname === link.href ? "#16a34a" : "#374151",
                  background: pathname === link.href ? "#f0fdf4" : "transparent",
                }}>
                  <link.icon size={18} /> {link.label}
                </Link>
              ))}

              {/* Login/Signup for guests */}
              {!isLoggedIn && (
                <div style={{ marginTop: 12, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginBottom: 8, textTransform: "uppercase" }}>Login as</p>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    {[
                      { role: "customer", label: "Customer", icon: ShoppingBag, color: "#3b82f6" },
                      { role: "cooker", label: "Home Chef", icon: ChefHat, color: "#16a34a" },
                      { role: "delivery", label: "Delivery Partner", icon: Bike, color: "#f59e0b" },
                    ].map((item) => (
                      <Link key={item.role} href={`/auth/login?role=${item.role}`} onClick={() => setOpen(false)}
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 8px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12, fontWeight: 600, color: "#374151" }}>
                        <item.icon size={16} color={item.color} /> {item.label}
                      </Link>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginBottom: 8, textTransform: "uppercase" }}>Sign Up as</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { role: "customer", label: "Customer", icon: ShoppingBag, color: "#fff" },
                      { role: "cooker", label: "Home Chef", icon: ChefHat, color: "#fff" },
                      { role: "delivery", label: "Delivery Partner", icon: Bike, color: "#fff" },
                    ].map((item) => (
                      <Link key={item.role} href={`/auth/signup?role=${item.role}`} onClick={() => setOpen(false)}
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 8px", borderRadius: 10, background: "#16a34a", color: "#fff", fontSize: 12, fontWeight: 600 }}>
                        <item.icon size={16} color="#fff" /> {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1024px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .mobile-bottom-bar { display: none !important; }
          body { padding-bottom: 60px !important; }
        }
        @media (min-width: 1025px) {
          .show-mobile { display: none !important; }
          .mobile-bottom-bar { display: none !important; position: static !important; }
        }
        @media (max-width: 640px) {
          .nav-cart-text { display: none; }
          header { height: 52px !important; }
          header > div { height: 52px !important; padding: 0 12px !important; }
          .mobile-nav-bar { padding: 4px 8px !important; }
        }
      `}</style>
    </header>
  );
}
