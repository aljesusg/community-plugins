/***/
/**
 * Common functionalities for the kiali plugin.
 *
 * @packageDocumentation
 */
export { KialiApiClientProxy as KialiApiClient } from './client/client';
export type { KialiApi } from './client/client';
export * from './types';
export * from './request';
export * from './response';
export * from './constants';
export { pluginId } from './pluginId';