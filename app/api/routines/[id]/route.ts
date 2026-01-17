import { NextRequest, NextResponse } from "next/server";
import { mongodbConnection } from "@/src/infrastructure/database/mongodb-connection";
import { MongoDBRoutineRepository } from "@/src/infrastructure/repositories/mongodb-routine-repository";

/**
 * GET /api/routines/[id]
 * Gets a specific routine by ID
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
        { error: "Routine ID is required" },
        { status: 400 }
      );
    }

    const routineRepository = new MongoDBRoutineRepository();
    const routine = await routineRepository.findById(id);

    if (!routine) {
      return NextResponse.json(
        { error: "Routine not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        routine,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get routine error:", error);

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
 * DELETE /api/routines/[id]
 * Deletes a routine
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
        { error: "Routine ID is required" },
        { status: 400 }
      );
    }

    const routineRepository = new MongoDBRoutineRepository();
    await routineRepository.delete(id);

    return NextResponse.json(
      {
        message: "Routine deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete routine error:", error);

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
