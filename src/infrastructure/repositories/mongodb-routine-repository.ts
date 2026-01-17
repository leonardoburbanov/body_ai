import { Collection, ObjectId } from "mongodb";
import {
  Routine,
  CreateRoutineDTO,
  UpdateRoutineDTO,
} from "../../domain/entities/routine";
import { RoutineRepository } from "../../domain/repositories/routine-repository";
import { mongodbConnection } from "../database/mongodb-connection";

/**
 * MongoDB implementation of RoutineRepository
 * Handles routine data persistence in MongoDB
 */
export class MongoDBRoutineRepository implements RoutineRepository {
  private getCollection(): Collection<Routine> {
    return mongodbConnection.getDatabase().collection<Routine>("routines");
  }

  /**
   * Creates a new routine in MongoDB
   * @param routineData - Routine data
   * @returns The created routine with generated ID and timestamps
   */
  async create(routineData: CreateRoutineDTO): Promise<Routine> {
    const collection = this.getCollection();
    const now = new Date();

    const routine: Omit<Routine, "id"> = {
      userId: routineData.userId,
      name: routineData.name,
      nivel: routineData.nivel,
      dias_por_semana: routineData.dias_por_semana,
      objetivo: routineData.objetivo,
      rutina: routineData.rutina,
      nutrition: routineData.nutrition,
      supplements: routineData.supplements,
      motivation: routineData.motivation,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(routine as any);

    return {
      id: result.insertedId.toString(),
      ...routine,
    };
  }

  /**
   * Finds a routine by ID
   * @param id - Routine ID
   * @returns The routine if found, null otherwise
   */
  async findById(id: string): Promise<Routine | null> {
    const collection = this.getCollection();

    if (!ObjectId.isValid(id)) {
      return null;
    }

    const routine = await collection.findOne({ _id: new ObjectId(id) });

    if (!routine) {
      return null;
    }

    return this.mapToRoutine(routine);
  }

  /**
   * Finds all routines for a user
   * @param userId - User ID
   * @returns Array of routines sorted by creation date (newest first)
   */
  async findByUserId(userId: string): Promise<Routine[]> {
    const collection = this.getCollection();
    const routines = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return routines.map((routine) => this.mapToRoutine(routine));
  }

  /**
   * Updates a routine
   * @param id - Routine ID
   * @param routineData - Updated routine data
   * @returns The updated routine
   */
  async update(id: string, routineData: UpdateRoutineDTO): Promise<Routine> {
    const collection = this.getCollection();

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid routine ID");
    }

    const updateData: any = {
      ...routineData,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      throw new Error("Routine not found");
    }

    return this.mapToRoutine(result);
  }

  /**
   * Deletes a routine
   * @param id - Routine ID
   */
  async delete(id: string): Promise<void> {
    const collection = this.getCollection();

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid routine ID");
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new Error("Routine not found");
    }
  }

  /**
   * Maps MongoDB document to Routine entity
   * @param doc - MongoDB document
   * @returns Routine entity
   */
  private mapToRoutine(doc: any): Routine {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      name: doc.name,
      nivel: doc.nivel,
      dias_por_semana: doc.dias_por_semana,
      objetivo: doc.objetivo,
      rutina: doc.rutina,
      nutrition: doc.nutrition,
      supplements: doc.supplements,
      motivation: doc.motivation,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
    };
  }
}
