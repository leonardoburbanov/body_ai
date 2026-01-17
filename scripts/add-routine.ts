/**
 * Script to add the example workout routine to the database
 * 
 * Usage:
 *   npx tsx scripts/add-routine.ts [userId]
 * 
 * If userId is not provided, the script will create a default routine
 * that can be assigned to any user later.
 */

import { MongoClient, ObjectId } from "mongodb";
import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "node:fs";

// Load environment variables from multiple possible locations
const envPaths = [
  resolve(process.cwd(), ".env.local"),
  resolve(process.cwd(), ".env"),
];

let envLoaded = false;
let loadedPath = "";

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    const result = config({ path: envPath, override: false });
    if (!result.error) {
      envLoaded = true;
      loadedPath = envPath;
      console.log(`📄 Loaded environment from: ${envPath}`);
      if (process.env.MONGODB_URL || process.env.MONGODB_URI) {
        console.log(`✅ MONGODB_URL found`);
      } else {
        console.warn(`⚠️  MONGODB_URL not found in ${envPath}`);
      }
      break;
    } else {
      console.warn(`⚠️  Error loading ${envPath}: ${result.error?.message}`);
    }
  }
}

if (!envLoaded) {
  console.warn("⚠️  No .env.local or .env file found, using system environment variables");
  if (process.env.MONGODB_URL || process.env.MONGODB_URI) {
    console.log("✅ MONGODB_URL found in system environment");
  }
}

/**
 * Exercise interface
 */
interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}

/**
 * Day routine interface
 */
interface DayRoutine {
  day: string;
  focus: string;
  exercises: Exercise[];
  cardio?: string;
  notes?: string;
}

/**
 * Workout routine interface
 */
