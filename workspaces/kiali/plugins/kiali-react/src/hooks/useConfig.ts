import { useApi } from '@backstage/core-plugin-api';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';
import { ComputedServerConfig, defaultServerConfig } from '@backstage-community/plugin-kiali-common';
import { useCallback } from 'react';
import { kialiApiRef } from '../apiRef';
import { computeValidDurations, parseHealthConfig } from '../config';

/**
 * Get configuration from Kiali 
 * @public
 */
export const useConfig = (): {
  config: ComputedServerConfig | undefined;
  loading: boolean;
  error?: Error;
} => {
    const kialiApi = useApi(kialiApiRef);    

    const getConfig = useCallback(async (): Promise<ComputedServerConfig> => {    
      const response = await kialiApi.getConfig()     
      return await response.json();               
    }, [kialiApi])

    const { value, loading, error } = useAsyncRetry(
      () => getConfig(),
      [getConfig],
    );
    
    const serverConfig = {
      ...defaultServerConfig,
      ...value
    };
    serverConfig.healthConfig = value && value.healthConfig ? parseHealthConfig(value.healthConfig) : serverConfig.healthConfig;
    
    computeValidDurations(serverConfig);
    if (!serverConfig.ambientEnabled) {
      serverConfig.kialiFeatureFlags.uiDefaults.graph.traffic.ambient = 'none';
    }
    
    return {
      config: serverConfig,
      loading,
      error
    }
  }