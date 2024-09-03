import { HealthResponse } from '@backstage-community/plugin-kiali-common/src/types';
import { createApiRef } from '@backstage/core-plugin-api';

interface KialiApi {
    getHealth(): Promise<HealthResponse>
}

export const kialiApiRef = createApiRef<KialiApi>({
  id: 'plugin.kiali.api',
});


