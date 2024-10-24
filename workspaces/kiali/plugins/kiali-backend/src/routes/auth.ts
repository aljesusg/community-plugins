import type { Router } from 'express';
import type { RouterOptions } from '../service/router';
import { getAuthenticate } from '../controllers';

export const registerStatusRoutes = (
  router: Router,
  options: RouterOptions,
  mock?: boolean
) => {
  router.post('/authenticate', getAuthenticate(options, mock));
};
