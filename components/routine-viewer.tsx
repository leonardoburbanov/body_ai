"use client";

import * as React from "react";
import { Calendar, Target, TrendingUp, Dumbbell, X, Edit, Trash2 } from "lucide-react";
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
 * Routine viewer component
 * Displays a saved workout routine
 */
export function RoutineViewer({
  routine,
  onClose,
  onEdit,
  onDelete,
}: {
  routine: WorkoutRoutine;
  onClose?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta rutina?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/routines/${routine.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete routine");
      }

      toast.success("Rutina eliminada exitosamente");
      onDelete?.();
    } catch (error) {
      toast.error("Error al eliminar la rutina", {
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
              <CardTitle className="text-2xl mb-2">{routine.name}</CardTitle>
              <CardDescription className="text-base">
                {routine.dias_por_semana} días por semana • Nivel: {routine.nivel}
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
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-4 w-4" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nivel</p>
              <p className="font-semibold capitalize">{routine.nivel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Días por semana</p>
              <p className="font-semibold">{routine.dias_por_semana}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Objetivo</p>
              <p className="font-semibold text-sm">{routine.objetivo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Days */}
      <div className="space-y-4">
        {DAYS.map((day) => {
          const dayRoutine = routine.rutina[day.key as keyof WeeklyRoutine];
          if (!dayRoutine) return null;

          const isToday = day.key === getCurrentDayBogota();

          return (
            <Card
              key={day.key}
              className={isToday ? "border-primary border-2 bg-primary/5" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <CardTitle className="text-lg">{day.label}</CardTitle>
                  </div>
                  {isToday && <Badge variant="default">Hoy</Badge>}
                </div>
                <CardDescription>{dayRoutine.enfoque}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dayRoutine.ejercicios.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <Dumbbell className="h-4 w-4" />
                      Ejercicios
                    </p>
                    <div className="space-y-2">
                      {dayRoutine.ejercicios.map((exercise, exIndex) => (
                        <div
                          key={exIndex}
                          className="flex items-start gap-4 p-3 border rounded-lg bg-muted/50"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{exercise.nombre_es}</p>
                            <p className="text-xs text-muted-foreground">
                              {exercise.nombre_en}
                            </p>
                            {exercise.url && (
                              <a
                                href={exercise.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mt-1 inline-block"
                              >
                                Ver ejercicio →
                              </a>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {exercise.series} ×{" "}
                            {exercise.repeticiones || exercise.tiempo}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {dayRoutine.cardio && (
                  <div className="p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <p className="font-semibold text-sm mb-1">Cardio</p>
                    <p className="text-sm">{dayRoutine.cardio}</p>
                  </div>
                )}

                {dayRoutine.ejercicios.length === 0 && !dayRoutine.cardio && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Día de descanso
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Nutrition */}
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

      {/* Supplements */}
      {routine.supplements && (
        <Card>
          <CardHeader>
            <CardTitle>Suplementos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{routine.supplements}</p>
          </CardContent>
        </Card>
      )}

      {/* Motivation */}
      {routine.motivation && (
        <Card>
          <CardHeader>
            <CardTitle>Motivación</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-line">{routine.motivation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
