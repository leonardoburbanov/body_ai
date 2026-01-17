"use client";

import * as React from "react";
import { Calendar, Target, Utensils, X, Edit, Trash2, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

/**
 * Meal interface
 */
interface Meal {
  [ingredient: string]: string;
}

/**
 * Day meals interface
 */
interface DayMeals {
  comida_1?: Meal;
  comida_2?: Meal;
  comida_3?: Meal;
  comida_4?: Meal;
  comida_5?: Meal;
  comida_6?: Meal;
}

/**
 * Weekly plan interface
 */
interface WeeklyPlan {
  lunes?: DayMeals;
  martes?: DayMeals;
  miercoles?: DayMeals;
  jueves?: DayMeals;
  viernes?: DayMeals;
  sabado?: DayMeals;
  domingo?: DayMeals;
}

/**
 * Recipe interface
 */
interface Recipe {
  id: string;
  name: string;
  calorias_diarias_objetivo: string;
  proteina_diaria_objetivo: string;
  comidas_por_dia: number;
  frutas_por_dia: number;
  semana: WeeklyPlan;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

const DAYS = [
  { key: "lunes", label: "Lunes" },
  { key: "martes", label: "Martes" },
  { key: "miercoles", label: "Miércoles" },
  { key: "jueves", label: "Jueves" },
  { key: "viernes", label: "Viernes" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];

/**
 * Gets current day name in Spanish based on America/Bogota timezone
 */
function getCurrentDayBogota(): string {
  const now = new Date();
  const bogotaDate = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Bogota" })
  );
  const dayIndex = bogotaDate.getDay();

  const days = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];

  return days[dayIndex];
}

/**
 * Recipe viewer component
 * Displays a saved recipe/meal plan
 */
export function RecipeViewer({
  recipe,
  onClose,
  onEdit,
  onDelete,
}: {
  recipe: Recipe;
  onClose?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta receta?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete recipe");
      }

      toast.success("Receta eliminada exitosamente");
      onDelete?.();
    } catch (error) {
      toast.error("Error al eliminar la receta", {
        description:
          error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                <Utensils className="h-6 w-6" />
                {recipe.name}
              </CardTitle>
              <CardDescription className="text-base">
                Plan nutricional semanal
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              )}
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Calorías diarias</p>
              <p className="font-semibold">{recipe.calorias_diarias_objetivo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Proteína diaria</p>
              <p className="font-semibold">{recipe.proteina_diaria_objetivo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Comidas por día</p>
              <p className="font-semibold">{recipe.comidas_por_dia}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Frutas por día</p>
              <p className="font-semibold flex items-center gap-1">
                <Apple className="h-4 w-4" />
                {recipe.frutas_por_dia}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Plan */}
      <div className="space-y-4">
        {DAYS.map((day) => {
          const dayMeals = recipe.semana[day.key as keyof WeeklyPlan];
          if (!dayMeals) return null;

          const meals = Object.entries(dayMeals).filter(
            ([_, meal]) => meal && Object.keys(meal).length > 0
          );

          if (meals.length === 0) return null;

          const isToday = day.key === getCurrentDayBogota();

          return (
            <Card
              key={day.key}
              className={isToday ? "border-primary border-2 bg-primary/5" : ""}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {day.label}
                  </div>
                  {isToday && (
                    <Badge variant="default" className="ml-auto">
                      Hoy
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meals.map(([mealKey, meal]) => (
                    <div
                      key={mealKey}
                      className="p-4 border rounded-lg bg-muted/50"
                    >
                      <p className="font-semibold mb-2 capitalize">
                        {mealKey.replace("_", " ")}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(meal).map(([ingredient, quantity]) => (
                          <div
                            key={ingredient}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="capitalize">
                              {ingredient.replace(/_/g, " ")}
                            </span>
                            <span className="font-medium text-muted-foreground">
                              {String(quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notes */}
      {recipe.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{recipe.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
