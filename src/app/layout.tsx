import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { FoodProvider } from "@/context/FoodContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { RecipeProvider } from "@/context/RecipeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BottomTabBar from "@/components/BottomTabBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#16a34a",
};

export const metadata: Metadata = {
  title: "FoodDash - Home Cooked Food Marketplace",
  description: "Cook & sell homemade food or order fresh meals from home chefs near you.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FoodDash",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AuthProvider>
          <FoodProvider>
            <FavoritesProvider>
              <RecipeProvider>
                <CartProvider>
                  <Navbar />
                  <main style={{ flex: 1 }}>{children}</main>
                  <Footer />
                  <WhatsAppButton />
                  <BottomTabBar />
                </CartProvider>
              </RecipeProvider>
            </FavoritesProvider>
          </FoodProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
