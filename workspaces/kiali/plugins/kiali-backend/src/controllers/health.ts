import type { RequestHandler } from 'express';
import type { RouterOptions } from '../service/router';
import type { HealthResponse } from '@backstage-community/plugin-kiali-common/src/types';

export const getHealth: (options: RouterOptions) => RequestHandler =
  options => (_, response) => {
    const { logger } = options;

    logger.info('PONG!');
    const resp: HealthResponse = { status: 'ok' }
    response.json(resp);
  };
