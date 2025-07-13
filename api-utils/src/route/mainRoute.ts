import { RouteOptions, ServerRoute, RouteDefMethods } from "@hapi/hapi";
import { RequestHelper } from "../common/requestHelper";
import { API, API_PATH } from "../common/constants/apiConstants";
import { controller } from "../controller/mainController";

export interface RouteBuilderOptions<T = any> {
  /**
   * HTTP method(s) supported by this route.
   * You can specify a single method like `'GET'` or an array like `['GET', 'POST']`.
   *
   * @example 'GET'
   * @example ['GET', 'POST']
   */
  method: RouteDefMethods | RouteDefMethods[];

  /**
   * The route path (relative). This will automatically be prefixed by `API_PATH`.
   *
   * @example '/user' → becomes `/api/v1/user` if API_PATH = '/api/v1'
   */
  path: string;

  /**
   * The async business logic for handling the request.
   * This will be automatically wrapped using `controller()` to handle errors and responses.
   *
   * You receive a `RequestHelper` instance with helpers like `.getPayload()`, `.getParams()`, etc.
   *
   * @example
   * async (helper) => {
   *   const payload = await helper.getPayload();
   *   return { success: true, data: payload };
   * }
   */
  businessLogic: (helper: RequestHelper) => Promise<T>;

  /**
   * Optional full Hapi route config (matches all Hapi `RouteOptions`).
   * This includes:
   * - `auth`: authentication strategy or config
   * - `validate`: Joi schemas for payload, params, query, headers
   * - `tags`, `notes`, `description`: for Swagger/OpenAPI docs
   * - `payload`: options for how to parse payload (e.g., stream/data)
   * - `timeout`, `cors`, `cache`, `plugins`, `state`, etc.
   *
   * The global API tag is automatically added to `tags`, if defined.
   *
   * @example
   * config: {
   *   auth: { strategy: 'jwt', scope: ['+admin'] },
   *   description: 'Create a user',
   *   tags: ['User'],
   *   validate: {
   *     payload: Joi.object({
   *       name: Joi.string().required()
   *     })
   *   },
   *   cors: true,
   *   timeout: { socket: 30000 }
   * }
   */
  config?: Partial<RouteOptions>;
} 


/**
 * routeBuilder creates one or more standardized Hapi route definitions.
 *
 * Features:
 * - Automatically wraps business logic using `controller()`.
 * - Appends a global API tag and prefixes the route with `API_PATH`.
 * - Supports both single and multiple route inputs.
 */
/**
 * Creates one or more Hapi route definitions with standardized structure.
 *
 * Features:
 * - Automatically wraps the business logic using `controller()`.
 * - Prefixes all paths with `API_PATH` (e.g., '/api/v1').
 * - Appends a global API tag to Hapi's route tags.
 * - Supports both single route objects and arrays of route objects.
 *
 * @example
 * routeBuilder({
 *   method: 'POST',
 *   path: '/user',
 *   businessLogic: async (helper) => {
 *     const data = await helper.getPayload();
 *     return { message: 'Created', data };
 *   },
 *   config: {
 *     auth: { strategy: 'jwt' },
 *     validate: {
 *       payload: Joi.object({ name: Joi.string().required() })
 *     },
 *     tags: ['User'],
 *     description: 'Create a new user',
 *     cors: true
 *   }
 * });
 */

export const routeBuilder = <T = any>(
  options: RouteBuilderOptions<T> | RouteBuilderOptions<T>[]
): ServerRoute[] => {
  const buildRoute = (opt: RouteBuilderOptions<T>): ServerRoute => {
    const { method, path, businessLogic, config = {} } = opt;

    return {
      method,
      path: `${API_PATH}${path}`,
      handler: controller(businessLogic),
      options: {
        ...config,
        tags: [API, ...(config.tags || [])] // Ensure global tag is added
      }
    };
  };

  return Array.isArray(options) ? options.map(buildRoute) : [buildRoute(options)];
};
