export const MILLISECONDS = 1000;
export const AUTH_KIALI_TOKEN = 'kiali-token-aes';

export const timeOutforWarningUser = 60 * MILLISECONDS;

export enum AuthStrategy {
  anonymous = 'anonymous',
  openshift = 'openshift',
  token = 'token',
  openid = 'openid',
  header = 'header',
}

export interface SessionInfo {
  username?: string;
  expiresOn?: string;
}

export interface AuthConfig {
  authorizationEndpoint?: string;
  logoutEndpoint?: string;
  logoutRedirect?: string;
  strategy?: AuthStrategy;
}

export type AuthInfo = {
  sessionInfo: SessionInfo;
} & AuthConfig;