import jwt, { JwtPayload, SignOptions, VerifyOptions, Secret } from "jsonwebtoken";

/**
 * LocalAuth class handles JWT token signing and verification.
 * Uses AUTH_SECRET variable from environment as default secret secretkey.
 */
export class LocalAuth {
  // Load secret secretkey from environment (fails fast if not set)
  private static readonly AUTH_SECRET: Secret = process.env.AUTH_SECRET!;

  // Resolve which secretkey to use (env or override)
  private static getKey = (secretkey?: Secret): Secret =>
    secretkey != null ? secretkey : this.AUTH_SECRET;

  /**
   * Signs a payload into a JWT.
   * @param payload - The payload to encode.
   * @param secretkey - Optional override for the secret secretkey.
   * @param options - Optional signing options.
   * @returns JWT string.
   */
  static signToken = (
    payload: string | Buffer | object,
    secretkey?: Secret,
    options?: SignOptions
  ): string => {
    return jwt.sign(payload, this.getKey(secretkey), options);
  };

  /**
   * Verifies and decodes a JWT.
   * @param token - JWT string.
   * @param secretkey - Optional override for the secret secretkey.
   * @param options - Optional verification options.
   * @returns Decoded payload or throws on invalid/expired token.
   */
  static verifyToken = (
    token: string,
    secretkey?: Secret,
    options?: VerifyOptions
  ): JwtPayload | string => {
    return jwt.verify(token, this.getKey(secretkey), options);
  };
}
