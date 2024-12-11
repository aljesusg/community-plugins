import type { RequestHandler } from 'express';
import type { RouterOptions } from '../router';
import graphMock from './__mockData__/graph.json';
import { GraphDefinition } from '@backstage-community/plugin-kiali-common';
import { call } from '../client/call';
import { graphEndpoint } from '../client/kialiEndpoints';

export const getGraph: (options: RouterOptions, mock?: boolean) => RequestHandler =
  (options, mock) => async (_, response) => {   
    if (mock) {
      response.json(graphMock)
    }else {
      const endpoint = `${graphEndpoint}?namespaces=bookinfo`
      const respKiali = await call<GraphDefinition>(options, endpoint)
      response.json(respKiali as GraphDefinition);     
    }
  };
