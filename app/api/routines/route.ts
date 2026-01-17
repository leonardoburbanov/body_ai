import { NextRequest, NextResponse } from "next/server";
import { mongodbConnection } from "@/src/infrastructure/database/mongodb-connection";
import { MongoDBRoutineRepository } from "@/src/infrastructure/repositories/mongodb-routine-repository";
import { CreateRoutineDTO } from "@/src/domain/entities/routine";

/**
 * GET /api/routines?userId=xxx
 * Gets all routines for a user
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

    const routineRepository = new MongoDBRoutineRepository();
    const routines = await routineRepository.findByUserId(userId);

    return NextResponse.json(
      {
        routines,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get routines error:", error);

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
 * POST /api/routines
 * Creates a new routine
 */
export async function POST(request: NextRequest) {
  try {
    await mongodbConnection.connect();

    const body = await request.json();
    const {
      userId,
      name,
      nivel,
      dias_por_semana,
      objetivo,
      rutina,
      nutrition,
      supplements,
      motivation,
    } = body;

    if (
      !userId ||
      !name ||
      !nivel ||
      !dias_por_semana ||
      !objetivo ||
      !rutina
    ) {
      return NextResponse.json(
        {
          error:
            "UserId, name, nivel, dias_por_semana, objetivo, and rutina are required",
        },
        { status: 400 }
      );
    }

    const routineRepository = new MongoDBRoutineRepository();

    const routineData: CreateRoutineDTO = {
      userId,
      name,
      nivel,
      dias_por_semana: parseInt(dias_por_semana),
      objetivo,
      rutina,
      nutrition,
      supplements: supplements?.trim() || undefined,
      motivation: motivation?.trim() || undefined,
    };

    const routine = await routineRepository.create(routineData);

    return NextResponse.json(
      {
        message: "Routine created successfully",
        routine,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create routine error:", error);

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