interface WorkoutRoutine {
  name: string;
  duration: string;
  objective: string;
  days: DayRoutine[];
  nutrition?: {
    calories: string;
    protein: string;
    fats: string;
    carbs: string;
  };
  supplements?: string;
  motivation?: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Example workout routine data
 */
const exampleRoutine: Omit<WorkoutRoutine, "userId" | "createdAt" | "updatedAt"> = {
  name: "Rutina de Transformación (12-16 semanas)",
  duration: "12-16 semanas",
  objective:
    "Bajar de ~25% → 15–16% de grasa, mantener/ganar músculo, corregir postura y eliminar dolor de cuello, crear base para volumen limpio posterior",
  days: [
    {
      day: "LUNES",
      focus: "Torso (ESPALDA) + Running",
      exercises: [
        { name: "Dominadas o jalón al pecho", sets: 4, reps: "6-10" },
        { name: "Remo con barra", sets: 4, reps: "6-8" },
        { name: "Remo polea baja", sets: 3, reps: "10-12" },
        { name: "Face pull (pausa 1 s)", sets: 3, reps: "12-15" },
        { name: "Curl bíceps barra", sets: 3, reps: "8-12" },
        { name: "Curl inclinado", sets: 2, reps: "12" },
      ],
      cardio: "Correr suave 20–25 min",
    },
    {
      day: "MARTES",
      focus: "Pierna (FUERZA + GLÚTEO)",
      exercises: [
        { name: "Sentadilla libre", sets: 5, reps: "5" },
        { name: "Peso muerto rumano", sets: 4, reps: "6-8" },
        { name: "Prensa", sets: 3, reps: "8-10" },
        { name: "Curl femoral", sets: 3, reps: "10" },
        { name: "Hip thrust con barra", sets: 3, reps: "8-10" },
        { name: "Gemelos de pie", sets: 5, reps: "12-15" },
      ],
    },
    {
      day: "MIÉRCOLES",
      focus: "Torso (PECHO + HOMBRO) + ABS",
      exercises: [
        { name: "Press banca", sets: 4, reps: "6-8" },
        { name: "Press inclinado mancuernas", sets: 3, reps: "8-10" },
        { name: "Press militar", sets: 3, reps: "6-8" },
        { name: "Elevaciones laterales", sets: 4, reps: "12-15" },
        { name: "Fondos o press cerrado", sets: 3, reps: "8-12" },
        { name: "Crunch en polea", sets: 3, reps: "12-15" },
        { name: "Plancha", sets: 3, reps: "45–60 s" },
      ],
    },
    {
      day: "JUEVES",
      focus: "DESCANSO ACTIVO",
      exercises: [],
      notes:
        "Movilidad general 10–15 min. Estiramiento de trapecio superior, elevador de la escápula, pectoral. Caminata suave opcional",
    },
    {
      day: "VIERNES",
      focus: "Pierna (VOLUMEN + CADERA)",
      exercises: [
        { name: "Prensa pies bajos", sets: 4, reps: "12" },
        { name: "Zancadas caminando", sets: 3, reps: "10 por pierna" },
        { name: "Extensión de cuádriceps", sets: 3, reps: "15" },
        { name: "Curl femoral sentado", sets: 3, reps: "12-15" },
        { name: "Abducción de cadera", sets: 3, reps: "15-20" },
        { name: "Gemelos sentado", sets: 5, reps: "15-20" },
      ],
    },
    {
      day: "SÁBADO",
      focus: "Torso LIGERO + Running + ABS",
      exercises: [
        { name: "Jalón neutro", sets: 3, reps: "10-12" },
        { name: "Remo mancuerna", sets: 3, reps: "10" },
        { name: "Y–T–W con mancuernas/banda", sets: 2, reps: "12-15" },
        { name: "Ab wheel o elevaciones de piernas", sets: 3, reps: "10-12" },
      ],
      cardio: "Correr suave 20–30 min",
    },
    {
      day: "DOMINGO",
      focus: "DESCANSO TOTAL",
      exercises: [],
    },
  ],
  nutrition: {
    calories: "2.200–2.300 kcal",
    protein: "160–170 g",
    fats: "60–70 g",
    carbs: "resto",
  },
  supplements:
    "Creatina 5 g diarios. Whey si no llegas a proteína. Cafeína opcional",
  motivation:
    "No necesitas más cosas, necesitas hacer esto bien durante meses. 4 semanas: menos cintura, menos dolor cervical. 8 semanas: espalda y piernas con forma. 12–16 semanas: físico completamente distinto.",
};

/**
 * Main function to add routine to database
 */
async function addRoutine() {
  const userId = process.argv[2] || null;
  
  // Try to get MONGODB_URL from environment
  const mongoUrl = process.env.MONGODB_URL || process.env.MONGODB_URI;

  if (!mongoUrl) {
    console.error("❌ Error: MONGODB_URL environment variable is not set");
    console.error("");
    console.error("   Please set it in one of the following ways:");
    console.error("   1. Create a .env.local file in the project root with:");
    console.error("      MONGODB_URL=your_mongodb_connection_string");
    console.error("");
    console.error("   2. Set it as a system environment variable");
    console.error("");
    console.error("   3. Pass it directly when running the script:");
    console.error("      MONGODB_URL=your_url pnpm add-routine [userId]");
    process.exit(1);
  }

  let client: MongoClient | null = null;

  try {
    console.log("🔌 Connecting to MongoDB...");
    client = new MongoClient(mongoUrl);
    await client.connect();

    // Extract database name from URL
    const urlObj = new URL(mongoUrl);
    const dbName = urlObj.pathname && urlObj.pathname !== "/" 
      ? urlObj.pathname.substring(1) 
      : "body_ai";
    
    const db = client.db(dbName);
    const routinesCollection = db.collection<WorkoutRoutine>("routines");

    console.log(`📦 Using database: ${dbName}`);
    console.log(`📋 Collection: routines`);

    // Check if routine already exists
    const existingRoutine = await routinesCollection.findOne({
      name: exampleRoutine.name,
      ...(userId ? { userId } : {}),
    });

    if (existingRoutine) {
      console.log("⚠️  Routine already exists with this name");
      if (userId) {
        console.log(`   User ID: ${userId}`);
      }
      console.log("   Skipping insertion...");
      return;
    }

    // Prepare routine data
    const now = new Date();
    const routineData: WorkoutRoutine = {
      ...exampleRoutine,
      userId: userId || undefined,
      createdAt: now,
      updatedAt: now,
    };

    // Insert routine
    console.log("💾 Inserting routine into database...");
    const result = await routinesCollection.insertOne(routineData as any);

    console.log("✅ Routine added successfully!");
    console.log(`   Routine ID: ${result.insertedId}`);
    console.log(`   Name: ${exampleRoutine.name}`);
    console.log(`   Duration: ${exampleRoutine.duration}`);
    console.log(`   Days: ${exampleRoutine.days.length}`);
    if (userId) {
      console.log(`   User ID: ${userId}`);
    } else {
      console.log(`   User ID: Not assigned (can be assigned later)`);
    }

    // Count total exercises
    const totalExercises = exampleRoutine.days.reduce(
      (sum, day) => sum + day.exercises.length,
      0
    );
    console.log(`   Total exercises: ${totalExercises}`);
  } catch (error) {
    console.error("❌ Error adding routine:", error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("🔌 Disconnected from MongoDB");
    }
  }
}

// Run the script
addRoutine()
  .then(() => {
    console.log("\n✨ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
