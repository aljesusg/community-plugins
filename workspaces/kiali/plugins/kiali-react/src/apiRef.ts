import { KialiApi, pluginId } from '@backstage-community/plugin-kiali-common';
import { createApiRef } from '@backstage/core-plugin-api';

export const kialiApiRef = createApiRef<KialiApi>({
  id: `plugin.${pluginId}.api`, 
});
