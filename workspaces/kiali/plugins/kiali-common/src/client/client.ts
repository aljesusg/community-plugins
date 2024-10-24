import type { DiscoveryApi, FetchApi, IdentityApi } from '@backstage/core-plugin-api';
import crossFetch from 'cross-fetch';
import {  GraphElementsRequest } from '../request/graphRequest';
import { pluginId } from '../pluginId';
import { GraphDefinition } from '../types';
import { KialiApiClient, TypedResponse } from './kialiApi';

/** @public */
export type KialiApi = Omit<
InstanceType<typeof KialiApiClient>,
'fetchApi' | 'discoveryApi'
>;

export class KialiApiClientProxy implements KialiApi {
    private readonly discoveryApi: DiscoveryApi;
    private readonly fetchApi: FetchApi;
    private readonly defaultClient: KialiApiClient;
    private readonly identityApi: IdentityApi;

    constructor(options: { discoveryApi: DiscoveryApi; fetchApi?: FetchApi, identityApi: IdentityApi }) {
        this.defaultClient = new KialiApiClient({
          fetchApi: options.fetchApi,
          discoveryApi: {
            async getBaseUrl() {
              const baseUrl = await options.discoveryApi.getBaseUrl(pluginId);
              return baseUrl;
            },
          },
          identityApi: options.identityApi
        });
        this.discoveryApi = options.discoveryApi;
        this.fetchApi = options.fetchApi ?? { fetch: crossFetch };
        this.identityApi = options.identityApi;
    }

    public async getGraphElements(request: GraphElementsRequest): Promise<TypedResponse<GraphDefinition>> {
        const response = await this.defaultClient.getGraphElements(request)
        return {
          ...response,
          json: async () => {
              const data = await response.json();                
              return data;
            },
      }
    }
}