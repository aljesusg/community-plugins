import { LoggerService } from "@backstage/backend-plugin-api";
import { Session } from "./Session";
import { call } from "../call";
import { RouterOptions } from "../../router";
import { BSAuthenticate, ServerConfig, StatusState } from "@backstage-community/plugin-kiali-common";
import { configEndpoint, statusEndpoint } from "../kialiEndpoints";

export class Authentication {
    private readonly logger: LoggerService;
    private routerOpt: RouterOptions;
    private session: Session;

    constructor(rotOpt: RouterOptions) {
        this.routerOpt = rotOpt;
        this.logger = rotOpt.logger;
        this.session = new Session(rotOpt);
    }

    getKialiStatus = async(options: RouterOptions): Promise<StatusState> =>  {
        return await call<StatusState>(options, statusEndpoint)        
    }

    getKialiConfig = async(options: RouterOptions): Promise<ServerConfig> =>  {
        return await call<ServerConfig>(options, configEndpoint)        
    }

    login = async(): Promise<BSAuthenticate> => {        
        const authResponse: BSAuthenticate = { }
        try {
            const authInfo = await this.session.shouldRelogin(this.routerOpt)                       
            const status = await call<StatusState>(this.routerOpt, statusEndpoint, this.session)
            const serverConfig = await call<ServerConfig>(this.routerOpt, configEndpoint, this.session)
            authResponse.authInfo = authInfo
            authResponse.status = status
            authResponse.serverConfig = serverConfig
        } catch(err) {
            this.logger.warn(`Kiali error login : ${err}`)
            authResponse.errorAuth
        }
        return Promise.resolve(authResponse)        
    }
}