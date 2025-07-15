import { tokenValidator } from "../../src/common/authValidation";
import { LocalAuth } from "../../src/common/localAuth";
import { logger } from "../../src/common/logger";
import Boom from "@hapi/boom";
jest.mock("config");
jest.mock("../../src/common/localAuth");
jest.mock("../../src/common/logger"); // <-- automatically uses __mocks__/logger.ts




describe("tokenValidator", () => {
  const fakeToken = "valid.jwt.token";
  const fakeUser = { id: 123, email: "test@example.com" };
  const mockRequest: any = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns valid result when token is valid", () => {
    (LocalAuth.verifyToken as jest.Mock).mockReturnValue(fakeUser);

    const result = tokenValidator.validate(mockRequest, fakeToken);

    expect(result).toEqual({
      isValid: true,
      credentials: { token: fakeToken },
      artifacts: { user: fakeUser }
    });
  });

  it("returns unauthorized when token is invalid", () => {
    (LocalAuth.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });
    const result = tokenValidator.validate(mockRequest, "bad.token");
    expect(Boom.isBoom(result)).toBe(true);
    if (Boom.isBoom(result)) {
      expect(result.output.statusCode).toBe(401);
    }
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Token validation failed: Invalid token")
    );
  });
});
