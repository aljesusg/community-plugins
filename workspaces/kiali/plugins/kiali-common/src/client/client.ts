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
import type { DiscoveryApi, FetchApi, IdentityApi } from '@backstage/core-plugin-api';
import crossFetch from 'cross-fetch';
import {  GraphElementsRequest } from '../request/graphRequest';
import { pluginId } from '../constants';
import { ComputedServerConfig, GraphDefinition } from '../types';
import { KialiApiClient, TypedResponse } from './KialiApiClient';

/** @public */
export type KialiApi = Omit<
  InstanceType<typeof KialiApiClient>,
  'fetchApi' | 'discoveryApi'
>;

/**
 * This class is a proxy for the original Optimizations client.
 * It provides the following additional functionality:
 *   1. Routes calls through the backend's proxy.
 *   2. Implements a token renewal mechanism.
 *   3. Handles case conversion
 *
 * @public
 */
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

  public async getConfig(): Promise<TypedResponse<ComputedServerConfig>> {
    const response = await this.defaultClient.getConfig()
    return {
      ...response,
      json: async () => {
          const data = await response.json();                
          return data;
        },
    }
  }
}
