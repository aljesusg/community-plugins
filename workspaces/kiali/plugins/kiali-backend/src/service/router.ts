/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import type { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';

import express from 'express';
import Router from 'express-promise-router';
import { KialiDetails, readKialiConfigs } from './config';
import { registerConfigRoute, registerGraphRoute } from './routes';

export interface RouterOptions {
  kialiConfig?: KialiDetails;
  logger: LoggerService;
  config: Config;
}

/** @public */
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
    registerGraphRoute(router, {...options, kialiConfig: kialiConfig}, mock)    
    registerConfigRoute(router, {...options, kialiConfig: kialiConfig}, mock)    
    /* Middleware */
    const middleware = MiddlewareFactory.create({ logger, config });
    router.use(middleware.error());
  }catch(err) {
    logger.error('[Kiali] Error creating router', err)
  }
  return router;
}
