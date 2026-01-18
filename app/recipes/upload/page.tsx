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

/**
 * Interface for the uploaded JSON structure
 */
interface UploadedRecipeJSON {
  name: string;
  calorias_diarias_objetivo: string;
  proteina_diaria_objetivo: string;
  carbohidratos_diarios_objetivo: string;
  grasa_diaria_objetivo: string;
  comidas_por_dia: number;
  frutas_por_dia: number;
  semana: {
    lunes?: {
      comida_1?: { [ingredient: string]: string };
      comida_2?: { [ingredient: string]: string };
      comida_3?: { [ingredient: string]: string };
      comida_4?: { [ingredient: string]: string };
      comida_5?: { [ingredient: string]: string };
      comida_6?: { [ingredient: string]: string };
    };
    martes?: {
      comida_1?: { [ingredient: string]: string };
      comida_2?: { [ingredient: string]: string };
      comida_3?: { [ingredient: string]: string };
      comida_4?: { [ingredient: string]: string };
      comida_5?: { [ingredient: string]: string };
      comida_6?: { [ingredient: string]: string };
    };
    miercoles?: {
      comida_1?: { [ingredient: string]: string };
      comida_2?: { [ingredient: string]: string };
      comida_3?: { [ingredient: string]: string };
      comida_4?: { [ingredient: string]: string };
      comida_5?: { [ingredient: string]: string };
      comida_6?: { [ingredient: string]: string };
    };
    jueves?: {
      comida_1?: { [ingredient: string]: string };
      comida_2?: { [ingredient: string]: string };
      comida_3?: { [ingredient: string]: string };
      comida_4?: { [ingredient: string]: string };
      comida_5?: { [ingredient: string]: string };
      comida_6?: { [ingredient: string]: string };
    };
    viernes?: {
      comida_1?: { [ingredient: string]: string };
      comida_2?: { [ingredient: string]: string };
      comida_3?: { [ingredient: string]: string };
      comida_4?: { [ingredient: string]: string };
      comida_5?: { [ingredient: string]: string };
      comida_6?: { [ingredient: string]: string };
    };
    sabado?: {
      comida_1?: { [ingredient: string]: string };
      comida_2?: { [ingredient: string]: string };
      comida_3?: { [ingredient: string]: string };
      comida_4?: { [ingredient: string]: string };
      comida_5?: { [ingredient: string]: string };
      comida_6?: { [ingredient: string]: string };
    };
    domingo?: {
      comida_1?: { [ingredient: string]: string };
      comida_2?: { [ingredient: string]: string };
      comida_3?: { [ingredient: string]: string };
      comida_4?: { [ingredient: string]: string };
      comida_5?: { [ingredient: string]: string };
      comida_6?: { [ingredient: string]: string };
    };
  };
  notes?: string;
}

/**
 * Example template JSON
 */
const exampleTemplate = {
  name: "Plan Nutricional Semanal - Transformación",
  calorias_diarias_objetivo: "2200-2300 kcal",
  proteina_diaria_objetivo: "160-170 g",
  carbohidratos_diarios_objetivo: "230-280 g",
  grasa_diaria_objetivo: "65-75 g",
  comidas_por_dia: 3,
  frutas_por_dia: 2,
  semana: {
    lunes: {
      comida_1: {
        huevos: "4 unidades",
        avena: "80 g",
        banana: "1 unidad",
      },
      comida_2: {
        pollo_pechuga: "250 g",
        arroz_blanco: "200 g",
        brocoli: "cantidad libre",
        aceite_oliva: "15 g",
      },
      comida_3: {
        tilapia: "250 g",
        camote: "200 g",
        ensalada_verde: "cantidad libre",
        manzana: "1 unidad",
        aceite_oliva: "15 g",
      },
    },
    martes: {
      comida_1: {
        huevos: "4 unidades",
        avena: "70 g",
        manzana: "1 unidad",
      },
      comida_2: {
        lomo_cerdo: "250 g",
        papa: "300 g",
        zanahoria: "cantidad libre",
        aceite_oliva: "15 g",
      },
      comida_3: {
        pollo_pechuga: "230 g",
        arroz_blanco: "180 g",
        espinaca: "cantidad libre",
        papaya: "150 g",
        aceite_oliva: "15 g",
      },
    },
    miercoles: {
      comida_1: {
        huevos: "3 unidades",
        claras: "3 unidades",
        avena: "80 g",
        banana: "1 unidad",
      },
      comida_2: {
        pollo_pechuga: "250 g",
        arroz_blanco: "200 g",
        brocoli: "cantidad libre",
        aceite_oliva: "15 g",
      },
      comida_3: {
        tilapia: "250 g",
        camote: "200 g",
        ensalada: "cantidad libre",
        manzana: "1 unidad",
        aceite_oliva: "15 g",
      },
    },
    jueves: {
      comida_1: {
        huevos: "4 unidades",
        avena: "70 g",
        fresas: "150 g",
      },
      comida_2: {
        lomo_cerdo: "250 g",
        arroz_blanco: "200 g",
        calabacin: "cantidad libre",
        aceite_oliva: "15 g",
      },
      comida_3: {
        pollo_pechuga: "230 g",
        papa: "300 g",
        espinaca: "cantidad libre",
        naranja: "1 unidad",
        aceite_oliva: "15 g",
      },
    },
    viernes: {
      comida_1: {
        huevos: "3 unidades",
        claras: "3 unidades",
        avena: "80 g",
        banana: "1 unidad",
      },
      comida_2: {
        pollo_pechuga: "250 g",
        arroz_blanco: "200 g",
        brocoli: "cantidad libre",
        aceite_oliva: "15 g",
      },
      comida_3: {
        tilapia: "250 g",
        camote: "200 g",
        ensalada: "cantidad libre",
        manzana: "1 unidad",
        aceite_oliva: "15 g",
      },
    },
    sabado: {
      comida_1: {
        huevos: "4 unidades",
        avena: "70 g",
        papaya: "150 g",
      },
      comida_2: {
        lomo_cerdo: "250 g",
        arroz_blanco: "200 g",
        verduras_mixtas: "cantidad libre",
        aceite_oliva: "15 g",
      },
      comida_3: {
        pollo_pechuga: "230 g",
        papa: "300 g",
        ensalada: "cantidad libre",
        banana: "1 unidad",
        aceite_oliva: "15 g",
      },
    },
    domingo: {
      comida_1: {
        huevos: "3 unidades",
        claras: "3 unidades",
        avena: "70 g",
        manzana: "1 unidad",
      },
      comida_2: {
        tilapia: "270 g",
        arroz_blanco: "200 g",
        verduras: "cantidad libre",
        aceite_oliva: "15 g",
      },
      comida_3: {
        pollo_pechuga: "230 g",
        camote: "200 g",
        ensalada: "cantidad libre",
        banana: "1 unidad",
        aceite_oliva: "15 g",
      },
    },
  },
  notes: "Plan nutricional diseñado para transformación física. Ajustar cantidades según necesidades individuales.",
};

