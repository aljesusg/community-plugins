import type { RequestHandler } from 'express';
import type { RouterOptions } from '../service/router';
import graphMock from '../../dev/__mockData__/graph.json';
import { GraphDefinition } from '@backstage-community/plugin-kiali-common';
import { call } from './util';

export const getGraph: (options: RouterOptions, mock?: boolean) => RequestHandler =
  (options, mock) => async (_, response) => {   
    if (mock) {
      response.json(graphMock)
    }else {
      const endpoint = `/api/namespaces/graph?namespaces=bookinfo`
      const respKiali = await call(options, endpoint)
      if (respKiali.ok) {
        const {duration, elements, graphType, timestamp } = await respKiali.json()
        const body: GraphDefinition = {
          duration,
          elements,
          graphType,
          timestamp 
        }
        response.json(body);
      } else {
        throw new Error(respKiali.statusText);
      }    
    }
  };
