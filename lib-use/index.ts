/* eslint-disable @typescript-eslint/no-require-imports */

import Hapi from "@hapi/hapi";
import config from "config";
import { logger } from "@nareshorg/api-utils";
import routes from "./routes/Routes";
import { plugins } from "@nareshorg/api-utils";
const createServer = async () => {
  const server = new Hapi.Server({
    port: config.get("app.port"),
    host: config.get("app.host"),
    routes: {
      cors: {
        origin: config.get("app.domains.allowed"),
      },
      validate: {
        failAction: async (_request, _h, err) => {
          logger.debug(err);
          throw err;
        },
      },
    },
  });

  await server.register(plugins);

  server.route(routes);

  return server;
};

const startServer = async () => {
  try {
    const server = await createServer();
    await server.start();
    logger.info(`Server running at: ${server.info.uri}`);

    process.on("unhandledRejection", (err) => {
      logger.error("Unhandled Rejection:", err);
      process.exit(1);
    });

    process.on("SIGINT", async () => {
      logger.info("Shutting down gracefully...");
      await server.stop();
      // TODO: DB call
      process.exit(0);
    });

    return server;
  } catch (err) {
    logger.error("Startup error:", err);
    process.exit(1);
  }
};

startServer();

export default createServer;
