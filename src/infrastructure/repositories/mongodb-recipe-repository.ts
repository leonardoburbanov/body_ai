import { Collection, ObjectId } from "mongodb";
import {
  Recipe,
  CreateRecipeDTO,
  UpdateRecipeDTO,
} from "../../domain/entities/recipe";
import { RecipeRepository } from "../../domain/repositories/recipe-repository";
import { mongodbConnection } from "../database/mongodb-connection";

/**
 * MongoDB implementation of RecipeRepository
 * Handles recipe data persistence in MongoDB
 */
export class MongoDBRecipeRepository implements RecipeRepository {
  private getCollection(): Collection<Recipe> {
    return mongodbConnection.getDatabase().collection<Recipe>("recipes");
  }

  /**
   * Creates a new recipe in MongoDB
   * @param recipeData - Recipe data
   * @returns The created recipe with generated ID and timestamps
   */
  async create(recipeData: CreateRecipeDTO): Promise<Recipe> {
    const collection = this.getCollection();
    const now = new Date();

    const recipe: Omit<Recipe, "id"> = {
      userId: recipeData.userId,
      name: recipeData.name,
      calorias_diarias_objetivo: recipeData.calorias_diarias_objetivo,
      proteina_diaria_objetivo: recipeData.proteina_diaria_objetivo,
      comidas_por_dia: recipeData.comidas_por_dia,
      frutas_por_dia: recipeData.frutas_por_dia,
      semana: recipeData.semana,
      notes: recipeData.notes,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(recipe as any);

    return {
      id: result.insertedId.toString(),
      ...recipe,
    };
  }

  /**
   * Finds a recipe by ID
   * @param id - Recipe ID
   * @returns The recipe if found, null otherwise
   */
  async findById(id: string): Promise<Recipe | null> {
    const collection = this.getCollection();

    if (!ObjectId.isValid(id)) {
      return null;
    }

    const recipe = await collection.findOne({ _id: new ObjectId(id) });

    if (!recipe) {
      return null;
    }

    return this.mapToRecipe(recipe);
  }

  /**
   * Finds all recipes for a user
   * @param userId - User ID
   * @returns Array of recipes sorted by creation date (newest first)
   */
  async findByUserId(userId: string): Promise<Recipe[]> {
    const collection = this.getCollection();
    const recipes = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return recipes.map((recipe) => this.mapToRecipe(recipe));
  }

  /**
   * Updates a recipe
   * @param id - Recipe ID
   * @param recipeData - Updated recipe data
   * @returns The updated recipe
   */
  async update(id: string, recipeData: UpdateRecipeDTO): Promise<Recipe> {
    const collection = this.getCollection();

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid recipe ID");
    }

    const updateData: any = {
      ...recipeData,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      throw new Error("Recipe not found");
    }

    return this.mapToRecipe(result);
  }

  /**
   * Deletes a recipe
   * @param id - Recipe ID
   */
  async delete(id: string): Promise<void> {
    const collection = this.getCollection();

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid recipe ID");
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new Error("Recipe not found");
    }
  }

  /**
   * Maps MongoDB document to Recipe entity
   * @param doc - MongoDB document
   * @returns Recipe entity
   */
  private mapToRecipe(doc: any): Recipe {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      name: doc.name,
      calorias_diarias_objetivo: doc.calorias_diarias_objetivo,
      proteina_diaria_objetivo: doc.proteina_diaria_objetivo,
      comidas_por_dia: doc.comidas_por_dia,
      frutas_por_dia: doc.frutas_por_dia,
      semana: doc.semana,
      notes: doc.notes,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
    };
  }
}
