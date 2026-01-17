/**
 * Meal interface
 * Represents a single meal with ingredients
 */
export interface Meal {
  [ingredient: string]: string; // ingredient name -> quantity
}

/**
 * Day meals interface
 * Represents all meals for a day
 */
export interface DayMeals {
  comida_1?: Meal;
  comida_2?: Meal;
  comida_3?: Meal;
  comida_4?: Meal;
  comida_5?: Meal;
  comida_6?: Meal;
}

/**
 * Weekly plan interface
 * Represents meals for all days of the week
 */
export interface WeeklyPlan {
  lunes?: DayMeals;
  martes?: DayMeals;
  miercoles?: DayMeals;
  jueves?: DayMeals;
  viernes?: DayMeals;
  sabado?: DayMeals;
  domingo?: DayMeals;
}

/**
 * Recipe/Meal plan domain entity
 * Represents a weekly meal plan with nutritional objectives
 */
export interface Recipe {
  id?: string;
  userId: string;
  name: string;
  calorias_diarias_objetivo: string;
  proteina_diaria_objetivo: string;
  comidas_por_dia: number;
  frutas_por_dia: number;
  semana: WeeklyPlan;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create recipe data transfer object
 */
export interface CreateRecipeDTO {
  userId: string;
  name: string;
  calorias_diarias_objetivo: string;
  proteina_diaria_objetivo: string;
  comidas_por_dia: number;
  frutas_por_dia: number;
  semana: WeeklyPlan;
  notes?: string;
}

/**
 * Update recipe data transfer object
 */
export interface UpdateRecipeDTO {
  name?: string;
  calorias_diarias_objetivo?: string;
  proteina_diaria_objetivo?: string;
  comidas_por_dia?: number;
  frutas_por_dia?: number;
  semana?: WeeklyPlan;
  notes?: string;
}
