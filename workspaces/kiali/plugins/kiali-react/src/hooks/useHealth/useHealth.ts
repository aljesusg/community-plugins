
import { useEffect } from 'react';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';
import { ProxyStatus } from '@backstage-community/plugin-kiali-common';


interface Thresholds {
  degraded: number;
  failure: number;
  unit: string;
}

export const ratioCheck = (
  availableReplicas: number,
  currentReplicas: number,
  desiredReplicas: number,
  syncedProxies: number
): Status => {
  /*
    NOT READY STATE
 */
  // User has scaled down a workload, then desired replicas will be 0 and it's not an error condition
  if (desiredReplicas === 0) {
    return NOT_READY;
  }

  /*
   DEGRADED STATE
  */
  // When a workload has available pods but less than desired defined by user it should be marked as degraded
  if (
    desiredReplicas > 0 &&
    currentReplicas > 0 &&
    availableReplicas > 0 &&
    (currentReplicas < desiredReplicas || availableReplicas < desiredReplicas)
  ) {
    return DEGRADED;
  }

  /*
     FAILURE STATE
  */
  // When availableReplicas is 0 but user has marked a desired > 0, that's an error condition
  if (desiredReplicas > 0 && availableReplicas === 0) {
    return FAILURE;
  }

  // Pending Pods means problems
  if (desiredReplicas === availableReplicas && availableReplicas !== currentReplicas) {
    return FAILURE;
  }

  // When there are proxies that are not sync, degrade
  if (syncedProxies >= 0 && syncedProxies < desiredReplicas) {
    return DEGRADED;
  }

  /*
     HEALTHY STATE
  */
  if (
    desiredReplicas === currentReplicas &&
    currentReplicas === availableReplicas &&
    availableReplicas === desiredReplicas
  ) {
    return HEALTHY;
  }

  // Other combination could mean a degraded situation
  return DEGRADED;
};

export const proxyStatusMessage = (syncedProxies: number, desiredReplicas: number): string => {
  let msg = '';
  if (syncedProxies < desiredReplicas) {
    const unsynced = desiredReplicas - syncedProxies;
    msg = ` (${unsynced} ${unsynced !== 1 ? 'proxies' : 'proxy'} unsynced)`;
  }
  return msg;
};

export const isProxyStatusSynced = (status: ProxyStatus): boolean => {
  return (
    isProxyStatusComponentSynced(status.CDS) &&
    isProxyStatusComponentSynced(status.EDS) &&
    isProxyStatusComponentSynced(status.LDS) &&
    isProxyStatusComponentSynced(status.RDS)
  );
};

export const isProxyStatusComponentSynced = (componentStatus: string): boolean => {
  return componentStatus === 'Synced';
};

export const mergeStatus = (s1: Status, s2: Status): Status => {
  return s1.priority > s2.priority ? s1 : s2;
};

export const ascendingThresholdCheck = (value: number, thresholds: Thresholds): ThresholdStatus => {
  if (value > 0) {
    if (value >= thresholds.failure) {
      return {
        value: value,
        status: FAILURE,
        violation: `${value.toFixed(2)}${thresholds.unit}>=${thresholds.failure}${thresholds.unit}`
      };
    } else if (value >= thresholds.degraded) {
      return {
        value: value,
        status: DEGRADED,
        violation: `${value.toFixed(2)}${thresholds.unit}>=${thresholds.degraded}${thresholds.unit}`
      };
    }
  }

  return { value: value, status: HEALTHY };
};

export const getRequestErrorsStatus = (ratio: number, tolerance?: ToleranceConfig): ThresholdStatus => {
  if (tolerance && ratio >= 0) {
    let thresholds = {
      degraded: tolerance.degraded,
      failure: tolerance.failure,
      unit: '%'
    };

    return ascendingThresholdCheck(100 * ratio, thresholds);
  }

  return {
    value: RATIO_NA,
    status: NA
  };
};

export const getRequestErrorsSubItem = (thresholdStatus: ThresholdStatus, prefix: string): HealthSubItem => {
  return {
    status: thresholdStatus.status,
    text: `${prefix}: ${thresholdStatus.status === NA ? 'No requests' : `${thresholdStatus.value.toFixed(2)}%`}`,
    value: thresholdStatus.status === NA ? 0 : thresholdStatus.value
  };
};

export abstract class Health {
  constructor(public health: HealthConfig) {}

  getGlobalStatus(): Status {
    return this.health.items.map(i => i.status).reduce((prev, cur) => mergeStatus(prev, cur), NA);
  }

  getStatusConfig(): ToleranceConfig | undefined {
    // Check if the config applied is the kiali defaults one
    const tolConfDefault = serverConfig.healthConfig.rate[serverConfig.healthConfig.rate.length - 1].tolerance;

    for (let tol of tolConfDefault) {
      // Check if the tolerance applied is one of kiali defaults
      if (this.health.statusConfig && tol === this.health.statusConfig.threshold) {
        // In the case is a kiali's default return undefined
        return undefined;
      }
    }

    // Otherwise return the threshold configuration that kiali used to calculate the status
    return this.health.statusConfig?.threshold;
  }

  getTrafficStatus(): HealthItem | undefined {
    for (let i = 0; i < this.health.items.length; i++) {
      const item = this.health.items[i];

      if (item.type === HealthItemType.TRAFFIC_STATUS) {
        return item;
      }
    }

    return undefined;
  }

  getWorkloadStatus(): HealthItem | undefined {
    for (let i = 0; i < this.health.items.length; i++) {
      const item = this.health.items[i];

      if (item.type === HealthItemType.POD_STATUS) {
        return item;
      }
    }

    return undefined;
  }
}

/**
 * Shows an example alert.
 *
 * @public
 */
export function useHealth() {
  const alertApi = useApi(alertApiRef);

  useEffect(() => {
    alertApi.post({ message: 'Hello World!' });
  }, [alertApi]);
}
