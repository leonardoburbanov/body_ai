import { NextRequest, NextResponse } from "next/server";
import { mongodbConnection } from "@/src/infrastructure/database/mongodb-connection";
import { MongoDBUserRepository } from "@/src/infrastructure/repositories/mongodb-user-repository";
import { LoginUserUseCase, InvalidCredentialsError } from "@/src/application/use-cases/login-user";

/**
 * POST /api/login
 * Authenticates a user
 */
export async function POST(request: NextRequest) {
  try {
    // Ensure database connection
    await mongodbConnection.connect();

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Initialize dependencies
    const userRepository = new MongoDBUserRepository();
    const loginUserUseCase = new LoginUserUseCase(userRepository);

    // Execute login
    const user = await loginUserUseCase.execute({
      email: email.trim(),
      password,
    });

    return NextResponse.json(
      {
        message: "Login successful",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof InvalidCredentialsError) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
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
