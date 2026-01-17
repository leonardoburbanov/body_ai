import { MongoClient, Db } from "mongodb";

/**
 * MongoDB connection manager
 * Handles connection to MongoDB database
 */
class MongoDBConnection {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private static instance: MongoDBConnection;

  private constructor() {}

  /**
   * Gets singleton instance of MongoDBConnection
   */
  static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  /**
   * Connects to MongoDB database
   * @throws Error if connection fails
   */
  async connect(): Promise<void> {
    // If already connected, return early
    if (this.client && this.db) {
      return;
    }

    const mongoUrl = process.env.MONGODB_URL;

    if (!mongoUrl) {
      throw new Error("MONGODB_URL environment variable is not set");
    }

    try {
      this.client = new MongoClient(mongoUrl);
      await this.client.connect();
      const dbName = this.extractDatabaseName(mongoUrl);
      this.db = this.client.db(dbName);
      console.log("Connected to MongoDB successfully");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      // Reset on error
      this.client = null;
      this.db = null;
      throw error;
    }
  }

  /**
   * Gets the database instance
   * @returns Database instance
   * @throws Error if not connected
   */
  getDatabase(): Db {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }

  /**
   * Closes the MongoDB connection
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log("Disconnected from MongoDB");
    }
  }

  /**
   * Extracts database name from MongoDB URL
   * @param url - MongoDB connection URL
   * @returns Database name
   */
  private extractDatabaseName(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname && pathname !== "/" ? pathname.substring(1) : "body_ai";
    } catch {
      return "body_ai";
    }
  }
}

export const mongodbConnection = MongoDBConnection.getInstance();
