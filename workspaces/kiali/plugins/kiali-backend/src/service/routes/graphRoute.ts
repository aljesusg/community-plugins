import type { Router } from 'express';
import type { RouterOptions } from '../router';
import { getGraph } from '../controllers';

export const registerGraphRoute = (
  router: Router,
  options: RouterOptions,
  mock?: boolean
) => {
  router.post('/graph', getGraph(options, mock));
};
