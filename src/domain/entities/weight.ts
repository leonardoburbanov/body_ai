/**
 * Weight entry domain entity
 * Represents a weight measurement in the system
 */
export interface Weight {
  id?: string;
  userId: string;
  weight: number; // in kg
  height?: number; // in cm
  bodyPhoto?: string; // URL to body photo
  date: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create weight entry data transfer object
 */
export interface CreateWeightDTO {
  userId: string;
  weight: number;
  height?: number;
  bodyPhoto?: string;
  date: Date;
  notes?: string;
}

/**
 * Update weight entry data transfer object
 */
export interface UpdateWeightDTO {
  weight?: number;
  height?: number;
  bodyPhoto?: string;
  date?: Date;
  notes?: string;
}
