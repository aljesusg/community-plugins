import { useApi } from '@backstage/core-plugin-api';
import { serverConfig } from "../config"
import { kialiApiRef } from '../apiRef';
import useAsync from 'react-use/esm/useAsync';
import { setServerConfig } from '../config/ServerConfig';
import { ServerConfig } from '../types/ServerConfig';

export const useLoadKiali = ():{
    config?: ServerConfig;
    loading: boolean;
    error?: Error;
  } => {
    if (serverConfig.authStrategy === '') {
        console.log('Loading')
        // We need to load
        const kialiApi = useApi(kialiApiRef);
        return useAsync(async() => {
            const response = await kialiApi.getConfig()     
            const payload = await response.json();  
            setServerConfig(payload)
            return payload
        })
    }    

    return {
        config: serverConfig,
        loading: false,        
    }
}