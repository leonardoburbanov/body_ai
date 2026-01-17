"use client";

import * as React from "react";
import { Save, Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
 * Recipe creator component
 * Allows users to create meal plans
 */
export function RecipeCreator({
  userId,
  onSave,
  onCancel,
}: {
  userId: string;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    calorias_diarias_objetivo: "",
    proteina_diaria_objetivo: "",
    comidas_por_dia: "3",
    frutas_por_dia: "2",
    notes: "",
  });

  const [semana, setSemana] = React.useState<WeeklyPlan>({});

  /**
   * Adds or updates an ingredient in a meal
   */
  const addIngredient = (
    dayKey: string,
    mealKey: string,
    ingredient: string,
    quantity: string
  ) => {
    setSemana((prev) => {
      const currentDay = prev[dayKey as keyof WeeklyPlan] || {};
      const currentMeal = currentDay[mealKey as keyof DayMeals] || {};
      
      return {
        ...prev,
        [dayKey]: {
          ...currentDay,
          [mealKey]: {
            ...currentMeal,
            [ingredient]: quantity,
          },
        },
      };
    });
  };

  /**
   * Removes an ingredient from a meal
   */
  const removeIngredient = (dayKey: string, mealKey: string, ingredient: string) => {
    setSemana((prev) => {
      const day = prev[dayKey as keyof WeeklyPlan];
      if (!day) return prev;

      const meal = day[mealKey as keyof DayMeals];
      if (!meal) return prev;

      const { [ingredient]: _, ...rest } = meal;

      return {
        ...prev,
        [dayKey]: {
          ...day,
          [mealKey]: Object.keys(rest).length > 0 ? rest : undefined,
        },
      };
    });
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.calorias_diarias_objetivo || !formData.proteina_diaria_objetivo) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: formData.name,
          calorias_diarias_objetivo: formData.calorias_diarias_objetivo,
          proteina_diaria_objetivo: formData.proteina_diaria_objetivo,
          comidas_por_dia: parseInt(formData.comidas_por_dia),
          frutas_por_dia: parseInt(formData.frutas_por_dia),
          semana,
          notes: formData.notes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save recipe");
      }

      toast.success("Receta guardada exitosamente");
      onSave?.();
    } catch (error) {
      toast.error("Error al guardar la receta", {
        description:
          error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Receta *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Ej: Plan Nutricional Semanal"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calorias">Calorías Diarias Objetivo *</Label>
              <Input
                id="calorias"
                value={formData.calorias_diarias_objetivo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    calorias_diarias_objetivo: e.target.value,
                  }))
                }
                placeholder="Ej: 2200-2300 kcal"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proteina">Proteína Diaria Objetivo *</Label>
              <Input
                id="proteina"
                value={formData.proteina_diaria_objetivo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    proteina_diaria_objetivo: e.target.value,
                  }))
                }
                placeholder="Ej: 160-170 g"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="comidas">Comidas por Día</Label>
              <Input
                id="comidas"
                type="number"
                min="1"
                max="6"
                value={formData.comidas_por_dia}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    comidas_por_dia: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frutas">Frutas por Día</Label>
              <Input
                id="frutas"
                type="number"
                min="0"
                value={formData.frutas_por_dia}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    frutas_por_dia: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Notas adicionales sobre el plan..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Semanal</CardTitle>
          <CardDescription>
            Define las comidas para cada día de la semana
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {DAYS.map((day) => {
            const dayMeals = semana[day.key as keyof WeeklyPlan] || {};
            const mealKeys = Array.from(
              { length: parseInt(formData.comidas_por_dia) },
              (_, i) => `comida_${i + 1}`
            );

            return (
              <div key={day.key} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {day.label}
                </h3>
                <div className="space-y-4">
                  {mealKeys.map((mealKey) => {
                    const meal = dayMeals[mealKey as keyof DayMeals] || {};
                    const ingredients = Object.entries(meal);

                    return (
                      <div key={mealKey} className="border rounded p-3 bg-muted/30">
                        <Label className="mb-2 block capitalize">
                          {mealKey.replace("_", " ")}
                        </Label>
                        <div className="space-y-2">
                          {ingredients.map(([ingredient, quantity]) => (
                            <div
                              key={ingredient}
                              className="flex gap-2 items-center"
                            >
                              <Input
                                value={ingredient}
                                placeholder="Ingrediente"
                                onChange={(e) => {
                                  const newIngredient = e.target.value;
                                  const oldQuantity = quantity;
                                  removeIngredient(day.key, mealKey, ingredient);
                                  if (newIngredient) {
                                    addIngredient(
                                      day.key,
                                      mealKey,
                                      newIngredient,
                                      oldQuantity
                                    );
                                  }
                                }}
                                className="flex-1"
                              />
                              <Input
                                value={quantity}
                                placeholder="Cantidad"
                                onChange={(e) =>
                                  addIngredient(
                                    day.key,
                                    mealKey,
                                    ingredient,
                                    e.target.value
                                  )
                                }
                                className="w-40"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeIngredient(day.key, mealKey, ingredient)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newIngredient = `ingrediente_${ingredients.length + 1}`;
                              addIngredient(day.key, mealKey, newIngredient, "");
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Añadir Ingrediente
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Guardando..." : "Guardar Receta"}
        </Button>
      </div>
    </form>
  );
}
