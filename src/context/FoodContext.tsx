"use client";

import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export interface FoodItem {
  id: string;
  cookerId: string;
  cookerName: string;
  kitchenName: string;
  location: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  servings: number;
  prepTime: string;
  postedAt: string;
  rating: number;
  orders: number;
}

interface FoodContextType {
  foods: FoodItem[];
  loading: boolean;
  addFood: (food: Omit<FoodItem, "id" | "postedAt" | "rating" | "orders">) => void;
  updateFood: (id: string, updates: Partial<FoodItem>) => void;
  deleteFood: (id: string) => void;
  getFoodsByCooker: (cookerId: string) => FoodItem[];
  getAvailableFoods: () => FoodItem[];
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

function toFoodItem(row: any): FoodItem {
  return {
    id: row.id,
    cookerId: row.cooker_id,
    cookerName: row.cooker_name,
    kitchenName: row.kitchen_name,
    location: row.location || "",
    name: row.name,
    description: row.description || "",
    price: Number(row.price),
    image: row.image || "",
    category: row.category,
    isVeg: row.is_veg,
    isAvailable: row.is_available,
    servings: row.servings,
    prepTime: row.prep_time || "30 min",
    postedAt: row.posted_at,
    rating: Number(row.rating) || 0,
    orders: row.orders || 0,
  };
}

export function FoodProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load foods from Supabase on mount
  useEffect(() => {
    const fetchFoods = async () => {
      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .order("posted_at", { ascending: false });

      if (data) setFoods(data.map(toFoodItem));
      if (error) console.error("Error loading foods:", error);
      setLoading(false);
    };
    fetchFoods();

    // Real-time subscription
    const channel = supabase.channel("foods-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "foods" }, () => {
        fetchFoods();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addFood = useCallback(async (food: Omit<FoodItem, "id" | "postedAt" | "rating" | "orders">) => {
    const { data, error } = await supabase
      .from("foods")
      .insert({
        cooker_id: food.cookerId,
        cooker_name: food.cookerName,
        kitchen_name: food.kitchenName,
        location: food.location,
        name: food.name,
        description: food.description,
        price: food.price,
        image: food.image,
        category: food.category,
        is_veg: food.isVeg,
        is_available: food.isAvailable,
        servings: food.servings,
        prep_time: food.prepTime,
      })
      .select()
      .single();

    if (data) setFoods((prev) => [toFoodItem(data), ...prev]);
    if (error) console.error("Error adding food:", error);
  }, []);

  const updateFood = useCallback(async (id: string, updates: Partial<FoodItem>) => {
    const dbUpdates: any = {};
    if (updates.isAvailable !== undefined) dbUpdates.is_available = updates.isAvailable;
    if (updates.servings !== undefined) dbUpdates.servings = updates.servings;
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.price) dbUpdates.price = updates.price;
    if (updates.description) dbUpdates.description = updates.description;

    const { error } = await supabase.from("foods").update(dbUpdates).eq("id", id);
    if (!error) {
      setFoods((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    }
    if (error) console.error("Error updating food:", error);
  }, []);

  const deleteFood = useCallback(async (id: string) => {
    const { error } = await supabase.from("foods").delete().eq("id", id);
    if (!error) {
      setFoods((prev) => prev.filter((f) => f.id !== id));
    }
    if (error) console.error("Error deleting food:", error);
  }, []);

  const getFoodsByCooker = useCallback((cookerId: string) => {
    return foods.filter((f) => f.cookerId === cookerId);
  }, [foods]);

  const getAvailableFoods = useCallback(() => {
    return foods.filter((f) => f.isAvailable && f.servings > 0);
  }, [foods]);

  const value = useMemo(() => ({ foods, loading, addFood, updateFood, deleteFood, getFoodsByCooker, getAvailableFoods }), [foods, loading, addFood, updateFood, deleteFood, getFoodsByCooker, getAvailableFoods]);

  return (
    <FoodContext.Provider value={value}>
      {children}
    </FoodContext.Provider>
  );
}

export function useFood() {
  const ctx = useContext(FoodContext);
  if (!ctx) throw new Error("useFood must be used within FoodProvider");
  return ctx;
}
