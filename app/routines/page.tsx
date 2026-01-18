"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WorkoutRoutine } from "@/components/workout-routine";
import { RoutineList } from "@/components/routine-list";
import { RoutineViewer } from "@/components/routine-viewer";
import { TodayRoutine } from "@/components/today-routine";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

/**
 * Workout routine page
 * Displays the workout routine for today and manager
 */
export default function RoutinesPage() {
  const router = useRouter();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [view, setView] = React.useState<"today" | "list" | "create" | "view">("today");
  const [selectedRoutineId, setSelectedRoutineId] = React.useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = React.useState<any>(null);
  const [todayRoutine, setTodayRoutine] = React.useState<any>(null);

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
   * Fetches the first routine to show today's workout
   */
  React.useEffect(() => {
    if (!userId) return;

    const fetchTodayRoutine = async () => {
      try {
        const response = await fetch(`/api/routines?userId=${userId}`);
        const data = await response.json();

        if (response.ok && data.routines && data.routines.length > 0) {
          setTodayRoutine(data.routines[0]);
        }
      } catch (error) {
        console.error("Error fetching today's routine:", error);
      }
    };

    fetchTodayRoutine();
  }, [userId]);

  /**
   * Handles viewing a specific routine
   */
  const handleViewRoutine = async (routineId: string) => {
    try {
      const response = await fetch(`/api/routines/${routineId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch routine");
      }

      setSelectedRoutine(data.routine);
      setSelectedRoutineId(routineId);
      setView("view");
    } catch (error) {
      console.error("Error fetching routine:", error);
    }
  };

  /**
   * Handles routine deletion
   */
  const handleRoutineDeleted = () => {
    setView("today");
    setSelectedRoutine(null);
    setSelectedRoutineId(null);
    // Refresh today's routine
    if (userId) {
      fetch(`/api/routines?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.routines && data.routines.length > 0) {
            setTodayRoutine(data.routines[0]);
          } else {
            setTodayRoutine(null);
          }
        });
    }
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Rutinas</h1>
              <p className="text-muted-foreground">
                Gestiona tus rutinas de entrenamiento y consulta el entrenamiento del día
              </p>
            </div>
            <Link href="/routines/upload">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Subir desde JSON
              </Button>
            </Link>
          </div>
        </div>

        {view === "today" && (
          <div className="space-y-6">
            {todayRoutine ? (
              <TodayRoutine routine={todayRoutine} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No tienes rutinas guardadas aún
                </p>
                <button
                  onClick={() => setView("create")}
                  className="text-primary hover:underline"
                >
                  Crear tu primera rutina
                </button>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={() => setView("list")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Ver todas las rutinas →
              </button>
            </div>
          </div>
        )}

        {view === "list" && (
          <div className="space-y-6">
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => setView("today")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Ver rutina de hoy
              </button>
              <Link href="/routines/upload">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir desde JSON
                </Button>
              </Link>
            </div>
            <RoutineList
              userId={userId}
              onViewRoutine={handleViewRoutine}
              onCreateNew={() => setView("create")}
            />
          </div>
        )}

        {view === "create" && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setView("today")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Volver
              </button>
            </div>
            <WorkoutRoutine
              userId={userId}
              onSave={() => {
                setView("today");
                // Refresh today's routine
                if (userId) {
                  fetch(`/api/routines?userId=${userId}`)
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.routines && data.routines.length > 0) {
                        setTodayRoutine(data.routines[0]);
                      }
                    });
                }
              }}
              onCancel={() => setView("today")}
            />
          </div>
        )}

        {view === "view" && selectedRoutine && (
          <div>
            <div className="mb-4">
              <button
                onClick={() => setView("list")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Volver a la lista
              </button>
            </div>
            <RoutineViewer
              routine={selectedRoutine}
              onClose={() => setView("list")}
              onDelete={handleRoutineDeleted}
            />
          </div>
        )}
      </div>
    </div>
  );
}
