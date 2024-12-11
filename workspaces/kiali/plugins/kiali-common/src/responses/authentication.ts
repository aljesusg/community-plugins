import { AuthInfo, ServerConfig, StatusState } from "../types";

export interface ErrorAuth {
    message: string;
}

export interface BSAuthenticate {
    status?: StatusState;
    serverConfig?: ServerConfig;
    authInfo?: AuthInfo;
    errorAuth?: ErrorAuth;
}