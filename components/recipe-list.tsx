"use client";

import * as React from "react";
import { Eye, Plus, Calendar, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

/**
 * Recipe list item interface
 */
interface RecipeListItem {
  id: string;
  name: string;
  calorias_diarias_objetivo: string;
  proteina_diaria_objetivo: string;
  comidas_por_dia: number;
  frutas_por_dia: number;
  createdAt?: string;
}

/**
 * Recipe list component
 * Displays a list of saved recipes
 */
export function RecipeList({
  userId,
  onViewRecipe,
  onCreateNew,
}: {
  userId: string;
  onViewRecipe: (recipeId: string) => void;
  onCreateNew: () => void;
}) {
  const [recipes, setRecipes] = React.useState<RecipeListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  /**
   * Fetches recipes from the API
   */
  const fetchRecipes = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/recipes?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch recipes");
      }

      setRecipes(data.recipes || []);
    } catch (error) {
      toast.error("Error al cargar las recetas", {
        description:
          error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Cargando recetas...
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">
            No tienes recetas guardadas aún
          </p>
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Nueva Receta
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Mis Recetas</h2>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Receta
        </Button>
      </div>

      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    {recipe.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span>Calorías: {recipe.calorias_diarias_objetivo}</span>
                      <span>Proteína: {recipe.proteina_diaria_objetivo}</span>
                      <span>{recipe.comidas_por_dia} comidas/día</span>
                      <span>{recipe.frutas_por_dia} frutas/día</span>
                    </div>
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewRecipe(recipe.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver
                </Button>
              </div>
            </CardHeader>
            {recipe.createdAt && (
              <CardContent>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Creada:{" "}
                  {new Date(recipe.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
