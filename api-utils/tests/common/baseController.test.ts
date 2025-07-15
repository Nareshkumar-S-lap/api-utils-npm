import Boom from "@hapi/boom";
import { StatusCodes } from "http-status-codes";

import BaseController from "../../src/common/baseController";
import ErrorMessages from "../../src/common/errorMessage";

jest.mock("logger");
jest.mock("config");

describe("BaseController", () => {
  const controller = new BaseController();

  describe("sendResponse", () => {
    it("should send a 200 JSON response", () => {
      const mockHandler = {
        response: jest.fn().mockReturnThis(),
        type: jest.fn().mockReturnThis(),
        code: jest.fn()
      };
      const responseData = { message: "ok" };

      controller.sendResponse(mockHandler, responseData);

      expect(mockHandler.response).toHaveBeenCalledWith(responseData);
      expect(mockHandler.type).toHaveBeenCalledWith("application/json");
      expect(mockHandler.code).toHaveBeenCalledWith(StatusCodes.OK);
    });
  });

  describe("replyError", () => {
    it("should handle ConditionalCheckFailedException (DynamoDB)", () => {
      const error = {
        type: "dynamo",
        code: "ConditionalCheckFailedException",
        message: "Item exists",
        data: { id: 1 }
      };

      const result = controller.replyError(error);

      expect(result.isBoom).toBe(true);
      expect(result.output.statusCode).toBe(StatusCodes.CONFLICT);
      expect(result.output.payload.details).toEqual({ id: 1 });
    });

    it("should handle NetworkingError (DynamoDB)", () => {
      const error = {
        type: "dynamo",
        code: "NetworkingError",
        message: "DB unreachable"
      };

      const result = controller.replyError(error);

      expect(result.isBoom).toBe(true);
      expect(result.output.statusCode).toBe(StatusCodes.BAD_GATEWAY);
    });

    it("should handle Boom error with custom message override", () => {
      const boomError = Boom.badRequest("Validation failed");

      const errorMessages = new ErrorMessages([
        { status: StatusCodes.BAD_REQUEST, message: "Custom bad request" }
      ]);

      const result = controller.replyError(boomError, errorMessages);

      expect(result.isBoom).toBe(true);
      expect(result.output.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(result.output.payload.message).toBe("Custom bad request");
    });

    it("should handle Joi validation errors", () => {
      const joiError = {
        isJoi: true,
        details: [{ message: "Field is required" }]
      };

      const result = controller.replyError(joiError);

      expect(result.isBoom).toBe(true);
      expect(result.output.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(result.output.payload.details).toEqual(joiError.details);
    });

    it("should handle external API errors with known status", () => {
      const errorMessages = new ErrorMessages([{ status: 404, message: "Custom 404" }]);

      const apiError = {
        response: {
          status: 404,
          data: {
            message: "Not Found",
            description: "Resource missing"
          }
        }
      };

      const result = controller.replyError(apiError, errorMessages);

      expect(result.isBoom).toBe(true);
      expect(result.output.statusCode).toBe(404);
      expect(result.message).toBe("Custom 404");
    });

    it("should fallback to internal error if no API response", () => {
      const genericError = new Error("Something bad");

      const result = controller.replyError(genericError);

      expect(result.isBoom).toBe(true);
      expect(result.output.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});
