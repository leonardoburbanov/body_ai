"use client";

import * as React from "react";
import { Calendar, Dumbbell, Target, TrendingUp, Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Exercise interface
 */
interface Exercise {
  nombre_es: string;
  nombre_en: string;
  series: number;
  repeticiones?: string;
  tiempo?: string;
  url?: string;
}

/**
 * Day routine interface
 */
interface DayRoutine {
  enfoque: string;
  ejercicios: Exercise[];
  cardio?: string;
  notes?: string;
}

/**
 * Weekly routine interface
 */
interface WeeklyRoutine {
  lunes?: DayRoutine;
  martes?: DayRoutine;
  miercoles?: DayRoutine;
  jueves?: DayRoutine;
  viernes?: DayRoutine;
  sabado?: DayRoutine;
  domingo?: DayRoutine;
}

/**
 * Workout routine interface
 */
interface WorkoutRoutine {
  id: string;
  name: string;
  nivel: string;
  dias_por_semana: number;
  objetivo: string;
  rutina: WeeklyRoutine;
  nutrition?: {
    calories: string;
    protein: string;
    fats: string;
    carbs: string;
  };
  supplements?: string;
  motivation?: string;
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
 * Finds today's routine day
 */
function findTodayRoutine(routine: WorkoutRoutine): DayRoutine | null {
  const currentDay = getCurrentDayBogota();
  return routine.rutina[currentDay as keyof WeeklyRoutine] || null;
}

/**
 * Today's routine component
 * Displays the routine for the current day
 */
export function TodayRoutine({ routine }: { routine: WorkoutRoutine }) {
  const currentDayLabel = getCurrentDayLabel();
  const todayRoutine = findTodayRoutine(routine);

  if (!todayRoutine) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No hay entrenamiento planificado para hoy ({currentDayLabel})
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calendar className="h-6 w-6 text-primary" />
                {currentDayLabel}
              </CardTitle>
              <CardDescription className="mt-2">
                {todayRoutine.enfoque}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Hoy
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Rutina: {routine.name}</p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>Nivel: {routine.nivel}</span>
              <span>{routine.dias_por_semana} días/semana</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      {todayRoutine.ejercicios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Ejercicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayRoutine.ejercicios.map((exercise, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-muted/50 border-l-4 border-l-primary"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold">{exercise.nombre_es}</p>
                      <p className="text-xs text-muted-foreground">
                        {exercise.nombre_en}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {exercise.series} ×{" "}
                      {exercise.repeticiones || exercise.tiempo}
                    </Badge>
                  </div>
                  {exercise.url && (
                    <a
                      href={exercise.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-2 inline-block"
                    >
                      Ver ejercicio →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cardio */}
      {todayRoutine.cardio && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Cardio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{todayRoutine.cardio}</p>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {todayRoutine.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{todayRoutine.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Nutrition Info */}
      {routine.nutrition && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Nutrición
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Calorías</p>
                <p className="font-semibold">{routine.nutrition.calories}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proteína</p>
                <p className="font-semibold">{routine.nutrition.protein}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grasas</p>
                <p className="font-semibold">{routine.nutrition.fats}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carbohidratos</p>
                <p className="font-semibold">{routine.nutrition.carbs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
