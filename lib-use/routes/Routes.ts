import { ServerRoute } from '@hapi/hapi';
import * as healthRoutes from '../src/modules/health/route';


const routes: ServerRoute[] = [
  ...healthRoutes.default,
];
export default routes;
