import type { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import crossFetch from 'cross-fetch';
import { KialiApiClient, TypedResponse } from "./kialiApi";
import { HealthResponse } from '../types';
import { graphRequest } from '../request/graphRequest';

/** @public */
export type KialiApi = Omit<
InstanceType<typeof KialiApiClient>,
'fetchApi' | 'discoveryApi'
>;

export class KialiApiClientProxy implements KialiApi {
    private readonly discoveryApi: DiscoveryApi;
    private readonly fetchApi: FetchApi;
    private readonly defaultClient: KialiApiClient;
    private token?: string; 

    constructor(options: { discoveryApi: DiscoveryApi; fetchApi?: FetchApi }) {
        this.defaultClient = new KialiApiClient({
          fetchApi: options.fetchApi,
          discoveryApi: {
            async getBaseUrl() {
              const baseUrl = await options.discoveryApi.getBaseUrl('proxy');
              return `${baseUrl}/kiali`;
            },
          },
        });
        this.discoveryApi = options.discoveryApi;
        this.fetchApi = options.fetchApi ?? { fetch: crossFetch };
    }

    public async getHealth(request: graphRequest): Promise<TypedResponse<HealthResponse>> {
        const response = await this.getHealth(request);

        return {
            ...response,
            json: async () => {
                const data = await response.json();                
                return data;
              },
        }
    }
}