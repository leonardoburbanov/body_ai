"use client";

import * as React from "react";
import { Eye, Plus, Calendar } from "lucide-react";
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
 * Routine list item interface
 */
interface RoutineListItem {
  id: string;
  name: string;
  nivel: string;
  dias_por_semana: number;
  objetivo: string;
  createdAt?: string;
}

/**
 * Routine list component
 * Displays a list of saved routines
 */
export function RoutineList({
  userId,
  onViewRoutine,
  onCreateNew,
}: {
  userId: string;
  onViewRoutine: (routineId: string) => void;
  onCreateNew: () => void;
}) {
  const [routines, setRoutines] = React.useState<RoutineListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  /**
   * Fetches routines from the API
   */
  const fetchRoutines = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/routines?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch routines");
      }

      setRoutines(data.routines || []);
    } catch (error) {
      toast.error("Error al cargar las rutinas", {
        description:
          error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Cargando rutinas...
      </div>
    );
  }

  if (routines.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">
            No tienes rutinas guardadas aún
          </p>
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Nueva Rutina
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Mis Rutinas</h2>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Rutina
        </Button>
      </div>

      <div className="grid gap-4">
        {routines.map((routine) => (
          <Card key={routine.id} className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{routine.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span>Nivel: {routine.nivel}</span>
                      <span>•</span>
                      <span>{routine.dias_por_semana} días/semana</span>
                    </div>
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewRoutine(routine.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {routine.objetivo}
              </p>
              {routine.createdAt && (
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Creada:{" "}
                  {new Date(routine.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
