import { NextRequest, NextResponse } from "next/server";
import { mongodbConnection } from "@/src/infrastructure/database/mongodb-connection";
import { MongoDBWeightRepository } from "@/src/infrastructure/repositories/mongodb-weight-repository";
import { CreateWeightUseCase } from "@/src/application/use-cases/create-weight";
import { GetUserWeightsUseCase } from "@/src/application/use-cases/get-user-weights";

/**
 * POST /api/weights
 * Creates a new weight entry
 */
export async function POST(request: NextRequest) {
  try {
    await mongodbConnection.connect();

    const body = await request.json();
    const { userId, weight, height, bodyPhoto, date, notes } = body;

    if (!userId || !weight || !date) {
      return NextResponse.json(
        { error: "UserId, weight, and date are required" },
        { status: 400 }
      );
    }

    const weightRepository = new MongoDBWeightRepository();
    const createWeightUseCase = new CreateWeightUseCase(weightRepository);

    const weightEntry = await createWeightUseCase.execute({
      userId,
      weight: parseFloat(weight),
      height: height ? parseFloat(height) : undefined,
      bodyPhoto: bodyPhoto?.trim() || undefined,
      date: new Date(date),
      notes: notes?.trim() || undefined,
    });

    return NextResponse.json(
      {
        message: "Weight entry created successfully",
        weight: weightEntry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create weight error:", error);

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
 * GET /api/weights?userId=xxx
 * Gets all weight entries for a user
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

    const weightRepository = new MongoDBWeightRepository();
    const getUserWeightsUseCase = new GetUserWeightsUseCase(weightRepository);

    const weights = await getUserWeightsUseCase.execute(userId);

    return NextResponse.json(
      {
        weights,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get weights error:", error);

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
