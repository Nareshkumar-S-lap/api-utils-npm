import { API, routeBuilder } from "@nareshorg/api-utils";
/**
 * Health check route definition.
 * This route responds with a simple health status.
 */
const healthRoute = routeBuilder([
  {
    method: "GET",
    path: "/health",
    businessLogic: async (request) => {
      const payload = request.getPayload();
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        message: "Service is healthy",
      };
    },
    config: {
      tags: [API, "status"],
      notes: "checks the health of the service",
      description:
        "used to created a health check endpoint, using npm api-utils library",
    },
  },
]);

export default healthRoute;
