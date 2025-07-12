import * as HapiSwagger from "hapi-swagger";
import config from "config";

/**
 * @constant SWAGGER
 * @description
 * Swagger (OpenAPI) configuration object for `hapi-swagger` plugin.
 * This config defines basic API metadata and categorizes endpoints using tags.
 *
 * - `info.title`: The name shown on the Swagger UI header.
 * - `info.version`: Pulled dynamically from the app config (e.g., package.json version).
 * - `tags`: Logical grouping of routes (used for better organization in the UI).
 *
 * @see https://github.com/glennjones/hapi-swagger
 */
export const SWAGGER: HapiSwagger.RegisterOptions = {
  info: {
    title: "API Documentation",
    version: config.get<string>("version"), // Retrieves version from your config system
  },
  tags: [
    {
      name: "register", // Used as a grouping label in Swagger UI
      description: "Users registration", // Description shown in the UI
    },
  ],
};
