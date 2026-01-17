import { NextRequest, NextResponse } from "next/server";
import { mongodbConnection } from "@/src/infrastructure/database/mongodb-connection";
import { MongoDBUserRepository } from "@/src/infrastructure/repositories/mongodb-user-repository";
import { RegisterUserUseCase, UserAlreadyExistsError } from "@/src/application/use-cases/register-user";

/**
 * POST /api/register
 * Registers a new user
 */
export async function POST(request: NextRequest) {
  try {
    // Ensure database connection
    await mongodbConnection.connect();

    // Parse request body
    const body = await request.json();
    const { email, password, name } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Initialize dependencies
    const userRepository = new MongoDBUserRepository();
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

    // Execute registration
    const user = await registerUserUseCase.execute({
      email: email.trim(),
      password,
      name: name.trim(),
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof UserAlreadyExistsError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

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
