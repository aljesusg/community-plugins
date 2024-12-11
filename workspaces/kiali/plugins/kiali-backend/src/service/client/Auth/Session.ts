import moment from 'moment';
import { LoggerService } from "@backstage/backend-plugin-api";
import { AuthInfo, SessionInfo } from "@backstage-community/plugin-kiali-common";
import { TIMEOUT_FETCH, call } from '../call';
import { authInfoEndpoint, loginEndpoint } from '../kialiEndpoints';
import { RouterOptions } from '../../router';
import fetch, { RequestInit } from "node-fetch";
const https = require('https');

export const MILLISECONDS = 1000;
export const timeOutforWarningUser = 60 * MILLISECONDS;
export const AUTH_KIALI_TOKEN = 'kiali-token-aes';

export class Session {
    protected cookie: string;
    protected auth: AuthInfo;
    private readonly logger: LoggerService;
    private readonly sessionMilliSeconds: number;

    constructor(options: RouterOptions) {
      const KD = options.kialiConfig
        this.sessionMilliSeconds = KD && KD.sessionTime
          ? KD.sessionTime * MILLISECONDS
          : timeOutforWarningUser;
        this.logger = options.logger
        this.auth = {
          sessionInfo: { expiresOn: '', username: 'anonymous' },
        };
        this.cookie = '';
    }
    getCookie = () => {
        return this.cookie;
      };
    /*
    Store Auth Information
    */
    private setAuthInfo = (auth: AuthInfo) => {
        this.auth = auth;
    };
    /*
    Store session
    */
   private setSession = (session: SessionInfo) => {
        this.auth.sessionInfo = session;
    };
    /*
        Calculate the time feft until the session expires
    */
  private timeLeft = (): number => {
    const expiresOn = moment(this.auth.sessionInfo.expiresOn);
    if (expiresOn <= moment()) {
      return -1;
    }
    return expiresOn.diff(moment());
  };
  /*
    Set cookie
  */
    private setKialiCookie = (rawCookie: string | null) => {
      if (rawCookie && rawCookie !== '') {
        const kCookie = rawCookie
          .split(';')
          .filter(n => n.split('=')[0].trim() === AUTH_KIALI_TOKEN);
        this.cookie = kCookie.length > 0 ? kCookie[0].trim() : '';
      } else {
        this.cookie = '';
      }
    };
  /*
    Make login
  */  
 private login = async(options: RouterOptions): Promise<AuthInfo> => {
      const requestInit: RequestInit = { timeout: TIMEOUT_FETCH };
      const params = new URLSearchParams();
      params.append('token',  options.kialiConfig?.serviceAccountToken || '')
      requestInit.body = params;
      requestInit.method = 'post';
      const kialiEndpoint = options.kialiConfig?.url
      const url = `${kialiEndpoint}${loginEndpoint}`  
      if (options.kialiConfig?.skipTLSVerify) {
        requestInit.agent = new https.Agent({
                rejectUnauthorized: false,
        });
      }  
      await fetch(url, requestInit).then(
        resp => {
          const session = resp.json() as SessionInfo
          this.logger.info(`Kiali Login by user ${session.username}`)
          this.setSession(session);
          this.setKialiCookie(resp.headers.get('set-cookie'));
          
        }
      ).catch(
        err => Promise.reject(`Failed login in Kiali ${err}`)
      )

      return Promise.resolve(this.auth);
 }
  /*
    Check if user should relogin due the timeLeft
  */
  shouldRelogin = async(options: RouterOptions): Promise<AuthInfo> => {
    if (this.cookie === '') {
        // No session stored
        const authInfo = await call<AuthInfo>(options, authInfoEndpoint);        
        this.setAuthInfo(authInfo)        
        // Anonymous strategy not required login
        if(authInfo.strategy === 'anonymous') {
            return Promise.resolve(authInfo)
        }
        // Need login
        return this.login(options);        
    } 

    const timeLeft = this.timeLeft();
    if (timeLeft <= 0 || timeLeft < this.sessionMilliSeconds) {
      return this.login(options);   
    }

    return Promise.resolve(this.auth)
  };
}