"use client";

import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (foodId: string) => void;
  isFavorite: (foodId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = "fooddash_favorites_v1";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load from localStorage as fallback
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const save = (updated: string[]) => {
    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  const toggleFavorite = useCallback((foodId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((foodId: string) => {
    return favorites.includes(foodId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    save([]);
  }, []);

  const value = useMemo(() => ({ favorites, toggleFavorite, isFavorite, clearFavorites }), [favorites, toggleFavorite, isFavorite, clearFavorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
