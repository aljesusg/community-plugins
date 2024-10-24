import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { KialiApiClient } from '@backstage-community/plugin-kiali-common';
import { kialiApiRef } from './apis';
import { pluginId } from '@backstage-community/plugin-kiali-common/src/pluginId';

export const kialiPlugin = createPlugin({
  id: pluginId,
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

export const KialiPage = kialiPlugin.provide(
  createRoutableExtension({
    name: 'KialiPage',
    component: () =>
      import('./components/GraphCard').then(m => m.GraphCard),
    mountPoint: rootRouteRef,
  }),
);

/** @public **/
export const KialiGraphCard = kialiPlugin.provide(
  createComponentExtension({
    name: 'GraphCard',
    component: {
      lazy: () => import('./components/GraphCard').then(m => m.GraphCard),
    },
  }),
);
