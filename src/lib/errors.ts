import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { logError } from './logger'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(404, `${resource}${id ? ` with id ${id}` : ''} not found`, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message, 'FORBIDDEN')
    this.name = 'ForbiddenError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT')
    this.name = 'ConflictError'
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(
      502,
      message || `External service ${service} failed`,
      'EXTERNAL_SERVICE_ERROR',
      { service }
    )
    this.name = 'ExternalServiceError'
  }
}

interface ErrorResponse {
  error: string
  code?: string
  details?: any
  timestamp: string
}

export function handleError(error: unknown): NextResponse<ErrorResponse> {
  logError(error instanceof Error ? error : new Error(String(error)))

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors,
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    )
  }

  // Application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString(),
      },
      { status: error.statusCode }
    )
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: any }

    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        {
          error: 'A record with this data already exists',
          code: 'DUPLICATE_RECORD',
          timestamp: new Date().toISOString(),
        },
        { status: 409 }
      )
    }

    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        {
          error: 'Record not found',
          code: 'NOT_FOUND',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      )
    }
  }

  // Default server error
  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  )
}

// Async error handler wrapper for API routes
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleError(error)
    }
  }
}
