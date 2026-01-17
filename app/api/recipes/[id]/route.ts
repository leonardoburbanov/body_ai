import { NextRequest, NextResponse } from "next/server";
import { mongodbConnection } from "@/src/infrastructure/database/mongodb-connection";
import { MongoDBRecipeRepository } from "@/src/infrastructure/repositories/mongodb-recipe-repository";
import { UpdateRecipeDTO } from "@/src/domain/entities/recipe";

/**
 * GET /api/recipes/[id]
 * Gets a specific recipe by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongodbConnection.connect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const recipeRepository = new MongoDBRecipeRepository();
    const recipe = await recipeRepository.findById(id);

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        recipe,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get recipe error:", error);

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
 * DELETE /api/recipes/[id]
 * Deletes a recipe
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await mongodbConnection.connect();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const recipeRepository = new MongoDBRecipeRepository();
    await recipeRepository.delete(id);

    return NextResponse.json(
      {
        message: "Recipe deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete recipe error:", error);

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
