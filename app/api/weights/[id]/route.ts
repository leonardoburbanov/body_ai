import { NextRequest, NextResponse } from "next/server";
import { mongodbConnection } from "@/src/infrastructure/database/mongodb-connection";
import { MongoDBWeightRepository } from "@/src/infrastructure/repositories/mongodb-weight-repository";
import { DeleteWeightUseCase } from "@/src/application/use-cases/delete-weight";

/**
 * DELETE /api/weights/[id]
 * Deletes a weight entry
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
        { error: "Weight entry ID is required" },
        { status: 400 }
      );
    }

    const weightRepository = new MongoDBWeightRepository();
    const deleteWeightUseCase = new DeleteWeightUseCase(weightRepository);

    await deleteWeightUseCase.execute(id);

    return NextResponse.json(
      {
        message: "Weight entry deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete weight error:", error);

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
