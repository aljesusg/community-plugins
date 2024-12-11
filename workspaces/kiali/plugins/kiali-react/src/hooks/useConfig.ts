import { useApi } from '@backstage/core-plugin-api';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';
import { ComputedServerConfig } from '@backstage-community/plugin-kiali-common';
import { useCallback } from 'react';
import { kialiApiRef } from '../apiRef';

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

    return {
      config: value,
      loading,
      error
    }
  }