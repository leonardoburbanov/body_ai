/**
 * Script to add example recipe/meal plan to the database
 * 
 * Usage:
 *   npx tsx scripts/add-recipe.ts [userId]
 * 
 * If userId is not provided, the script will create a default recipe
 * that can be assigned to any user later.
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
 * Example recipe data
 */
const exampleRecipe = {
  name: "Plan Nutricional Semanal - Transformación",
  calorias_diarias_objetivo: "2200-2300 kcal",
  proteina_diaria_objetivo: "160-170 g",
  carbohidratos_diarios_objetivo: "230-280 g",
  grasa_diaria_objetivo: "230-280 g",
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
 * Main function to add recipe to database
 */
async function addRecipe() {
  const userId = process.argv[2] || null;
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
    console.error("      MONGODB_URL=your_url pnpm add-recipe [userId]");
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
    const recipesCollection = db.collection("recipes");

    console.log(`📦 Using database: ${dbName}`);
    console.log(`📋 Collection: recipes`);

    // Check if recipe already exists
    const existingRecipe = await recipesCollection.findOne({
      name: exampleRecipe.name,
      ...(userId ? { userId } : {}),
    });

    if (existingRecipe) {
      console.log("⚠️  Recipe already exists with this name");
      if (userId) {
        console.log(`   User ID: ${userId}`);
      }
      console.log("   Skipping insertion...");
      return;
    }

    // Prepare recipe data
    const now = new Date();
    const recipeData = {
      ...exampleRecipe,
      userId: userId || undefined,
      createdAt: now,
      updatedAt: now,
    };

    // Insert recipe
    console.log("💾 Inserting recipe into database...");
    const result = await recipesCollection.insertOne(recipeData);

    console.log("✅ Recipe added successfully!");
    console.log(`   Recipe ID: ${result.insertedId}`);
    console.log(`   Name: ${exampleRecipe.name}`);
    console.log(`   Calorías diarias: ${exampleRecipe.calorias_diarias_objetivo}`);
    console.log(`   Proteína diaria: ${exampleRecipe.proteina_diaria_objetivo}`);
    console.log(`   Carbohidratos diarios: ${exampleRecipe.carbohidratos_diarios_objetivo}`);
    console.log(`   Grasa diaria: ${exampleRecipe.grasa_diaria_objetivo}`);
    console.log(`   Comidas por día: ${exampleRecipe.comidas_por_dia}`);
    console.log(`   Frutas por día: ${exampleRecipe.frutas_por_dia}`);
    if (userId) {
      console.log(`   User ID: ${userId}`);
    } else {
      console.log(`   User ID: Not assigned (can be assigned later)`);
    }

    // Count total meals
    const totalMeals = Object.values(exampleRecipe.semana).reduce(
      (sum, day) => sum + Object.keys(day).length,
      0
    );
    console.log(`   Total meals in week: ${totalMeals}`);
  } catch (error) {
    console.error("❌ Error adding recipe:", error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("🔌 Disconnected from MongoDB");
    }
  }
}

// Run the script
addRecipe()
  .then(() => {
    console.log("\n✨ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
