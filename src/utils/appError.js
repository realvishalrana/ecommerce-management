export class AppError extends Error {
  constructor(
    message,
    {
      status = 500,
      code = "INTERNAL_ERROR",
      details = null,
      isOperational = true,
    } = {},
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = status;
    this.details = details;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details) {
    super(message, {
      status: 400,
      code: "BAD_REQUEST",
      details,
    });
  }
}

export class UnAuthorizedError extends AppError {
  constructor(message = "UNAUTHORIZED", details) {
    super(message, {
      status: 401,
      code: "UNAUTHORIZED",
      details,
    });
  }
}

export class DuplicateRequestError extends AppError {
  constructor(message = "Duplicate Documents", details) {
    super(message, {
      status: 409,
      code: "DUPLICATE",
      details,
    });
  }
}
