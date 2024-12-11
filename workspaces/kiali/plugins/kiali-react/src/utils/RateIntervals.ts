import { ComputedServerConfig, IntervalInMilliseconds } from '@backstage-community/plugin-kiali-common';

export const getName = (durationSeconds: number, serverConfig: ComputedServerConfig): string => {
  const name = serverConfig.durations[durationSeconds];
  if (name) {
    return name;
  }
  return `${durationSeconds} seconds`;
};

export const getRefreshIntervalName = (
  refreshInterval: IntervalInMilliseconds,
): string => {
  // @ts-expect-error
  const refreshIntervalOption = config.toolbar.refreshInterval[refreshInterval];
  return refreshIntervalOption.replace('Every ', '');
};
