import { Collection, ObjectId } from "mongodb";
import { Weight, CreateWeightDTO, UpdateWeightDTO } from "../../domain/entities/weight";
import { WeightRepository } from "../../domain/repositories/weight-repository";
import { mongodbConnection } from "../database/mongodb-connection";

/**
 * MongoDB implementation of WeightRepository
 * Handles weight data persistence in MongoDB
 */
export class MongoDBWeightRepository implements WeightRepository {
  private getCollection(): Collection {
    return mongodbConnection.getDatabase().collection<Weight>("weights");
  }

  /**
   * Creates a new weight entry in MongoDB
   * @param weightData - Weight entry data
   * @returns The created weight entry with generated ID and timestamps
   */
  async create(weightData: CreateWeightDTO): Promise<Weight> {
    const collection = this.getCollection();
    const now = new Date();

    const weight: Omit<Weight, "id"> = {
      userId: weightData.userId,
      weight: weightData.weight,
      height: weightData.height,
      bodyPhoto: weightData.bodyPhoto,
      date: weightData.date,
      notes: weightData.notes,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(weight as any);

    return {
      id: result.insertedId.toString(),
      ...weight,
    };
  }

  /**
   * Finds a weight entry by ID
   * @param id - Weight entry ID
   * @returns The weight entry if found, null otherwise
   */
  async findById(id: string): Promise<Weight | null> {
    const collection = this.getCollection();

    if (!ObjectId.isValid(id)) {
      return null;
    }

    const weight = await collection.findOne({ _id: new ObjectId(id) });

    if (!weight) {
      return null;
    }

    return this.mapToWeight(weight);
  }

  /**
   * Finds all weight entries for a user
   * @param userId - User ID
   * @returns Array of weight entries sorted by date (newest first)
   */
  async findByUserId(userId: string): Promise<Weight[]> {
    const collection = this.getCollection();
    const weights = await collection
      .find({ userId })
      .sort({ date: -1 })
      .toArray();

    return weights.map((weight) => this.mapToWeight(weight));
  }

  /**
   * Updates a weight entry
   * @param id - Weight entry ID
   * @param weightData - Updated weight data
   * @returns The updated weight entry
   */
  async update(id: string, weightData: UpdateWeightDTO): Promise<Weight> {
    const collection = this.getCollection();

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid weight entry ID");
    }

    const updateData: any = {
      ...weightData,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      throw new Error("Weight entry not found");
    }

    return this.mapToWeight(result);
  }

  /**
   * Deletes a weight entry
   * @param id - Weight entry ID
   */
  async delete(id: string): Promise<void> {
    const collection = this.getCollection();

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid weight entry ID");
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new Error("Weight entry not found");
    }
  }

  /**
   * Maps MongoDB document to Weight entity
   * @param doc - MongoDB document
   * @returns Weight entity
   */
  private mapToWeight(doc: any): Weight {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      weight: doc.weight,
      height: doc.height,
      bodyPhoto: doc.bodyPhoto,
      date: doc.date instanceof Date ? doc.date : new Date(doc.date),
      notes: doc.notes,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
    };
  }
}
