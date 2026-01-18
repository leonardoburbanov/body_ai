"use client";

import * as React from "react";
import { Calendar, Utensils, Target, Apple, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  carbohidratos_diarios_objetivo: string;
  grasa_diaria_objetivo: string;
  comidas_por_dia: number;
  frutas_por_dia: number;
  semana: WeeklyPlan;
  notes?: string;
}

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
 * Gets current day label in Spanish
 */
function getCurrentDayLabel(): string {
  const now = new Date();
  const bogotaDate = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Bogota" })
  );
  const dayIndex = bogotaDate.getDay();

  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return days[dayIndex];
}

/**
 * Today's recipe component
 * Displays the recipe for the current day
 */
export function TodayRecipe({ recipe }: { recipe: Recipe }) {
  const currentDayKey = getCurrentDayBogota();
  const currentDayLabel = getCurrentDayLabel();
  const dayMeals = recipe.semana[currentDayKey as keyof WeeklyPlan];

  if (!dayMeals) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No hay comidas planificadas para hoy ({currentDayLabel})
          </p>
        </CardContent>
      </Card>
    );
  }

  const meals = Object.entries(dayMeals).filter(
    ([_, meal]) => meal && Object.keys(meal).length > 0
  );

  if (meals.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No hay comidas planificadas para hoy ({currentDayLabel})
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with objectives */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calendar className="h-6 w-6 text-primary" />
                {currentDayLabel}
              </CardTitle>
              <CardDescription className="mt-2">
                Plan nutricional de hoy
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Hoy
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Target className="h-4 w-4" />
                Calorías
              </p>
              <p className="font-semibold text-lg">
                {recipe.calorias_diarias_objetivo}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Target className="h-4 w-4" />
                Proteína
              </p>
              <p className="font-semibold text-lg">
                {recipe.proteina_diaria_objetivo}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Target className="h-4 w-4" />
                Carbohidratos
              </p>
              <p className="font-semibold text-lg">
                {recipe.carbohidratos_diarios_objetivo}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Target className="h-4 w-4" />
                Grasa
              </p>
              <p className="font-semibold text-lg">
                {recipe.grasa_diaria_objetivo}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Utensils className="h-4 w-4" />
                Comidas
              </p>
              <p className="font-semibold text-lg">{recipe.comidas_por_dia}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Apple className="h-4 w-4" />
                Frutas
              </p>
              <p className="font-semibold text-lg">{recipe.frutas_por_dia}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's meals */}
      <div className="space-y-4">
        {meals.map(([mealKey, meal]) => (
          <Card key={mealKey} className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 capitalize">
                <Clock className="h-5 w-5" />
                {mealKey.replace("_", " ")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(meal).map(([ingredient, quantity]) => (
                  <div
                    key={ingredient}
                    className="flex justify-between items-center p-3 border rounded-lg bg-muted/50"
                  >
                    <span className="font-medium capitalize">
                      {ingredient.replace(/_/g, " ")}
                    </span>
                    <span className="text-sm text-muted-foreground font-semibold">
                      {String(quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
