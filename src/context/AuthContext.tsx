"use client";

import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type UserRole = "customer" | "cooker" | "delivery";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  address?: string;
  kitchenName?: string;
  speciality?: string;
  bio?: string;
  vehicleType?: string;
  vehicleNumber?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean | "wrong-role">;
  signup: (data: SignupData) => Promise<string | true>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, "name" | "phone" | "address" | "avatar" | "kitchenName" | "speciality" | "bio" | "vehicleType" | "vehicleNumber">>) => void;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  kitchenName?: string;
  speciality?: string;
  address?: string;
  vehicleType?: string;
  vehicleNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert Supabase row (snake_case) to app User (camelCase)
function toUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    avatar: row.avatar || "👤",
    address: row.address,
    kitchenName: row.kitchen_name,
    speciality: row.speciality,
    bio: row.bio,
    vehicleType: row.vehicle_type,
    vehicleNumber: row.vehicle_number,
  };
}

function getSession(): User | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("fd_session_v4");
  return saved ? JSON.parse(saved) : null;
}

function saveSession(user: User | null) {
  if (user) {
    localStorage.setItem("fd_session_v4", JSON.stringify(user));
  } else {
    localStorage.removeItem("fd_session_v4");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = getSession();
    if (saved) {
      supabase.from("users").select("*").eq("id", saved.id).single().then(({ data }) => {
        if (data) {
          const u = toUser(data);
          setUser(u);
          saveSession(u);
        } else {
          saveSession(null);
        }
        setReady(true);
      });
    } else {
      setReady(true);
    }
  }, []);

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean | "wrong-role"> => {
    // Find user by email and password
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !data) {
      // Check if email exists but wrong password
      const { data: emailCheck } = await supabase
        .from("users")
        .select("role")
        .eq("email", email)
        .single();
      if (emailCheck) return false; // wrong password
      return false; // email not found
    }

    if (data.role !== role) return "wrong-role";

    const u = toUser(data);
    setUser(u);
    saveSession(u);
    return true;
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<string | true> => {
    // Check if email already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", data.email)
      .single();

    if (existing) return "This email is already registered. Please login instead.";

    // 1. Insert into main users table
    const { data: newRow, error } = await supabase
      .from("users")
      .insert({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        role: data.role,
        avatar: data.role === "cooker" ? "👩‍🍳" : data.role === "delivery" ? "🚴" : "👤",
        kitchen_name: data.kitchenName || null,
        speciality: data.speciality || null,
        address: data.address || null,
        vehicle_type: data.vehicleType || null,
        vehicle_number: data.vehicleNumber || null,
      })
      .select()
      .single();

    if (error || !newRow) {
      console.error("Signup error:", error);
      return error?.message || "Signup failed. Please try again.";
    }

    // 2. Insert into role-specific table
    if (data.role === "customer") {
      await supabase.from("customers").insert({
        user_id: newRow.id,
        delivery_address: data.address || null,
        total_orders: 0,
        total_spent: 0,
        preferred_payment: "COD",
      });
    } else if (data.role === "cooker") {
      await supabase.from("cookers").insert({
        user_id: newRow.id,
        kitchen_name: data.kitchenName || "",
        speciality: data.speciality || null,
        bio: null,
        location: data.address || null,
        rating: 0,
        total_orders: 0,
        total_earnings: 0,
        is_open: true,
        delivery_fee: 30,
        delivery_time: "30-45 min",
      });
    } else if (data.role === "delivery") {
      await supabase.from("delivery_partners").insert({
        user_id: newRow.id,
        vehicle_type: data.vehicleType || "Bike",
        vehicle_number: data.vehicleNumber || "",
        is_online: false,
        total_deliveries: 0,
        total_earnings: 0,
        rating: 4.5,
      });
    }

    // 3. Auto-login
    const u = toUser(newRow);
    setUser(u);
    saveSession(u);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveSession(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Pick<User, "name" | "phone" | "address" | "avatar" | "kitchenName" | "speciality" | "bio" | "vehicleType" | "vehicleNumber">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      saveSession(updated);

      // Update main users table
      supabase.from("users").update({
        name: updated.name,
        phone: updated.phone,
        address: updated.address,
        avatar: updated.avatar,
        kitchen_name: updated.kitchenName,
        speciality: updated.speciality,
        bio: updated.bio,
        vehicle_type: updated.vehicleType,
        vehicle_number: updated.vehicleNumber,
      }).eq("id", prev.id).then(({ error }) => {
        if (error) console.error("Profile update error:", error);
      });

      // Update role-specific table
      if (prev.role === "cooker" && (updates.kitchenName || updates.speciality || updates.bio)) {
        supabase.from("cookers").update({
          kitchen_name: updated.kitchenName,
          speciality: updated.speciality,
          bio: updated.bio,
          location: updated.address,
        }).eq("user_id", prev.id);
      }
      if (prev.role === "delivery" && (updates.vehicleType || updates.vehicleNumber)) {
        supabase.from("delivery_partners").update({
          vehicle_type: updated.vehicleType,
          vehicle_number: updated.vehicleNumber,
        }).eq("user_id", prev.id);
      }
      if (prev.role === "customer" && updates.address) {
        supabase.from("customers").update({
          delivery_address: updated.address,
        }).eq("user_id", prev.id);
      }

      return updated;
    });
  }, []);

  const value = useMemo(() => ({ user, isLoggedIn: !!user, login, signup, logout, updateProfile }), [user, login, signup, logout, updateProfile]);

  if (!ready) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
