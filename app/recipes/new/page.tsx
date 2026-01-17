"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RecipeCreator } from "@/components/recipe-creator";

/**
 * New recipe page
 * Displays the recipe creator
 */
export default function NewRecipePage() {
  const router = useRouter();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUser = localStorage.getItem("user");

    if (!storedUserId || !storedUser) {
      router.push("/login");
      return;
    }

    setUserId(storedUserId);
    setIsLoading(false);
  }, [router]);

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
          <h1 className="text-3xl font-bold mb-2">Nueva Receta</h1>
          <p className="text-muted-foreground">
            Crea un plan nutricional semanal personalizado
          </p>
        </div>
        <RecipeCreator
          userId={userId}
          onSave={() => router.push("/dashboard/nutrition")}
          onCancel={() => router.push("/dashboard/nutrition")}
        />
      </div>
    </div>
  );
}
