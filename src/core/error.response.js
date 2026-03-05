import { StatusCodes } from 'http-status-codes'
import { ReasonPhrases } from 'http-status-codes'

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
    this.message = message
  }
}

class ConflictErrorResponse extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    metadata = null,
    statusCode = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode)
    this.metadata = metadata
  }
}

class BadRequestErrorResponse extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    statusCode = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode)
  }
}

class GoneErrorResponse extends ErrorResponse {
  constructor(message = ReasonPhrases.GONE, statusCode = StatusCodes.GONE) {
    super(message, statusCode)
  }
}

class InternalServerErrorResponse extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode)
  }
}

class NotFoundErrorResponse extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode)
  }
}

class UnAuthorizedErrorResponse extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode)
  }
}

class ForbiddenErrorResponse extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    metadata = null,
    statusCode = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode)
    this.metadata = metadata
  }
}

class UnprocessableEntityErrorResponse extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNPROCESSABLE_ENTITY,
    statusCode = StatusCodes.UNPROCESSABLE_ENTITY
  ) {
    super(message, statusCode)
  }
}

class RedisErrorResponse extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode)
  }
}

export {
  ErrorResponse,
  ConflictErrorResponse,
  BadRequestErrorResponse,
  NotFoundErrorResponse,
  ForbiddenErrorResponse,
  RedisErrorResponse,
  UnAuthorizedErrorResponse,
  UnprocessableEntityErrorResponse,
  InternalServerErrorResponse,
  GoneErrorResponse
}
