import { Recipe, CreateRecipeDTO, UpdateRecipeDTO } from "../entities/recipe";

/**
 * Recipe repository interface
 * Defines the contract for recipe data persistence
 */
export interface RecipeRepository {
  /**
   * Creates a new recipe
   * @param recipeData - Recipe data
   * @returns The created recipe
   */
  create(recipeData: CreateRecipeDTO): Promise<Recipe>;

  /**
   * Finds a recipe by ID
   * @param id - Recipe ID
   * @returns The recipe if found, null otherwise
   */
  findById(id: string): Promise<Recipe | null>;

  /**
   * Finds all recipes for a user
   * @param userId - User ID
   * @returns Array of recipes
   */
  findByUserId(userId: string): Promise<Recipe[]>;

  /**
   * Updates a recipe
   * @param id - Recipe ID
   * @param recipeData - Updated recipe data
   * @returns The updated recipe
   */
  update(id: string, recipeData: UpdateRecipeDTO): Promise<Recipe>;

  /**
   * Deletes a recipe
   * @param id - Recipe ID
   */
  delete(id: string): Promise<void>;
}
