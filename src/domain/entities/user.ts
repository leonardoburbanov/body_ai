/**
 * User domain entity
 * Represents a user in the system
 */
export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User registration data transfer object
 */
export interface RegisterUserDTO {
  email: string;
  password: string;
  name: string;
}

/**
 * User login data transfer object
 */
export interface LoginUserDTO {
  email: string;
  password: string;
}
