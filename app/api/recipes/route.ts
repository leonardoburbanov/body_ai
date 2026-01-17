import { NextRequest, NextResponse } from "next/server";
import { mongodbConnection } from "@/src/infrastructure/database/mongodb-connection";
import { MongoDBRecipeRepository } from "@/src/infrastructure/repositories/mongodb-recipe-repository";
import { CreateRecipeDTO } from "@/src/domain/entities/recipe";

/**
 * GET /api/recipes?userId=xxx
 * Gets all recipes for a user
 */
export async function GET(request: NextRequest) {
  try {
    await mongodbConnection.connect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "UserId is required" },
        { status: 400 }
      );
    }

    const recipeRepository = new MongoDBRecipeRepository();
    const recipes = await recipeRepository.findByUserId(userId);

    return NextResponse.json(
      {
        recipes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get recipes error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/recipes
 * Creates a new recipe
 */
export async function POST(request: NextRequest) {
  try {
    await mongodbConnection.connect();

    const body = await request.json();
    const {
      userId,
      name,
      calorias_diarias_objetivo,
      proteina_diaria_objetivo,
      comidas_por_dia,
      frutas_por_dia,
      semana,
      notes,
    } = body;

    if (
      !userId ||
      !name ||
      !calorias_diarias_objetivo ||
      !proteina_diaria_objetivo ||
      !comidas_por_dia ||
      !frutas_por_dia ||
      !semana
    ) {
      return NextResponse.json(
        {
          error:
            "UserId, name, calorias_diarias_objetivo, proteina_diaria_objetivo, comidas_por_dia, frutas_por_dia, and semana are required",
        },
        { status: 400 }
      );
    }

    const recipeRepository = new MongoDBRecipeRepository();

    const recipeData: CreateRecipeDTO = {
      userId,
      name,
      calorias_diarias_objetivo,
      proteina_diaria_objetivo,
      comidas_por_dia: parseInt(comidas_por_dia),
      frutas_por_dia: parseInt(frutas_por_dia),
      semana,
      notes: notes?.trim() || undefined,
    };

    const recipe = await recipeRepository.create(recipeData);

    return NextResponse.json(
      {
        message: "Recipe created successfully",
        recipe,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create recipe error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
