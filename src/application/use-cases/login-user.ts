import * as bcrypt from "bcryptjs";
import { User, LoginUserDTO } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user-repository";

/**
 * Custom error for invalid credentials
 */
export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}

/**
 * Login user use case
 * Handles user authentication
 */
export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  /**
   * Authenticates a user
   * @param loginData - User login credentials
   * @returns The authenticated user (without password)
   * @throws InvalidCredentialsError if credentials are invalid
   * @throws Error if authentication fails
   */
  async execute(loginData: LoginUserDTO): Promise<Omit<User, "password">> {
    // Validate email format
    if (!this.isValidEmail(loginData.email)) {
      throw new InvalidCredentialsError();
    }

    // Find user by email
    const user = await this.userRepository.findByEmail(loginData.email.trim());
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Validates email format
   * @param email - Email address to validate
   * @returns True if email is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
