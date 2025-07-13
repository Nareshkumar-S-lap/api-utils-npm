import { assembleRoutes } from "@nareshorg/api-utils";
import * as healthRoutes from "../src/modules/health/route";

const routes = assembleRoutes(healthRoutes);
export default routes;
