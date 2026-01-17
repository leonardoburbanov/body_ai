import { Routine, CreateRoutineDTO, UpdateRoutineDTO } from "../entities/routine";

/**
 * Routine repository interface
 * Defines the contract for routine data persistence
 */
export interface RoutineRepository {
  /**
   * Creates a new routine
   * @param routineData - Routine data
   * @returns The created routine
   */
  create(routineData: CreateRoutineDTO): Promise<Routine>;

  /**
   * Finds a routine by ID
   * @param id - Routine ID
   * @returns The routine if found, null otherwise
   */
  findById(id: string): Promise<Routine | null>;

  /**
   * Finds all routines for a user
   * @param userId - User ID
   * @returns Array of routines
   */
  findByUserId(userId: string): Promise<Routine[]>;

  /**
   * Updates a routine
   * @param id - Routine ID
   * @param routineData - Updated routine data
   * @returns The updated routine
   */
  update(id: string, routineData: UpdateRoutineDTO): Promise<Routine>;

  /**
   * Deletes a routine
   * @param id - Routine ID
   */
  delete(id: string): Promise<void>;
}
