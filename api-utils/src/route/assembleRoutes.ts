import { ServerRoute } from "@hapi/hapi";

/**
 * Organizes and flattens route modules into a single ServerRoute[] array.
 * Supports both default-exported arrays and direct arrays.
 *
 * Example:
 *   assembleRoutes(healthRoutes, userRoutes)
 */
export const assembleRoutes = (
  ...modules: Array<ServerRoute[] | { default: ServerRoute[] }>
): ServerRoute[] => {
  return modules.flatMap((mod) => (Array.isArray(mod) ? mod : mod.default || []));
};
