"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WeeklyRoutine, DayRoutine } from "@/src/domain/entities/routine";

/**
 * Interface for the uploaded JSON structure
 */
interface UploadedRoutineJSON {
  perfil: {
    edad?: number;
    altura_cm?: number;
    peso_kg?: number;
    grasa_corporal_aprox?: string;
    nivel: string;
    objetivo: string | string[];
  };
  frecuencia: {
    dias_entrenamiento: number;
    cardio?: string;
    cardio_tipo?: string;
    cardio_duracion_min?: string;
  };
  rutina_semanal: {
    [key: string]: {
      enfoque: string;
      ejercicios: Array<{
        nombre_es: string;
        nombre_en: string;
        series: number;
        repeticiones?: string;
        tiempo?: string;
        url?: string;
      }>;
      cardio?: string;
    };
  };
  movilidad_diaria?: {
    duracion_min?: string;
    ejercicios?: string[];
  };
}

/**
 * Upload routine page
 * Allows users to upload a JSON file or paste JSON to create a routine
 */
export default function UploadRoutinePage() {
  const router = useRouter();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [jsonText, setJsonText] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  /**
   * Transforms the uploaded JSON to the system's routine format
   */
  const transformJSONToRoutine = (
    json: UploadedRoutineJSON
  ): {
    name: string;
    nivel: string;
    dias_por_semana: number;
    objetivo: string;
    rutina: WeeklyRoutine;
  } => {
    // Generate routine name from profile
    const objetivos = Array.isArray(json.perfil.objetivo)
      ? json.perfil.objetivo.join(", ")
      : json.perfil.objetivo;
    const name = `Rutina ${json.perfil.nivel} - ${objetivos.substring(0, 50)}`;

    // Transform weekly routine
    const rutina: WeeklyRoutine = {};
    const dayMapping: { [key: string]: keyof WeeklyRoutine } = {
      dia_1_lunes: "lunes",
      dia_2_martes: "martes",
      dia_3_miercoles: "miercoles",
      dia_4_jueves: "jueves",
      dia_5_viernes: "viernes",
      dia_6_sabado: "sabado",
      dia_7_domingo: "domingo",
      lunes: "lunes",
      martes: "martes",
      miercoles: "miercoles",
      jueves: "jueves",
      viernes: "viernes",
      sabado: "sabado",
      domingo: "domingo",
    };

    for (const [key, dayData] of Object.entries(json.rutina_semanal)) {
      // Try direct mapping first, then check if key contains day name
      let dayKey: keyof WeeklyRoutine | undefined = dayMapping[key.toLowerCase()];
      
      if (!dayKey) {
        // Try to extract day name from key (e.g., "dia_1_lunes" -> "lunes")
        const lowerKey = key.toLowerCase();
        for (const [mapKey, mapValue] of Object.entries(dayMapping)) {
          if (lowerKey.includes(mapKey) || mapKey.includes(lowerKey)) {
            dayKey = mapValue;
            break;
          }
        }
      }

      if (dayKey) {
        rutina[dayKey] = {
          enfoque: dayData.enfoque,
          ejercicios: dayData.ejercicios.map((ex) => ({
            nombre_es: ex.nombre_es,
            nombre_en: ex.nombre_en,
            series: ex.series,
            repeticiones: ex.repeticiones,
            tiempo: ex.tiempo,
            url: ex.url,
          })),
          cardio: dayData.cardio,
        } as DayRoutine;
      }
    }

    return {
      name,
      nivel: json.perfil.nivel,
      dias_por_semana: json.frecuencia.dias_entrenamiento,
      objetivo: objetivos,
      rutina,
    };
  };

  /**
   * Handles file upload
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      toast.error("Tipo de archivo inválido", {
        description: "Por favor selecciona un archivo JSON",
      });
      return;
    }

    try {
      const text = await file.text();
      setJsonText(text);
      toast.success("Archivo cargado exitosamente");
    } catch (error) {
      toast.error("Error al leer el archivo", {
        description:
          error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jsonText.trim()) {
      toast.error("Por favor ingresa o sube un JSON");
      return;
    }

    if (!userId) {
      toast.error("Usuario no autenticado");
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse JSON
      const uploadedData: UploadedRoutineJSON = JSON.parse(jsonText);

      // Validate required fields
      if (
        !uploadedData.perfil ||
        !uploadedData.frecuencia ||
        !uploadedData.rutina_semanal
      ) {
        throw new Error(
          "El JSON debe contener: perfil, frecuencia y rutina_semanal"
        );
      }

      // Transform to system format
      const routineData = transformJSONToRoutine(uploadedData);

      // Create routine via API
      const response = await fetch("/api/routines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...routineData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la rutina");
      }

      toast.success("Rutina creada exitosamente", {
        description: `Rutina "${routineData.name}" ha sido creada`,
      });

      // Redirect to routines page
      router.push("/routines");
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error("JSON inválido", {
          description: "Por favor verifica que el JSON esté bien formateado",
        });
      } else {
        toast.error("Error al crear la rutina", {
          description:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Subir Rutina desde JSON</h1>
          <p className="text-muted-foreground">
            Sube un archivo JSON o pega el contenido para crear una rutina de
            entrenamiento
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Formato JSON</CardTitle>
            <CardDescription>
              El JSON debe contener: perfil, frecuencia y rutina_semanal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file">Subir archivo JSON</Label>
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="json">O pega el JSON aquí</Label>
                <textarea
                  id="json"
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  className="w-full min-h-[400px] p-3 border rounded-md font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder='{"perfil": {...}, "frecuencia": {...}, "rutina_semanal": {...}}'
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creando..." : "Crear Rutina"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/routines")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
