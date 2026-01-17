import { Weight, CreateWeightDTO } from "../../domain/entities/weight";
import { WeightRepository } from "../../domain/repositories/weight-repository";

/**
 * Create weight entry use case
 * Handles weight entry creation business logic
 */
export class CreateWeightUseCase {
  constructor(private weightRepository: WeightRepository) {}

  /**
   * Creates a new weight entry
   * @param weightData - Weight entry data
   * @returns The created weight entry
   * @throws Error if validation fails
   */
  async execute(weightData: CreateWeightDTO): Promise<Weight> {
    // Validate weight
    if (weightData.weight <= 0) {
      throw new Error("Weight must be greater than 0");
    }

    if (weightData.weight > 1000) {
      throw new Error("Weight must be less than 1000 kg");
    }

    // Validate date
    if (!(weightData.date instanceof Date) || isNaN(weightData.date.getTime())) {
      throw new Error("Invalid date");
    }

    // Validate userId
    if (!weightData.userId || weightData.userId.trim().length === 0) {
      throw new Error("User ID is required");
    }

    // Create weight entry
    return await this.weightRepository.create(weightData);
  }
}
