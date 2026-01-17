import { Weight, CreateWeightDTO, UpdateWeightDTO } from "../entities/weight";

/**
 * Weight repository interface
 * Defines the contract for weight data persistence
 */
export interface WeightRepository {
  /**
   * Creates a new weight entry
   * @param weightData - Weight entry data
   * @returns The created weight entry
   */
  create(weightData: CreateWeightDTO): Promise<Weight>;

  /**
   * Finds a weight entry by ID
   * @param id - Weight entry ID
   * @returns The weight entry if found, null otherwise
   */
  findById(id: string): Promise<Weight | null>;

  /**
   * Finds all weight entries for a user
   * @param userId - User ID
   * @returns Array of weight entries
   */
  findByUserId(userId: string): Promise<Weight[]>;

  /**
   * Updates a weight entry
   * @param id - Weight entry ID
   * @param weightData - Updated weight data
   * @returns The updated weight entry
   */
  update(id: string, weightData: UpdateWeightDTO): Promise<Weight>;

  /**
   * Deletes a weight entry
   * @param id - Weight entry ID
   */
  delete(id: string): Promise<void>;
}
