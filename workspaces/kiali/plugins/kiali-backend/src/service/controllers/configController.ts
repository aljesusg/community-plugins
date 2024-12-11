import type { RequestHandler } from 'express';
import type { RouterOptions } from '../router';
import graphMock from './__mockData__/graph.json';
import { ComputedServerConfig } from '@backstage-community/plugin-kiali-common';
import { call } from '../client/call';
import { configEndpoint } from '../client/kialiEndpoints';

export const getConfig: (options: RouterOptions, mock?: boolean) => RequestHandler =
  (options, mock) => async (_, response) => {   
    if (mock) {
      response.json(graphMock)
    }else {
      const config = await call<ComputedServerConfig>(options, configEndpoint)
      response.json(config as ComputedServerConfig);     
    }
  };
