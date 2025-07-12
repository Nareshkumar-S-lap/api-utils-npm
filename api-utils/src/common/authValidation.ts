import Boom from "@hapi/boom";
import { logger } from "./logger";
import { Request } from "@hapi/hapi";
import { LocalAuth } from "./localAuth";

export const unauthorized = () => Boom.unauthorized("Invalid token");

const verifyToken = (token: string) => {
  try {
    const user = LocalAuth.verifyToken(token);
    return { isValid: true, credentials: { token }, artifacts: { user } };
  } catch (err: any) {
    logger.error(`Token validation failed: ${err.message}`);
    return { isValid: false, artifacts: null };
  }
};

const validate = (token: string) => {
  const result = verifyToken(token);
  return result.isValid ? result : unauthorized();
};

export const tokenValidator = {
  validate: (req: Request, token: string) => validate(token),
  unauthorized,
};
