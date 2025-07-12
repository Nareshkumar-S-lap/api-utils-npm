import config from "config";
import type { RouteDefMethods } from "@hapi/hapi"; // ✅ Correct type for defining route method maps

/**
 * Object map for API methods, fully typed.
 */
export const API_METHODS: Partial<Record<RouteDefMethods, RouteDefMethods>> = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
  OPTIONS: "OPTIONS",
};

/**
 * Literal type for available auth strategy keys.
 */
export type AuthStrategy = string;

/**
 * Object map for auth strategies.
 */
export const STRATEGY: Record<AuthStrategy, AuthStrategy> = {
  SIMPLE: "simple",
};

/**
 * Base API identifier string.
 */
export const API: string = "api";

/**
 * API path constructed using version from app config.
 */
export const API_PATH: string = `/api/${config.get<string>("version")}`;

/**
 * 📦 All constants above are **named exports**.
 * 👉 To use in your project:
 *
 * import {
 *   API,
 *   API_PATH,
 *   API_METHODS,
 *   STRATEGY,
 *   type AuthStrategy
 * } from '@your-scope/api-utils';
 */
