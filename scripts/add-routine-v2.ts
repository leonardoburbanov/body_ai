/**
 * Script to add the new workout routine schema to the database
 * 
 * Usage:
 *   npx tsx scripts/add-routine-v2.ts [userId] [--clear]
 * 
 * Options:
 *   --clear: Clears all existing routines from the database before inserting
 */

import { MongoClient } from "mongodb";
import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "node:fs";

// Load environment variables from multiple possible locations
const envPaths = [
  resolve(process.cwd(), ".env.local"),
  resolve(process.cwd(), ".env"),
];

let envLoaded = false;

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    const result = config({ path: envPath, override: false });
    if (!result.error) {
      envLoaded = true;
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
 * New routine schema data
 */
const newRoutine = {
  name: "Rutina de Recomposición Corporal",
  nivel: "intermedio",
  dias_por_semana: 5,
  objetivo: "recomposición corporal (bajar grasa y ganar músculo)",
  rutina: {
    lunes: {
      enfoque: "Espalda y Bíceps + Cardio",
      ejercicios: [
        {
          nombre_es: "Jalón al pecho",
          nombre_en: "Lat Pulldown",
          series: 4,
          repeticiones: "8-12",
          url: "https://musclewiki.com/es-es/exercise/lat-pulldown",
        },
        {
          nombre_es: "Remo con mancuerna a una mano",
          nombre_en: "One-Arm Dumbbell Row",
          series: 3,
          repeticiones: "10-12",
          url: "https://musclewiki.com/es-es/exercise/dumbbell-row",
        },
        {
          nombre_es: "Remo sentado en polea",
          nombre_en: "Seated Cable Row",
          series: 3,
          repeticiones: "10-12",
          url: "https://musclewiki.com/es-es/exercise/seated-cable-row",
        },
        {
          nombre_es: "Face pull",
          nombre_en: "Face Pull",
          series: 3,
          repeticiones: "12-15",
          url: "https://musclewiki.com/es-es/exercise/face-pull",
        },
        {
          nombre_es: "Curl de bíceps con mancuernas",
          nombre_en: "Dumbbell Bicep Curl",
          series: 3,
          repeticiones: "10-12",
          url: "https://musclewiki.com/es-es/exercise/dumbbell-bicep-curl",
        },
      ],
      cardio: "Correr suave 20 minutos",
    },
    martes: {
      enfoque: "Piernas (cuádriceps y glúteos)",
      ejercicios: [
        {
          nombre_es: "Sentadilla con barra",
          nombre_en: "Barbell Squat",
          series: 4,
          repeticiones: "6-10",
          url: "https://musclewiki.com/es-es/exercise/barbell-squat",
        },
        {
          nombre_es: "Prensa de piernas",
          nombre_en: "Leg Press",
          series: 3,
          repeticiones: "10-12",
          url: "https://musclewiki.com/es-es/exercise/leg-press",
        },
        {
          nombre_es: "Empuje de cadera",
          nombre_en: "Hip Thrust",
          series: 4,
          repeticiones: "8-12",
          url: "https://musclewiki.com/es-es/exercise/hip-thrust",
        },
        {
          nombre_es: "Extensión de piernas",
          nombre_en: "Leg Extension",
          series: 3,
          repeticiones: "12-15",
          url: "https://musclewiki.com/es-es/exercise/leg-extension",
        },
        {
          nombre_es: "Elevación de talones de pie",
          nombre_en: "Standing Calf Raise",
          series: 4,
          repeticiones: "12-20",
          url: "https://musclewiki.com/es-es/exercise/standing-calf-raise",
        },
      ],
    },
    miercoles: {
      enfoque: "Pecho, Hombros y Abdominales",
      ejercicios: [
        {
          nombre_es: "Press de banca con barra",
          nombre_en: "Barbell Bench Press",
          series: 4,
          repeticiones: "6-10",
          url: "https://musclewiki.com/es-es/exercise/barbell-bench-press",
        },
        {
          nombre_es: "Press inclinado con mancuernas",
          nombre_en: "Incline Dumbbell Press",
          series: 3,
          repeticiones: "8-12",
          url: "https://musclewiki.com/es-es/exercise/incline-dumbbell-press",
        },
        {
          nombre_es: "Press militar con mancuernas",
          nombre_en: "Dumbbell Shoulder Press",
          series: 3,
          repeticiones: "8-12",
          url: "https://musclewiki.com/es-es/exercise/dumbbell-shoulder-press",
        },
        {
          nombre_es: "Elevaciones laterales",
          nombre_en: "Lateral Raise",
          series: 3,
          repeticiones: "12-15",
          url: "https://musclewiki.com/es-es/exercise/lateral-raise",
        },
        {
          nombre_es: "Crunch en polea",
          nombre_en: "Cable Crunch",
          series: 3,
          repeticiones: "12-15",
          url: "https://musclewiki.com/es-es/exercise/cable-crunch",
        },
        {
          nombre_es: "Plancha abdominal",
          nombre_en: "Plank",
          series: 3,
          tiempo: "30-45 segundos",
          url: "https://musclewiki.com/es-es/exercise/plank",
        },
      ],
    },
    viernes: {
      enfoque: "Piernas (isquiotibiales y glúteos)",
      ejercicios: [
        {
          nombre_es: "Peso muerto rumano",
          nombre_en: "Romanian Deadlift",
          series: 4,
          repeticiones: "6-10",
          url: "https://musclewiki.com/es-es/exercise/romanian-deadlift",
        },
        {
          nombre_es: "Curl femoral acostado",
          nombre_en: "Lying Leg Curl",
          series: 3,
          repeticiones: "10-12",
          url: "https://musclewiki.com/es-es/exercise/lying-leg-curl",
        },
        {
          nombre_es: "Zancadas caminando",
          nombre_en: "Walking Lunges",
          series: 3,
          repeticiones: "20 pasos",
        },
        {
          nombre_es: "Abducción de cadera en máquina",
          nombre_en: "Hip Abduction Machine",
          series: 3,
          repeticiones: "12-15",
        },
      ],
    },
    sabado: {
      enfoque: "Espalda ligera, Abdominales y Cardio",
      ejercicios: [
        {
          nombre_es: "Dominadas asistidas",
          nombre_en: "Assisted Pull-Up",
          series: 3,
          repeticiones: "8-10",
          url: "https://musclewiki.com/es-es/exercise/assisted-pull-up",
        },
        {
          nombre_es: "Jalón con brazos rectos",
          nombre_en: "Straight Arm Pulldown",
          series: 3,
          repeticiones: "12-15",
          url: "https://musclewiki.com/es-es/exercise/straight-arm-pulldown",
        },
        {
          nombre_es: "Elevaciones de piernas colgado",
          nombre_en: "Hanging Leg Raise",
          series: 3,
          repeticiones: "10-15",
          url: "https://musclewiki.com/es-es/exercise/hanging-leg-raise",
        },
      ],
      cardio: "Correr suave 25-30 minutos",
    },
  },
};

/**
 * Main function to add routine to database
 */
async function addRoutine() {
  const args = process.argv.slice(2);
  const userId = args.find((arg) => !arg.startsWith("--")) || null;
  const shouldClear = args.includes("--clear");

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
    console.error("      MONGODB_URL=your_url pnpm add-routine-v2 [userId]");
    process.exit(1);
  }

  let client: MongoClient | null = null;

  try {
    console.log("🔌 Connecting to MongoDB...");
    client = new MongoClient(mongoUrl);
    await client.connect();

    // Extract database name from URL
    const urlObj = new URL(mongoUrl);
    const dbName =
      urlObj.pathname && urlObj.pathname !== "/"
        ? urlObj.pathname.substring(1)
        : "body_ai";

    const db = client.db(dbName);
    const routinesCollection = db.collection("routines");

    console.log(`📦 Using database: ${dbName}`);
    console.log(`📋 Collection: routines`);

    // Clear existing routines if requested
    if (shouldClear) {
      console.log("🗑️  Clearing all existing routines...");
      const deleteResult = await routinesCollection.deleteMany({});
      console.log(`   Deleted ${deleteResult.deletedCount} routines`);
    }

    // Check if routine already exists
    const existingRoutine = await routinesCollection.findOne({
      name: newRoutine.name,
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
    const routineData = {
      ...newRoutine,
      userId: userId || undefined,
      createdAt: now,
      updatedAt: now,
    };

    // Insert routine
    console.log("💾 Inserting routine into database...");
    const result = await routinesCollection.insertOne(routineData);

    console.log("✅ Routine added successfully!");
    console.log(`   Routine ID: ${result.insertedId}`);
    console.log(`   Name: ${newRoutine.name}`);
    console.log(`   Nivel: ${newRoutine.nivel}`);
    console.log(`   Días por semana: ${newRoutine.dias_por_semana}`);
    console.log(`   Objetivo: ${newRoutine.objetivo}`);
    if (userId) {
      console.log(`   User ID: ${userId}`);
    } else {
      console.log(`   User ID: Not assigned (can be assigned later)`);
    }

    // Count total exercises
    const totalExercises = Object.values(newRoutine.rutina).reduce(
      (sum, day) => sum + (day?.ejercicios?.length || 0),
      0
    );
    console.log(`   Total exercises: ${totalExercises}`);
    console.log(`   Days with workouts: ${Object.keys(newRoutine.rutina).length}`);
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
