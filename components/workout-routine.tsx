"use client";

import * as React from "react";
import { Plus, Trash2, Save, Calendar, Target, Dumbbell } from "lucide-react";
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
 * Exercise interface
 */
interface Exercise {
  id: string;
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
  id?: string;
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
 * Workout routine component
 * Allows users to create and manage workout routines
 */
export function WorkoutRoutine({
  userId,
  onSave,
  onCancel,
}: {
  userId: string;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  const [routine, setRoutine] = React.useState<WorkoutRoutine>({
    name: "",
    nivel: "principiante",
    dias_por_semana: 3,
    objetivo: "",
    rutina: {},
    nutrition: {
      calories: "",
      protein: "",
      fats: "",
      carbs: "",
    },
    supplements: "",
    motivation: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  /**
   * Toggles a day in the routine
   */
  const toggleDay = (dayKey: string) => {
    setRoutine((prev) => {
      const day = prev.rutina[dayKey as keyof WeeklyRoutine];
      const newRutina = { ...prev.rutina };
      if (day) {
        delete newRutina[dayKey as keyof WeeklyRoutine];
      } else {
        newRutina[dayKey as keyof WeeklyRoutine] = {
          enfoque: "",
          ejercicios: [],
        };
      }
      return { ...prev, rutina: newRutina };
    });
  };

  /**
   * Updates a day's information
   */
  const updateDay = (
    dayKey: string,
    field: keyof DayRoutine,
    value: string
  ) => {
    setRoutine((prev) => {
      const day = prev.rutina[dayKey as keyof WeeklyRoutine];
      if (!day) return prev;
      const newRutina = { ...prev.rutina };
      newRutina[dayKey as keyof WeeklyRoutine] = {
        ...day,
        [field]: value,
      };
      return { ...prev, rutina: newRutina };
    });
  };

  /**
   * Adds an exercise to a day
   */
  const addExercise = (dayKey: string) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      nombre_es: "",
      nombre_en: "",
      series: 3,
      repeticiones: "",
    };
    setRoutine((prev) => {
      const day = prev.rutina[dayKey as keyof WeeklyRoutine];
      if (!day) return prev;
      const newRutina = { ...prev.rutina };
      newRutina[dayKey as keyof WeeklyRoutine] = {
        ...day,
        ejercicios: [...day.ejercicios, newExercise],
      };
      return { ...prev, rutina: newRutina };
    });
  };

  /**
   * Removes an exercise from a day
   */
  const removeExercise = (dayKey: string, exerciseId: string) => {
    setRoutine((prev) => {
      const day = prev.rutina[dayKey as keyof WeeklyRoutine];
      if (!day) return prev;
      const newRutina = { ...prev.rutina };
      newRutina[dayKey as keyof WeeklyRoutine] = {
        ...day,
        ejercicios: day.ejercicios.filter((e) => e.id !== exerciseId),
      };
      return { ...prev, rutina: newRutina };
    });
  };

  /**
   * Updates an exercise
   */
  const updateExercise = (
    dayKey: string,
    exerciseId: string,
    field: keyof Exercise,
    value: string | number
  ) => {
    setRoutine((prev) => {
      const day = prev.rutina[dayKey as keyof WeeklyRoutine];
      if (!day) return prev;
      const newRutina = { ...prev.rutina };
      newRutina[dayKey as keyof WeeklyRoutine] = {
        ...day,
        ejercicios: day.ejercicios.map((e) =>
          e.id === exerciseId ? { ...e, [field]: value } : e
        ),
      };
      return { ...prev, rutina: newRutina };
    });
  };

  /**
   * Handles routine save
   */
  const handleSave = async () => {
    if (
      !routine.name ||
      !routine.objetivo ||
      !routine.nivel ||
      !routine.dias_por_semana ||
      Object.keys(routine.rutina).length === 0
    ) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/routines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: routine.name,
          nivel: routine.nivel,
          dias_por_semana: routine.dias_por_semana,
          objetivo: routine.objetivo,
          rutina: routine.rutina,
          nutrition: routine.nutrition,
          supplements: routine.supplements,
          motivation: routine.motivation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save routine");
      }

      toast.success("Rutina guardada exitosamente");
      onSave?.();
    } catch (error) {
      toast.error("Error al guardar la rutina", {
        description:
          error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Nueva Rutina de Entrenamiento
          </CardTitle>
          <CardDescription>
            Crea y gestiona tu rutina de entrenamiento personalizada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Rutina</Label>
              <Input
                id="name"
                value={routine.name}
                onChange={(e) =>
                  setRoutine((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ej: Rutina de Recomposición Corporal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nivel">Nivel</Label>
              <select
                id="nivel"
                value={routine.nivel}
                onChange={(e) =>
                  setRoutine((prev) => ({ ...prev, nivel: e.target.value }))
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dias_por_semana">Días por Semana</Label>
              <Input
                id="dias_por_semana"
                type="number"
                min="1"
                max="7"
                value={routine.dias_por_semana}
                onChange={(e) =>
                  setRoutine((prev) => ({
                    ...prev,
                    dias_por_semana: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="Ej: 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo</Label>
              <Input
                id="objetivo"
                value={routine.objetivo}
                onChange={(e) =>
                  setRoutine((prev) => ({ ...prev, objetivo: e.target.value }))
                }
                placeholder="Ej: Recomposición corporal"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {DAYS.map((dayInfo) => {
        const dayKey = dayInfo.key;
        const day = routine.rutina[dayKey as keyof WeeklyRoutine];
        const isActive = !!day;

        return (
          <Card key={dayKey} className={isActive ? "" : "opacity-50"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <CardTitle>{dayInfo.label}</CardTitle>
                </div>
                <Button
                  variant={isActive ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => toggleDay(dayKey)}
                >
                  {isActive ? (
                    <>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Activar
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            {isActive && day && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Enfoque</Label>
                  <Input
                    value={day.enfoque}
                    onChange={(e) => updateDay(dayKey, "enfoque", e.target.value)}
                    placeholder="Ej: Espalda y Bíceps"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Ejercicios</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addExercise(dayKey)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Añadir Ejercicio
                    </Button>
                  </div>
                  {day.ejercicios.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="grid grid-cols-12 gap-2 items-center p-2 border rounded"
                    >
                      <Input
                        value={exercise.nombre_es}
                        onChange={(e) =>
                          updateExercise(dayKey, exercise.id, "nombre_es", e.target.value)
                        }
                        placeholder="Nombre (ES)"
                        className="col-span-4"
                      />
                      <Input
                        value={exercise.nombre_en}
                        onChange={(e) =>
                          updateExercise(dayKey, exercise.id, "nombre_en", e.target.value)
                        }
                        placeholder="Name (EN)"
                        className="col-span-3"
                      />
                      <Input
                        type="number"
                        value={exercise.series}
                        onChange={(e) =>
                          updateExercise(
                            dayKey,
                            exercise.id,
                            "series",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="Series"
                        className="col-span-1"
                      />
                      <Input
                        value={exercise.repeticiones || ""}
                        onChange={(e) =>
                          updateExercise(dayKey, exercise.id, "repeticiones", e.target.value)
                        }
                        placeholder="Reps"
                        className="col-span-2"
                      />
                      <Input
                        value={exercise.url || ""}
                        onChange={(e) =>
                          updateExercise(dayKey, exercise.id, "url", e.target.value)
                        }
                        placeholder="URL"
                        className="col-span-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercise(dayKey, exercise.id)}
                        className="col-span-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {day.ejercicios.length === 0 && (
                    <Button
                      variant="outline"
                      onClick={() => addExercise(dayKey)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir Primer Ejercicio
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Cardio (opcional)</Label>
                  <Input
                    value={day.cardio || ""}
                    onChange={(e) => updateDay(dayKey, "cardio", e.target.value)}
                    placeholder="Ej: Correr suave 20 minutos"
                  />
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Nutrición y Suplementos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Calorías</Label>
              <Input
                value={routine.nutrition?.calories || ""}
                onChange={(e) =>
                  setRoutine((prev) => ({
                    ...prev,
                    nutrition: {
                      ...prev.nutrition!,
                      calories: e.target.value,
                    },
                  }))
                }
                placeholder="2.200-2.300 kcal"
              />
            </div>
            <div className="space-y-2">
              <Label>Proteína</Label>
              <Input
                value={routine.nutrition?.protein || ""}
                onChange={(e) =>
                  setRoutine((prev) => ({
                    ...prev,
                    nutrition: {
                      ...prev.nutrition!,
                      protein: e.target.value,
                    },
                  }))
                }
                placeholder="160-170 g"
              />
            </div>
            <div className="space-y-2">
              <Label>Grasas</Label>
              <Input
                value={routine.nutrition?.fats || ""}
                onChange={(e) =>
                  setRoutine((prev) => ({
                    ...prev,
                    nutrition: {
                      ...prev.nutrition!,
                      fats: e.target.value,
                    },
                  }))
                }
                placeholder="60-70 g"
              />
            </div>
            <div className="space-y-2">
              <Label>Carbohidratos</Label>
              <Input
                value={routine.nutrition?.carbs || ""}
                onChange={(e) =>
                  setRoutine((prev) => ({
                    ...prev,
                    nutrition: {
                      ...prev.nutrition!,
                      carbs: e.target.value,
                    },
                  }))
                }
                placeholder="resto"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Suplementos</Label>
            <textarea
              value={routine.supplements || ""}
              onChange={(e) =>
                setRoutine((prev) => ({ ...prev, supplements: e.target.value }))
              }
              placeholder="Ej: Creatina 5 g diarios, Whey si no llegas a proteína..."
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Motivación y Expectativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Mensaje de Motivación</Label>
            <textarea
              value={routine.motivation || ""}
              onChange={(e) =>
                setRoutine((prev) => ({ ...prev, motivation: e.target.value }))
              }
              placeholder="Escribe un mensaje motivacional y las expectativas de esta rutina..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Guardando..." : "Guardar Rutina"}
        </Button>
      </div>
    </div>
  );
}
