import Boom from "@hapi/boom";

export class ErrorUtils {
  static badRequest(message = "Bad Request", data: Record<string, any> = {}) {
    return Boom.badRequest(message, data);
  }

  static unauthorized(message = "Unauthorized") {
    return Boom.unauthorized(message);
  }

  static forbidden(message = "Forbidden", data: Record<string, any> = {}) {
    return Boom.forbidden(message, data);
  }

  static notFound(message = "Not Found", data: Record<string, any> = {}) {
    return Boom.notFound(message, data);
  }

  static conflict(message = "Conflict", data: Record<string, any> = {}) {
    return Boom.conflict(message, data);
  }

  static internal(
    message = "Internal Server Error",
    data: Record<string, any> = {}
  ) {
    return Boom.internal(message, data);
  }

  static notImplemented(
    message = "Not Implemented",
    data: Record<string, any> = {}
  ) {
    return Boom.notImplemented(message, data);
  }
}
