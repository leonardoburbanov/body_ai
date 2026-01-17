"use client";

import * as React from "react";
import { Calculator, Target, TrendingUp } from "lucide-react";
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

/**
 * Activity level options for TDEE calculation
 */
const ACTIVITY_LEVELS = [
  { value: 1.2, label: "Sedentario (poco o ningún ejercicio)" },
  { value: 1.375, label: "Ligero (ejercicio ligero 1-3 días/semana)" },
  { value: 1.55, label: "Moderado (ejercicio moderado 3-5 días/semana)" },
  { value: 1.725, label: "Activo (ejercicio duro 6-7 días/semana)" },
  { value: 1.9, label: "Muy activo (ejercicio muy duro, trabajo físico)" },
];

/**
 * Goal options for calorie adjustment
 */
const GOALS = [
  { value: "muscle", label: "Ganar masa muscular", adjustment: 300 },
  { value: "fat", label: "Reducir porcentaje de grasa", adjustment: -500 },
];

/**
 * Nutritional calculation results interface
 */
interface NutritionResults {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fats: number;
}

/**
 * Nutrition calculator component
 * Calculates BMR, TDEE, and macronutrient distribution
 */
export function NutritionCalculator({ userId }: { userId: string }) {
  const [formData, setFormData] = React.useState({
    age: "",
    gender: "male",
    weight: "",
    height: "",
    activityLevel: "1.55",
    goal: "maintain",
  });

  const [results, setResults] = React.useState<NutritionResults | null>(null);

  /**
   * Handles form input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Calculates BMR using Mifflin-St Jeor Equation
   */
  const calculateBMR = (
    weight: number,
    height: number,
    age: number,
    gender: string
  ): number => {
    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  /**
   * Calculates TDEE (Total Daily Energy Expenditure)
   */
  const calculateTDEE = (bmr: number, activityLevel: number): number => {
    return bmr * activityLevel;
  };

  /**
   * Calculates macronutrient distribution
   */
  const calculateMacros = (calories: number) => {
    // Protein: 30% of calories (4 calories per gram)
    const proteinCalories = calories * 0.3;
    const protein = Math.round(proteinCalories / 4);

    // Fats: 25% of calories (9 calories per gram)
    const fatCalories = calories * 0.25;
    const fats = Math.round(fatCalories / 9);

    // Carbs: 45% of calories (4 calories per gram)
    const carbCalories = calories * 0.45;
    const carbs = Math.round(carbCalories / 4);

    return { protein, carbs, fats };
  };

  /**
   * Handles form submission and calculation
   */
  const handleCalculate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const age = parseFloat(formData.age);
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const activityLevel = parseFloat(formData.activityLevel);

    if (
      isNaN(age) ||
      isNaN(weight) ||
      isNaN(height) ||
      age <= 0 ||
      weight <= 0 ||
      height <= 0
    ) {
      return;
    }

    const bmr = calculateBMR(weight, height, age, formData.gender);
    const tdee = calculateTDEE(bmr, activityLevel);
    const goalAdjustment =
      GOALS.find((g) => g.value === formData.goal)?.adjustment || 0;
    const dailyCalories = Math.round(tdee + goalAdjustment);

    const macros = calculateMacros(dailyCalories);

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyCalories,
      ...macros,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadora Nutricional
          </CardTitle>
          <CardDescription>
            Calcula tus necesidades calóricas diarias y distribución de
            macronutrientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="30"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="70"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="175"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Nivel de actividad</Label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Objetivo</Label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {GOALS.map((goal) => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full">
              Calcular
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Necesidades Calóricas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">BMR</span>
                  <span className="text-lg font-semibold">
                    {results.bmr} kcal
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasa metabólica basal (calorías en reposo)
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">TDEE</span>
                  <span className="text-lg font-semibold">
                    {results.tdee} kcal
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Gasto energético total diario
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Calorías diarias</span>
                  <span className="text-2xl font-bold text-primary">
                    {results.dailyCalories} kcal
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Basado en tu objetivo:{" "}
                  {GOALS.find((g) => g.value === formData.goal)?.label}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Macronutrientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Proteínas</span>
                  <span className="text-lg font-semibold">
                    {results.protein} g
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "30%" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">30% de calorías</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Carbohidratos
                  </span>
                  <span className="text-lg font-semibold">
                    {results.carbs} g
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "45%" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">45% de calorías</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Grasas</span>
                  <span className="text-lg font-semibold">
                    {results.fats} g
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "25%" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">25% de calorías</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
