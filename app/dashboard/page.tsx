"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TodayRecipe } from "@/components/today-recipe";
import { TodayRoutine } from "@/components/today-routine";

/**
 * Dashboard page
 * Displays today's recipe and today's routine
 */
export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [todayRecipe, setTodayRecipe] = React.useState<any>(null);
  const [todayRoutine, setTodayRoutine] = React.useState<any>(null);
  const [recipeLoading, setRecipeLoading] = React.useState(true);
  const [routineLoading, setRoutineLoading] = React.useState(true);

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
        setRecipeLoading(true);
        const response = await fetch(`/api/recipes?userId=${userId}`);
        const data = await response.json();

        if (response.ok && data.recipes && data.recipes.length > 0) {
          setTodayRecipe(data.recipes[0]);
        }
      } catch (error) {
        console.error("Error fetching today's recipe:", error);
      } finally {
        setRecipeLoading(false);
      }
    };

    fetchTodayRecipe();
  }, [userId]);

  /**
   * Fetches the first routine to show today's workout
   */
  React.useEffect(() => {
    if (!userId) return;

    const fetchTodayRoutine = async () => {
      try {
        setRoutineLoading(true);
        const response = await fetch(`/api/routines?userId=${userId}`);
        const data = await response.json();

        if (response.ok && data.routines && data.routines.length > 0) {
          setTodayRoutine(data.routines[0]);
        }
      } catch (error) {
        console.error("Error fetching today's routine:", error);
      } finally {
        setRoutineLoading(false);
      }
    };

    fetchTodayRoutine();
  }, [userId]);

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
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Your daily nutrition plan and workout routine
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Recipe */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Today's Recipe</h2>
            {recipeLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading recipe...
              </div>
            ) : todayRecipe ? (
              <TodayRecipe recipe={todayRecipe} />
            ) : (
              <div className="text-center py-12 text-muted-foreground border rounded-lg">
                No recipe available for today
              </div>
            )}
          </div>

          {/* Today's Routine */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Today's Routine</h2>
            {routineLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading routine...
              </div>
            ) : todayRoutine ? (
              <TodayRoutine routine={todayRoutine} />
            ) : (
              <div className="text-center py-12 text-muted-foreground border rounded-lg">
                No routine available for today
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
