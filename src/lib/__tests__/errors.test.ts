import { describe, it, expect } from 'vitest'
import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ExternalServiceError,
} from '../errors'

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create an AppError with correct properties', () => {
      const error = new AppError(500, 'Test error', 'TEST_CODE', { foo: 'bar' })

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(AppError)
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('TEST_CODE')
      expect(error.details).toEqual({ foo: 'bar' })
      expect(error.name).toBe('AppError')
    })
  })

  describe('NotFoundError', () => {
    it('should create a NotFoundError for a resource', () => {
      const error = new NotFoundError('User')

      expect(error).toBeInstanceOf(NotFoundError)
      expect(error).toBeInstanceOf(AppError)
      expect(error.message).toBe('User not found')
      expect(error.statusCode).toBe(404)
      expect(error.code).toBe('NOT_FOUND')
    })

    it('should include id in message when provided', () => {
      const error = new NotFoundError('Project', '123')

      expect(error.message).toBe('Project with id 123 not found')
    })
  })

  describe('ValidationError', () => {
    it('should create a ValidationError with details', () => {
      const details = { field: 'email', message: 'Invalid email' }
      const error = new ValidationError('Validation failed', details)

      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.details).toEqual(details)
    })
  })

  describe('UnauthorizedError', () => {
    it('should create an UnauthorizedError with default message', () => {
      const error = new UnauthorizedError()

      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('UNAUTHORIZED')
      expect(error.message).toBe('Unauthorized')
    })

    it('should create an UnauthorizedError with custom message', () => {
      const error = new UnauthorizedError('Invalid token')

      expect(error.message).toBe('Invalid token')
    })
  })

  describe('ForbiddenError', () => {
    it('should create a ForbiddenError', () => {
      const error = new ForbiddenError('Access denied')

      expect(error.statusCode).toBe(403)
      expect(error.code).toBe('FORBIDDEN')
      expect(error.message).toBe('Access denied')
    })
  })

  describe('ConflictError', () => {
    it('should create a ConflictError', () => {
      const error = new ConflictError('Resource already exists')

      expect(error.statusCode).toBe(409)
      expect(error.code).toBe('CONFLICT')
    })
  })

  describe('ExternalServiceError', () => {
    it('should create an ExternalServiceError with service name', () => {
      const error = new ExternalServiceError('OpenAI')

      expect(error.statusCode).toBe(502)
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR')
      expect(error.message).toBe('External service OpenAI failed')
      expect(error.details).toEqual({ service: 'OpenAI' })
    })

    it('should allow custom message', () => {
      const error = new ExternalServiceError('OpenAI', 'Rate limit exceeded')

      expect(error.message).toBe('Rate limit exceeded')
    })
  })
})
