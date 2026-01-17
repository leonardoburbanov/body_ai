/**
 * Exercise interface
 * Represents a single exercise in a routine
 */
export interface Exercise {
  nombre_es: string;
  nombre_en: string;
  series: number;
  repeticiones?: string;
  tiempo?: string;
  url?: string;
}

/**
 * Day routine interface
 * Represents a single day's workout
 */
export interface DayRoutine {
  enfoque: string;
  ejercicios: Exercise[];
  cardio?: string;
}

/**
 * Weekly routine interface
 * Represents all days of the week
 */
export interface WeeklyRoutine {
  lunes?: DayRoutine;
  martes?: DayRoutine;
  miercoles?: DayRoutine;
  jueves?: DayRoutine;
  viernes?: DayRoutine;
  sabado?: DayRoutine;
  domingo?: DayRoutine;
}

/**
 * Workout routine domain entity
 * Represents a workout routine in the system
 */
export interface Routine {
  id?: string;
  userId: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create routine data transfer object
 */
export interface CreateRoutineDTO {
  userId: string;
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
 * Update routine data transfer object
 */
export interface UpdateRoutineDTO {
  name?: string;
  nivel?: string;
  dias_por_semana?: number;
  objetivo?: string;
  rutina?: WeeklyRoutine;
  nutrition?: {
    calories: string;
    protein: string;
    fats: string;
    carbs: string;
  };
  supplements?: string;
  motivation?: string;
}
