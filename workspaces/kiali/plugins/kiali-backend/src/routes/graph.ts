import type { Router } from 'express';
import type { RouterOptions } from '../service/router';
import { getGraph } from '../controllers/graph';

export const registerGraphRoutes = (
  router: Router,
  options: RouterOptions,
  mock?: boolean
) => {
  router.post('/graph', getGraph(options, mock));
};
