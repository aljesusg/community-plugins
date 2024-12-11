export type AppenderString = string;
export type TimeInSeconds = number;
export type DurationInSeconds = number;

export const defaultMetricsDuration: DurationInSeconds = 600;

export type UserName = string;
export type Password = string;
export type RawDate = string;

export type KioskMode = string;

export enum HTTP_VERBS {
  DELETE = 'DELETE',
  GET = 'get',
  PATCH = 'patch',
  POST = 'post',
  PUT = 'put'
}

export const PF_THEME_DARK = 'pf-theme-dark';
export const KIALI_THEME = 'kiali-theme';

export const enum Theme {
  LIGHT = 'Light',
  DARK = 'Dark'
}

export type TargetKind = 'app' | 'service' | 'workload';

export const MILLISECONDS = 1000;

export const UNIT_TIME = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 24 * 3600
};

export type TimeInMilliseconds = number;
export type IntervalInMilliseconds = number;

export type BoundsInMilliseconds = {
  from?: TimeInMilliseconds;
  to?: TimeInMilliseconds;
};

// Redux doesn't work well with type composition
export type TimeRange = {
  from?: TimeInMilliseconds;
  to?: TimeInMilliseconds;
  rangeDuration?: DurationInSeconds;
};