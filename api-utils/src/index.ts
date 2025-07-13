//  HTTP request helper wrapper
export { RequestHelper } from "./common/requestHelper";

//  Route builder for defining Hapi routes
export { routeBuilder } from "./route/mainRoute";

// type for the route builder
export type { RouteBuilderOptions } from "./route/mainRoute";

/* 
Assemble multiple route modules into a single array 
-  Organizes and flattens route modules into a single ServerRoute[] array.
-  Supports both default-exported arrays and direct arrays.
*/
export { assembleRoutes } from "./route/assembleRoutes";

//  Controller wrapper to simplify logic and error handling
export { controller } from "./controller/mainController";

// type for the business logic
export type { BusinessLogicFn } from "./controller/mainController";

//  API constants: base path, methods, tags, etc.
export { API, API_PATH, API_METHODS, STRATEGY } from "./common/constants/apiConstants";

// Core authentication utilities (e.g., JWT/session decoding)
export { Auth } from "./common/auth";

//  Validation rules/middleware for auth routes
export { tokenValidator, unauthorized } from "./common/authValidation";

//  Logger utility for consistent structured logs
export { logger } from "./common/logger";

//  Local authentication strategy (username/password)
export { LocalAuth } from "./common/localAuth";

//  Utility helpers (formatters, validators, etc.)
export { Utils } from "./common/utils";

//  Custom error classes & error formatting helpers
export { ErrorUtils } from "./common/errorUtils";

//  Plugin registration and configuration
export { plugins } from "./plugins/plugin";
