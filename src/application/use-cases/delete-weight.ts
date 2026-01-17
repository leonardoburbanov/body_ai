import { WeightRepository } from "../../domain/repositories/weight-repository";

/**
 * Delete weight entry use case
 * Handles weight entry deletion
 */
export class DeleteWeightUseCase {
  constructor(private weightRepository: WeightRepository) {}

  /**
   * Deletes a weight entry
   * @param id - Weight entry ID
   * @throws Error if weight entry not found or validation fails
   */
  async execute(id: string): Promise<void> {
    if (!id || id.trim().length === 0) {
      throw new Error("Weight entry ID is required");
    }

    await this.weightRepository.delete(id);
  }
}
