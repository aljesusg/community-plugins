import type { Router } from 'express';
import type { RouterOptions } from '../router';
import { getConfig } from '../controllers';

export const registerConfigRoute = (
  router: Router,
  options: RouterOptions,
  mock?: boolean
) => {
  router.post('/config', getConfig(options, mock));
};
