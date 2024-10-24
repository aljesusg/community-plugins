import { useApi } from '@backstage/core-plugin-api';
import { kialiApiRef } from '../apis';
import { ServerConfig } from '@backstage-community/plugin-kiali-react';
import { loadedKiali } from '../config';

const POLLING_INTERVAL = 10000;

export function useLoadKiali(): {
  dataGraph?: ServerConfig;
  loading: boolean;
  error?: Error;
} {
   
    const api = useApi(kialiApiRef);
    

    return {
      dataGraph,
      loading,
      error
    }
}