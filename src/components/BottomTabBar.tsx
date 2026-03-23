"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Home, Search, BookOpen, ShoppingBasket, Heart, User } from "lucide-react";

export default function BottomTabBar() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse", label: "Browse", icon: Search },
    { href: "/recipes", label: "Recipes", icon: BookOpen },
    { href: "/grocery", label: "Grocery", icon: ShoppingBasket },
    ...(isLoggedIn
      ? [{ href: "/favorites", label: "Favorites", icon: Heart }]
      : [{ href: "/auth/login?role=customer", label: "Login", icon: User }]),
  ];

  return (
    <>
      <nav className="bottom-tab-bar">
        {tabs.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
              fontSize: 10, fontWeight: active ? 700 : 500, padding: "4px 8px",
              color: active ? "#16a34a" : "#6b7280",
              textDecoration: "none",
            }}>
              <item.icon size={18} strokeWidth={active ? 2.5 : 1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <style>{`
        .bottom-tab-bar {
          display: none;
        }
        .bottom-tab-bar::-webkit-scrollbar { display: none; }
        @media (max-width: 1024px) {
          .bottom-tab-bar {
            display: flex !important;
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 9999 !important;
            background: #fff !important;
            border-top: 1px solid #e5e7eb !important;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.08) !important;
            padding: 4px 0 env(safe-area-inset-bottom, 2px) !important;
            justify-content: space-around !important;
            align-items: center !important;
          }
        }
      `}</style>
    </>
  );
}
