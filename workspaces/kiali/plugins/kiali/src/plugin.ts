import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { KialiApiClient } from '@backstage-community/plugin-kiali-common';
import { kialiApiRef } from './apis';

export const kialiPlugin = createPlugin({
  id: 'kiali',
  apis: [
    createApiFactory({
      api: kialiApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory({ discoveryApi, fetchApi }) {
        return new KialiApiClient({
          discoveryApi,
          fetchApi,
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
