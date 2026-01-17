"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RecipeList } from "@/components/recipe-list";
import { RecipeViewer } from "@/components/recipe-viewer";
import { TodayRecipe } from "@/components/today-recipe";

/**
 * Nutrition page
 * Displays recipes and today's meal plan
 */
export default function NutritionPage() {
  const router = useRouter();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [view, setView] = React.useState<"today" | "list" | "view">("today");
  const [selectedRecipeId, setSelectedRecipeId] = React.useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = React.useState<any>(null);
  const [todayRecipe, setTodayRecipe] = React.useState<any>(null);

  React.useEffect(() => {
    // Get user ID from localStorage (set during login)
    const storedUserId = localStorage.getItem("userId");
    const storedUser = localStorage.getItem("user");

    if (!storedUserId || !storedUser) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    setUserId(storedUserId);
    setIsLoading(false);
  }, [router]);

  /**
   * Fetches the first recipe to show today's meals
   */
  React.useEffect(() => {
    if (!userId) return;

    const fetchTodayRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes?userId=${userId}`);
        const data = await response.json();

        if (response.ok && data.recipes && data.recipes.length > 0) {
          setTodayRecipe(data.recipes[0]);
        }
      } catch (error) {
        console.error("Error fetching today's recipe:", error);
      }
    };

    fetchTodayRecipe();
  }, [userId]);

  /**
   * Handles viewing a specific recipe
   */
  const handleViewRecipe = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch recipe");
      }

      setSelectedRecipe(data.recipe);
      setSelectedRecipeId(recipeId);
      setView("view");
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  /**
   * Handles recipe deletion
   */
  const handleRecipeDeleted = () => {
    setView("today");
    setSelectedRecipe(null);
    setSelectedRecipeId(null);
    // Refresh today's recipe
    if (userId) {
      fetch(`/api/recipes?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.recipes && data.recipes.length > 0) {
            setTodayRecipe(data.recipes[0]);
          } else {
            setTodayRecipe(null);
          }
        });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Recetas</h1>
          <p className="text-muted-foreground">
            Gestiona tus planes nutricionales y consulta las comidas del día
          </p>
        </div>

        {view === "today" && (
          <div className="space-y-6">
            {todayRecipe ? (
              <TodayRecipe recipe={todayRecipe} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No tienes recetas guardadas aún
                </p>
                <button
                  onClick={() => router.push("/recipes/new")}
                  className="text-primary hover:underline"
                >
                  Crear tu primera receta
                </button>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => setView("list")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Ver todas las recetas →
              </button>
            </div>
          </div>
        )}

        {view === "list" && (
          <div className="space-y-6">
            <div className="mb-4">
              <button
                onClick={() => setView("today")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Ver receta de hoy
              </button>
            </div>
            <RecipeList
              userId={userId}
              onViewRecipe={handleViewRecipe}
              onCreateNew={() => router.push("/recipes/new")}
            />
          </div>
        )}

        {view === "view" && selectedRecipe && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setView("list")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Volver a la lista
              </button>
            </div>
            <RecipeViewer
              recipe={selectedRecipe}
              onClose={() => setView("list")}
              onDelete={handleRecipeDeleted}
            />
          </div>
        )}
      </div>
    </div>
  );
}
