import type { RequestHandler } from 'express';
import type { RouterOptions } from '../service/router';
import authMock from '../../dev/__mockData__/auth.json';
import { Authentication } from './Auth';

export const getAuthenticate: (options: RouterOptions, mock?: boolean) => RequestHandler =
  (options, mock) => async (_, response) => {       
    if (mock) {
      options.logger.info(`Kiali Data is Mocked`)
      response.json(authMock)
    } else {     
      const auth = new Authentication(options)
      response.json(await auth.login())
    }
};