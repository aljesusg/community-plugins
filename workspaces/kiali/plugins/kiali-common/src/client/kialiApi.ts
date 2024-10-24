import { pluginId } from "../pluginId";
import { GraphDefinition } from "../types";
import type { DiscoveryApi, IdentityApi, FetchApi } from '@backstage/core-plugin-api';
import crossFetch from 'cross-fetch';
import * as parser from 'uri-template';
import { GraphElementsRequest } from "../request/graphRequest";
import { StatusState } from "@backstage-community/plugin-kiali-react/src/types/StatusState";
import { BackstageRequest } from "../request";
import { ServerConfig } from "@backstage-community/plugin-kiali-react/src/types/ServerConfig";


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
    private readonly identityApi: IdentityApi;
    
    constructor(options: {
      discoveryApi: { getBaseUrl(pluginId: string): Promise<string> };      
      fetchApi?: { fetch: typeof fetch };
      identityApi: IdentityApi;
    }) {
      this.discoveryApi = options.discoveryApi;
      this.fetchApi = options.fetchApi || { fetch: crossFetch };
      this.identityApi = options.identityApi;
    }
    
    private getOptions(request: any = undefined):RequestInit {
     
      const token = async() => await this.identityApi.getCredentials();
      return {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        method: 'POST',
        body: request && JSON.stringify({
          entityRef: request.entityRef,
          params: request.params
        })
      }
    }

    public async getConfig(): Promise<TypedResponse<ServerConfig>> {
      const baseUrl = await this.discoveryApi.getBaseUrl(pluginId);
      const uriTemplate = `/config`;
      const uri = parser.parse(uriTemplate).expand({});
      return await this.fetchApi.fetch(`${baseUrl}${uri}`, this.getOptions());
    }

    public async getStatus(): Promise<TypedResponse<StatusState>> {
      const baseUrl = await this.discoveryApi.getBaseUrl(pluginId);
      const uriTemplate = `/status`;
      const uri = parser.parse(uriTemplate).expand({});
      return await this.fetchApi.fetch(`${baseUrl}${uri}`, this.getOptions());
    }

    public async getGraphElements(
      request: GraphElementsRequest
    ): Promise<TypedResponse<GraphDefinition>> {
      const baseUrl = await this.discoveryApi.getBaseUrl(pluginId);
      const uriTemplate = `/graph`;
      const uri = parser.parse(uriTemplate).expand({});
      return await this.fetchApi.fetch(`${baseUrl}${uri}`, this.getOptions(request));
    }
}