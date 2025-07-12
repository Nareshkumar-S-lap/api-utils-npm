import { API, API_PATH } from "../common/constants/apiConstants";
import { controller } from "../controller/mainController";
import { RequestHelper } from "../common/requestHelper";

import {
  RouteOptions,
  ServerRoute,
  RouteDefMethods,
  RouteOptionsAccess,
} from "@hapi/hapi";

export interface RouteBuilderOptions<T = any> {
  method: RouteDefMethods | RouteDefMethods[];
  path: string;
  businessLogic: (helper: RequestHelper) => Promise<T>;
  tags?: string[];
  notes?: string;
  strategy?: string | false | RouteOptionsAccess;
  description?: string;
  validate?: {
    payload?: object;
    params?: object;
    query?: object;
    headers?: object;
  };
  pre?: any[];
  response?: RouteOptions["response"];
  payloadOptions?: {
    maxBytes?: number;
    output?: "stream" | "data";
  };
}

/**
 * routeBuilder creates one or more standardized Hapi route definitions.
 *
 * Features:
 * - Automatically wraps business logic using `controller()`.
 * - Appends a global API tag and prefixes the route with `API_PATH`.
 * - Supports both single and multiple route inputs.
 */
export const routeBuilder = <T = any>(
  options: RouteBuilderOptions<T> | RouteBuilderOptions<T>[]
): ServerRoute[] => {
  const buildRoute = (opt: RouteBuilderOptions<T>): ServerRoute => {
    const {
      method,
      path,
      businessLogic,
      tags = [],
      notes = "",
      strategy,
      description,
      validate,
      pre,
      response,
      payloadOptions,
    } = opt;

    return {
      method,
      path: `${API_PATH}${path}`,
      handler: controller(businessLogic),
      options: {
        auth: typeof strategy !== "undefined" ? strategy : false,
        tags: [API, ...tags],
        notes,
        description,
        validate,
        pre,
        response,
        payload: payloadOptions,
      },
    };
  };

  return Array.isArray(options)
    ? options.map(buildRoute)
    : [buildRoute(options)];
};
