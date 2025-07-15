import { Request, ResponseToolkit } from "@hapi/hapi";
import { RequestHelper } from "@common/requestHelper";
import BaseController from "@common/baseController";
import Performance from "@common/performance";

// Defines the shape of the business logic function to be injected into the controller
export type BusinessLogicFn = (helper: RequestHelper) => Promise<any>;

/**
 * Controller wrapper that standardizes request handling:
 * - Initializes RequestHelper for extracting request data
 * - Executes the provided business logic
 * - Handles success and error responses consistently
 * - Measures and logs performance timing for each request
 *
 * @param businessLogic - Async function containing your route-specific logic
//  * @returns Hapi-compatible route handler
 */
export const controller = (businessLogic: BusinessLogicFn) => {
  return async (request: Request, h: ResponseToolkit) => {
    const requestHelper = new RequestHelper(request);
    const base = new BaseController();

    // Start performance tracking for the current request
    const perf = new Performance(`${request.method.toUpperCase()} ${request.path}`);

    try {
      const result = await businessLogic(requestHelper);
      return base.sendResponse(h, result);
    } catch (err: any) {
      return base.replyError(err);
    } finally {
      perf.stop(); // Log duration or performance metrics
    }
  };
};
