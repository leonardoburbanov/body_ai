import { Collection, ObjectId } from "mongodb";
import { User, RegisterUserDTO } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user-repository";
import { mongodbConnection } from "../database/mongodb-connection";

/**
 * MongoDB implementation of UserRepository
 * Handles user data persistence in MongoDB
 */
export class MongoDBUserRepository implements UserRepository {
  private getCollection(): Collection {
    return mongodbConnection.getDatabase().collection<User>("users");
  }

  /**
   * Creates a new user in MongoDB
   * @param userData - User registration data
   * @returns The created user with generated ID and timestamps
   */
  async create(userData: RegisterUserDTO): Promise<User> {
    const collection = this.getCollection();
    const now = new Date();

    const user: Omit<User, "id"> = {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(user as any);

    return {
      id: result.insertedId.toString(),
      ...user,
    };
  }

  /**
   * Finds a user by email
   * @param email - User email address
   * @returns The user if found, null otherwise
   */
  async findByEmail(email: string): Promise<User | null> {
    const collection = this.getCollection();
    const user = await collection.findOne({ email });

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Finds a user by ID
   * @param id - User ID
   * @returns The user if found, null otherwise
   */
  async findById(id: string): Promise<User | null> {
    const collection = this.getCollection();

    if (!ObjectId.isValid(id)) {
      return null;
    }

    const user = await collection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
