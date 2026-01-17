import { Weight } from "../../domain/entities/weight";
import { WeightRepository } from "../../domain/repositories/weight-repository";

/**
 * Get user weights use case
 * Retrieves all weight entries for a user
 */
export class GetUserWeightsUseCase {
  constructor(private weightRepository: WeightRepository) {}

  /**
   * Gets all weight entries for a user
   * @param userId - User ID
   * @returns Array of weight entries
   */
  async execute(userId: string): Promise<Weight[]> {
    if (!userId || userId.trim().length === 0) {
      throw new Error("User ID is required");
    }

    return await this.weightRepository.findByUserId(userId);
  }
}
