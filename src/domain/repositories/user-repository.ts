import { User, RegisterUserDTO } from "../entities/user";

/**
 * User repository interface
 * Defines the contract for user data persistence
 */
export interface UserRepository {
  /**
   * Creates a new user in the database
   * @param userData - User registration data
   * @returns The created user
   * @throws Error if user creation fails
   */
  create(userData: RegisterUserDTO): Promise<User>;

  /**
   * Finds a user by email
   * @param email - User email address
   * @returns The user if found, null otherwise
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Finds a user by ID
   * @param id - User ID
   * @returns The user if found, null otherwise
   */
  findById(id: string): Promise<User | null>;
}
