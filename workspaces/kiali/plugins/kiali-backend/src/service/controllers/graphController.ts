import type { RequestHandler } from 'express';
import type { RouterOptions } from '../router';
import graphMock from './__mockData__/graph.json';
import { GraphDefinition } from '@backstage-community/plugin-kiali-common';
import { call } from '../client/call';
import { graphEndpoint } from '../client/kialiEndpoints';

export const getGraph: (options: RouterOptions, mock?: boolean) => RequestHandler =
  (options, mock) => async (req, response) => {   
    if (mock) {
      response.json(graphMock)
    }else {
      const endpoint = `${graphEndpoint}?${new URLSearchParams(req.body["params"]).toString()}`
      const respKiali = await call<GraphDefinition>(options, endpoint)
      response.json(respKiali as GraphDefinition);     
    }
  };
