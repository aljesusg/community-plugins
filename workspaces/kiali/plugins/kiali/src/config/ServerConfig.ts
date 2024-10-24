import { computeValidDurations, defaultServerConfig, getHomeCluster, parseHealthConfig, isMC } from "@backstage-community/plugin-kiali-react";
import { ServerConfig } from "@backstage-community/plugin-kiali-react/src/types/ServerConfig";

// Overwritten with real server config on user login. Also used for tests.
let serverConfig = defaultServerConfig;
let homeCluster = getHomeCluster(serverConfig);
let isMultiCluster = isMC(serverConfig);

export const setServerConfig = (cfg: ServerConfig) => {
    serverConfig = {
      ...defaultServerConfig,
      ...cfg
    };
  
    serverConfig.healthConfig = cfg.healthConfig ? parseHealthConfig(cfg.healthConfig) : serverConfig.healthConfig;
    computeValidDurations(serverConfig);
  
    homeCluster = getHomeCluster(serverConfig);
    isMultiCluster = isMC(serverConfig);
};

export { homeCluster, isMultiCluster, serverConfig };