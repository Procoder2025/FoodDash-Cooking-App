"use client";

import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export interface Recipe {
  id: string;
  cookerId: string;
  cookerName: string;
  kitchenName: string;
  title: string;
  description: string;
  category: string;
  image: string;
  videoUrl: string;
  ingredients: string[];
  steps: string[];
  prepTime: string;
  cookTime: string;
  servings: string;
  isVeg: boolean;
  difficulty: "Easy" | "Medium" | "Hard";
  tips: string;
  postedAt: string;
  likes: number;
}

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, "id" | "postedAt" | "likes">) => void;
  deleteRecipe: (id: string) => void;
  getRecipesByCooker: (cookerId: string) => Recipe[];
  likeRecipe: (id: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

function toRecipe(row: any): Recipe {
  return {
    id: row.id,
    cookerId: row.cooker_id,
    cookerName: row.cooker_name,
    kitchenName: row.kitchen_name,
    title: row.title,
    description: row.description || "",
    category: row.category,
    image: row.image || "",
    videoUrl: row.video_url || "",
    ingredients: row.ingredients || [],
    steps: row.steps || [],
    prepTime: row.prep_time || "",
    cookTime: row.cook_time || "",
    servings: row.servings || "",
    isVeg: row.is_veg,
    difficulty: row.difficulty || "Easy",
    tips: row.tips || "",
    postedAt: row.posted_at,
    likes: row.likes || 0,
  };
}

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("posted_at", { ascending: false });

      if (data) setRecipes(data.map(toRecipe));
      if (error) console.error("Error loading recipes:", error);
    };
    fetchRecipes();

    const channel = supabase.channel("recipes-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "recipes" }, () => {
        fetchRecipes();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addRecipe = useCallback(async (recipe: Omit<Recipe, "id" | "postedAt" | "likes">) => {
    const { data, error } = await supabase
      .from("recipes")
      .insert({
        cooker_id: recipe.cookerId,
        cooker_name: recipe.cookerName,
        kitchen_name: recipe.kitchenName,
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        image: recipe.image,
        video_url: recipe.videoUrl,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        servings: recipe.servings,
        is_veg: recipe.isVeg,
        difficulty: recipe.difficulty,
        tips: recipe.tips,
      })
      .select()
      .single();

    if (data) setRecipes((prev) => [toRecipe(data), ...prev]);
    if (error) console.error("Error adding recipe:", error);
  }, []);

  const deleteRecipe = useCallback(async (id: string) => {
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (!error) setRecipes((prev) => prev.filter((r) => r.id !== id));
    if (error) console.error("Error deleting recipe:", error);
  }, []);

  const getRecipesByCooker = useCallback((cookerId: string) => {
    return recipes.filter((r) => r.cookerId === cookerId);
  }, [recipes]);

  const likeRecipe = useCallback(async (id: string) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r)));
    await supabase.rpc("increment_likes", { recipe_id: id }).then(({ error }) => {
      // Fallback: direct update if rpc doesn't exist
      if (error) {
        const recipe = recipes.find((r) => r.id === id);
        if (recipe) {
          supabase.from("recipes").update({ likes: recipe.likes + 1 }).eq("id", id);
        }
      }
    });
  }, [recipes]);

  const value = useMemo(() => ({ recipes, addRecipe, deleteRecipe, getRecipesByCooker, likeRecipe }), [recipes, addRecipe, deleteRecipe, getRecipesByCooker, likeRecipe]);

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipe() {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error("useRecipe must be used within RecipeProvider");
  return ctx;
}
