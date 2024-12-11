import { defaultMetricsDuration, BoundsInMilliseconds, DurationInSeconds, TimeRange } from "@backstage-community/plugin-kiali-common";

// InstanceType is either an App, Workload, or Service. It represents one of the three
// different pages that Kiali shows lists for other than Istio config.
export enum InstanceType {
  App = 'app',
  Service = 'service',
  Workload = 'workload'
}

// Type-guarding TimeRange: executes first callback when range is a duration, or second callback when it's a bounded range, mapping to a value
export function guardTimeRange<T>(
  range: TimeRange,
  ifDuration: (d: DurationInSeconds) => T,
  ifBounded: (b: BoundsInMilliseconds) => T
): T {
  if (range.from) {
    const b: BoundsInMilliseconds = {
      from: range.from
    };
    if (range.to) {
      b.to = range.to;
    }
    return ifBounded(b);
  } else {
    if (range.rangeDuration) {
      return ifDuration(range.rangeDuration);
    }
  }
  // It shouldn't reach here a TimeRange should have DurationInSeconds or BoundsInMilliseconds
  return ifDuration(defaultMetricsDuration);
}

export const durationToBounds = (duration: DurationInSeconds): BoundsInMilliseconds => {
  return {
    from: new Date().getTime() - duration * 1000
  };
};

export const evalTimeRange = (range: TimeRange): [Date, Date] => {
  const bounds = guardTimeRange(range, durationToBounds, b => b);
  return [bounds.from ? new Date(bounds.from) : new Date(), bounds.to ? new Date(bounds.to) : new Date()];
};

export const boundsToDuration = (bounds: BoundsInMilliseconds): DurationInSeconds => {
  return Math.floor(((bounds.to || new Date().getTime()) - (bounds.from || new Date().getTime())) / 1000);
};

export const isEqualTimeRange = (t1: TimeRange, t2: TimeRange): boolean => {
  if (t1.from && t2.from && t1.from !== t2.from) {
    return false;
  }
  if (t1.to && t2.to && t1.to !== t2.to) {
    return false;
  }
  if (t1.rangeDuration && t2.rangeDuration && t1.rangeDuration !== t2.rangeDuration) {
    return false;
  }
  return true;
};
