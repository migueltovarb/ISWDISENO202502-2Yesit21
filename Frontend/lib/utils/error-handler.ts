export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code?: string,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "No autenticado") {
    super(message, 401, "AUTHENTICATION_ERROR")
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "No autorizado") {
    super(message, 403, "AUTHORIZATION_ERROR")
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message, 400, "VALIDATION_ERROR")
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(message, 404, "NOT_FOUND_ERROR")
  }
}

export function handleError(error: unknown): { message: string; code?: string } {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: "Ha ocurrido un error inesperado",
  }
}

export function isAuthError(error: unknown): boolean {
  return error instanceof AuthenticationError || error instanceof AuthorizationError
}
