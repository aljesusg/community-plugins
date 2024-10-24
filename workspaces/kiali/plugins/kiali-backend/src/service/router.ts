import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { registerGraphRoutes, registerStatusRoutes } from '../routes';
import { KialiDetails, readKialiConfigs } from './config';

export interface RouterOptions {
  kialiConfig?: KialiDetails;
  logger: LoggerService;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
  mock?: boolean
): Promise<express.Router> {
  const { logger, config } = options;
  const router = Router();
  try {   
    /* Kiali configuration */
    logger.info('Initializing Kiali backend');
    const kialiConfig = readKialiConfigs(config);    

    router.use(express.json());
    /* Routes */
    registerStatusRoutes(router, {...options, kialiConfig: kialiConfig}, mock) 
    registerGraphRoutes(router, {...options, kialiConfig: kialiConfig}, mock) 
    /* Middleware */
    const middleware = MiddlewareFactory.create({ logger, config });
    router.use(middleware.error());
  }catch(err) {
    logger.error('[Kiali] Error creating router', err)
  }
  return router;
}
