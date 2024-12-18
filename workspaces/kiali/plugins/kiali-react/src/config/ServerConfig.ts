import _ from 'lodash';
import { ComputedServerConfig, defaultServerConfig, MeshCluster } from "@backstage-community/plugin-kiali-common";


export type Durations = { [key: number]: string };

const toDurations = (tupleArray: [number, string][]): Durations => {
  const obj: Duration = {};
  tupleArray.forEach(tuple => {
    obj[tuple[0]] = tuple[1];
  });
  return obj;
};

export const humanDurations = (cfg: ComputedServerConfig, prefix?: string, suffix?: string): Durations =>
  _.mapValues(cfg.durations, v => _.reject([prefix, v, suffix], _.isEmpty).join(' '));

const durationsTuples: [number, string][] = [
    [60, '1m'],
    [120, '2m'],
    [300, '5m'],
    [600, '10m'],
    [1800, '30m'],
    [3600, '1h'],
    [10800, '3h'],
    [21600, '6h'],
    [43200, '12h'],
    [86400, '1d'],
    [604800, '7d'],
    [2592000, '30d']
  ];

export const computeValidDurations = (cfg: ComputedServerConfig): void => {
  const tsdbRetention = cfg.prometheus.storageTsdbRetention;
  const scrapeInterval = cfg.prometheus.globalScrapeInterval;
  let filtered = durationsTuples.filter(
    d => (!tsdbRetention || d[0] <= tsdbRetention!) && (!scrapeInterval || d[0] >= scrapeInterval * 2)
  );
  // Make sure we keep at least one item, even if it's silly
  if (filtered.length === 0) {
    filtered = [durationsTuples[0]];
  }
  cfg.durations = toDurations(filtered);
};

export const getHomeCluster = (cfg: ComputedServerConfig): MeshCluster | undefined => {
    return Object.values(cfg.clusters).find(cluster => cluster.isKialiHome);
}  

export const toValidDuration = (duration: number, serverConfig: ComputedServerConfig = defaultServerConfig): number => {
    // Check if valid
    if (serverConfig.durations[duration]) {
      return duration;
    }
    // Get closest duration
    const validDurations = durationsTuples.filter(d => serverConfig.durations[d[0]]);
    for (let i = validDurations.length - 1; i > 0; i--) {
      if (duration > durationsTuples[i][0]) {
        return validDurations[i][0];
      }
    }
    return validDurations[0][0];
  };


  export const isIstioNamespace = (namespace: string, serverConfig: ComputedServerConfig): boolean => {
    if (namespace === serverConfig.istioNamespace) {
      return true;
    }
    return false;
  };  
  
  // Return true if the cluster is configured for this Kiali instance
  export const isConfiguredCluster = (cluster: string, serverConfig: ComputedServerConfig): boolean => {
    return Object.keys(serverConfig.clusters).includes(cluster);
  };
  
  export const isMC = (serverConfig: ComputedServerConfig): boolean => {
    // If there is only one cluster, it is not a multi-cluster deployment.
    // If there are multiple clusters but only one is accessible, it is not a multi-cluster deployment.
    return (
      Object.keys(serverConfig.clusters).length > 1 &&
      Object.values(serverConfig.clusters).filter(c => c.accessible).length > 1
    );
  }  

  export const isHomeCluster = (cluster: string, serverConfig: ComputedServerConfig): boolean => {
    return !isMC(serverConfig) || cluster === getHomeCluster(serverConfig)?.name;
  };