/**
 * Upload recipe page
 * Allows users to upload a JSON file or paste JSON to create a recipe
 */
export default function UploadRecipePage() {
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
   * Loads the example template
   */
  const loadTemplate = () => {
    setJsonText(JSON.stringify(exampleTemplate, null, 2));
    toast.success("Template cargado");
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
      const uploadedData: UploadedRecipeJSON = JSON.parse(jsonText);

      // Validate required fields
      if (
        !uploadedData.name ||
        !uploadedData.calorias_diarias_objetivo ||
        !uploadedData.proteina_diaria_objetivo ||
        !uploadedData.carbohidratos_diarios_objetivo ||
        !uploadedData.grasa_diaria_objetivo ||
        !uploadedData.comidas_por_dia ||
        !uploadedData.frutas_por_dia ||
        !uploadedData.semana
      ) {
        throw new Error(
          "El JSON debe contener: name, calorias_diarias_objetivo, proteina_diaria_objetivo, carbohidratos_diarios_objetivo, grasa_diaria_objetivo, comidas_por_dia, frutas_por_dia, y semana"
        );
      }

      // Create recipe via API
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: uploadedData.name,
          calorias_diarias_objetivo: uploadedData.calorias_diarias_objetivo,
          proteina_diaria_objetivo: uploadedData.proteina_diaria_objetivo,
          carbohidratos_diarios_objetivo: uploadedData.carbohidratos_diarios_objetivo,
          grasa_diaria_objetivo: uploadedData.grasa_diaria_objetivo,
          comidas_por_dia: uploadedData.comidas_por_dia,
          frutas_por_dia: uploadedData.frutas_por_dia,
          semana: uploadedData.semana,
          notes: uploadedData.notes?.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la receta");
      }

      toast.success("Receta creada exitosamente", {
        description: `Receta "${uploadedData.name}" ha sido creada`,
      });

      // Redirect to nutrition page
      router.push("/dashboard/nutrition");
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error("JSON inválido", {
          description: "Por favor verifica que el JSON esté bien formateado",
        });
      } else {
        toast.error("Error al crear la receta", {
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
          <h1 className="text-3xl font-bold mb-2">Subir Receta desde JSON</h1>
          <p className="text-muted-foreground">
            Sube un archivo JSON o pega el contenido para crear un plan
            nutricional semanal
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Formato JSON</CardTitle>
            <CardDescription>
              El JSON debe contener: name, calorias_diarias_objetivo,
              proteina_diaria_objetivo, carbohidratos_diarios_objetivo,
              grasa_diaria_objetivo, comidas_por_dia, frutas_por_dia, y semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
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
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={loadTemplate}
                  >
                    Cargar Template
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="json">O pega el JSON aquí</Label>
                <textarea
                  id="json"
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  className="w-full min-h-[400px] p-3 border rounded-md font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder='{"name": "...", "calorias_diarias_objetivo": "...", ...}'
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creando..." : "Crear Receta"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/nutrition")}
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
