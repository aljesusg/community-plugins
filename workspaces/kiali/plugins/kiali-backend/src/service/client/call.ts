import { ResponseError } from '@backstage/errors';
import { RouterOptions } from "../router";
import fetch, { RequestInit } from "node-fetch";
import { Session } from './Auth/Session';

const https = require('https');
export const DEFAULT_HEADERS = { 'X-Auth-Type-Kiali-UI': '1' };

const getHeaders = () => {
    return {
        ...DEFAULT_HEADERS,
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
}

export const TIMEOUT_FETCH = 8000;

/*
    Method to make all the calls in kiali with session
*/
export const call = async<T>(options: RouterOptions, endpoint: string, session: Session | undefined = undefined, body: any = undefined, method: string = 'GET'): Promise<T> => {
    const { logger } = options;
    const kialiEndpoint = options.kialiConfig?.url
    const url = `${kialiEndpoint}${endpoint}`  
    const headers: HeadersInit = getHeaders()
    if (session) {
        headers['cookie'] = session.getCookie()
    }
    const requestInit: RequestInit = { timeout: TIMEOUT_FETCH, headers, body, method };  

    if (options.kialiConfig?.skipTLSVerify) {
        requestInit.agent = new https.Agent({
                rejectUnauthorized: false,
        });
    }
    logger.info(`Called to ${url} with skipTLSVerify to ${options.kialiConfig?.skipTLSVerify}`)
    const response = await fetch(url, requestInit)
    if (!response.ok) {
       throw await ResponseError.fromResponse(response);
    } 
    return response.json() as Promise<T>;    
}