import * as bcrypt from "bcryptjs";
import { User, RegisterUserDTO } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user-repository";

/**
 * Custom error for user already exists
 */
export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = "UserAlreadyExistsError";
  }
}

/**
 * Register user use case
 * Handles user registration business logic
 */
export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  /**
   * Registers a new user
   * @param userData - User registration data
   * @returns The created user (without password)
   * @throws UserAlreadyExistsError if user with email already exists
   * @throws Error if registration fails
   */
  async execute(userData: RegisterUserDTO): Promise<Omit<User, "password">> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(userData.email);
    }

    // Validate email format
    if (!this.isValidEmail(userData.email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (userData.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Validate name
    if (!userData.name || userData.name.trim().length === 0) {
      throw new Error("Name is required");
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create user
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

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
