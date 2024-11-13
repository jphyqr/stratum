// lib/errors.ts
export class CustomError extends Error {
    constructor(
      message: string,
      public code?: string,
      public status?: number
    ) {
      super(message)
      this.name = this.constructor.name
      // Required for extending Error in TypeScript
      Object.setPrototypeOf(this, new.target.prototype)
    }
  }
  
  export class NotFoundError extends CustomError {
    constructor(
      message = "Resource not found",
      code = "NOT_FOUND",
    ) {
      super(message, code, 404)
    }
  }
  
  export class APIError extends CustomError {
    constructor(
      message: string,
      status: number = 500,
      code?: string,
    ) {
      super(message, code, status)
    }
  }
  
  export class ValidationError extends CustomError {
    constructor(
      message: string,
      public fields?: Record<string, string[]>
    ) {
      super(message, "VALIDATION_ERROR", 400)
    }
  }
  
  export class AuthorizationError extends CustomError {
    constructor(
      message = "Not authorized",
      code = "UNAUTHORIZED"
    ) {
      super(message, code, 401)
    }
  }
  
  // Type guard utilities
  export const isCustomError = (error: unknown): error is CustomError => {
    return error instanceof CustomError
  }
  
  export const isNotFoundError = (error: unknown): error is NotFoundError => {
    return error instanceof NotFoundError
  }
  
  export const isAPIError = (error: unknown): error is APIError => {
    return error instanceof APIError
  }
  
  // Helper for handling unknown errors
  export const toCustomError = (error: unknown): CustomError => {
    if (isCustomError(error)) return error
    
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    return new CustomError(message, "UNKNOWN_ERROR", 500)
  }