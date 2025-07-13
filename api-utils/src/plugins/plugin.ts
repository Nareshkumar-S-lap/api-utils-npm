/* eslint-disable @typescript-eslint/no-require-imports */

import * as Inert from "@hapi/inert"; // https://github.com/hapijs/inert
import * as Vision from "@hapi/vision"; // https://github.com/hapijs/vision
import * as HapiSwagger from "hapi-swagger"; // https://github.com/glennjones/hapi-swagger
import * as HapiAuthBearerToken from "hapi-auth-bearer-token"; // https://github.com/johnbrett/hapi-auth-bearer-token
import { ServerRegisterPluginObject } from "@hapi/hapi/lib/types/plugin";
import { SWAGGER } from "../common/constants/pluginConstants";
const Blipp = require("blipp") as { register: any; name: string }; // https://github.com/danielb2/blipp

/**
 * @module plugins
 * @description
 * Provides a pre-configured list of Hapi plugins for streamlined server initialization.
 * These plugins support static file serving, API documentation, authentication, and route debugging.
 *
 * ## Usage
 * ```ts
 * import { plugins } from 'your-package-name';
 *
 * const server = Hapi.server({ port: xxxx });
 * await server.register(plugins);
 * ```
 *
 * Swagger UI is available at `/documentation` after registration.
 *
 * ## Plugin Documentation
 * - Hapi.js: https://hapi.dev
 * - Inert: https://github.com/hapijs/inert
 * - Vision: https://github.com/hapijs/vision
 * - hapi-swagger: https://github.com/glennjones/hapi-swagger
 * - hapi-auth-bearer-token: https://github.com/johnbrett/hapi-auth-bearer-token
 * - Blipp: https://github.com/danielb2/blipp
 * - node-config: https://github.com/node-config/node-config
 */

// List of plugins to register with the Hapi server
export const plugins: ServerRegisterPluginObject<any>[] = [
  {
    plugin: Inert // Enables serving of static files (e.g., images, frontend apps) — https://github.com/hapijs/inert
  },
  {
    plugin: Vision // Enables template rendering, required for Swagger UI — https://github.com/hapijs/vision
  },
  {
    plugin: HapiAuthBearerToken // Adds Bearer Token authentication strategy — https://github.com/johnbrett/hapi-auth-bearer-token
  },
  {
    plugin: Blipp, // Logs all registered routes to the console at startup — https://github.com/danielb2/blipp
    options: { showAuth: true }
  },
  {
    plugin: HapiSwagger, // Auto-generates Swagger (OpenAPI) API documentation — https://github.com/glennjones/hapi-swagger
    options: SWAGGER
  }
];
