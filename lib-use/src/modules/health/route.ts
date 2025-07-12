import { routeBuilder } from "@nareshorg/api-utils";
/**
 * Health check route definition.
 * This route responds with a simple health status.
 */
const healthRoute = routeBuilder([
  {
    method: "GET",
    path: "/health",
    notes: 'rew',
    description: 'ferg',
    businessLogic: async (request) => {
      const payload = request.getPayload();
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        message: "Service is healthy",
      };
    },
  },
]);

export default healthRoute;