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
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { kialiApiRef } from './apis';
import { KialiApiClient } from '@backstage-community/plugin-kiali-common';

export const kialiPlugin = createPlugin({
  id: 'kiali',
  apis: [
    createApiFactory({
      api: kialiApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
        identityApi: identityApiRef
      },
      factory({ discoveryApi, fetchApi, identityApi }) {
        return new KialiApiClient({
          discoveryApi,
          fetchApi,
          identityApi
        });
      },
    })
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const KialiGraphCard = kialiPlugin.provide(
  createComponentExtension({
    name: 'KialiGraphCard',
    component: {
      lazy: () =>
        import('./entity/KialiGraphCard').then(
          m => m.KialiGraphCard,
        ),
    },
  })
);

