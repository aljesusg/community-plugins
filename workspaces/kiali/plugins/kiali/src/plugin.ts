import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const kialiPlugin = createPlugin({
  id: 'kiali',
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
