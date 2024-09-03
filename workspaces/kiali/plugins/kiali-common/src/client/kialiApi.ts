import { pluginId } from "../pluginId";
import { HealthResponse } from "../types";
import type { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import crossFetch from 'cross-fetch';
import * as parser from 'uri-template';
import { graphRequest } from "../request/graphRequest";

/**
 * Wraps the Response type to convey a type on the json call.
 *
 * @public
 */
export type TypedResponse<T> = Omit<Response, 'json'> & {
    json: () => Promise<T>;
  };

/**
 * Options you can pass into a request for additional information.
 *
 * @public
 */
export interface RequestOptions {
    token?: string;
  }
/**
 * no description
 * @public
 */
export class KialiApiClient {
    private readonly discoveryApi: DiscoveryApi;
    private readonly fetchApi: FetchApi;
    
    
    constructor(options: {
      discoveryApi: { getBaseUrl(pluginId: string): Promise<string> };
      fetchApi?: { fetch: typeof fetch };
    }) {
      this.discoveryApi = options.discoveryApi;
      this.fetchApi = options.fetchApi || { fetch: crossFetch };
    }

    public async getHealth(
      request: graphRequest,
      options?: RequestOptions
    ): Promise<TypedResponse<HealthResponse>> {
      const baseUrl = await this.discoveryApi.getBaseUrl(pluginId);
      const uriTemplate = `/health`;

      const uri = parser.parse(uriTemplate).expand({});

      return await this.fetchApi.fetch(`${baseUrl}${uri}`, {
      headers: {
          'Content-Type': 'application/json',
          ...(options?.token && { Authorization: `Bearer ${options?.token}` }),
      },
      method: 'GET',
      });
    }
}