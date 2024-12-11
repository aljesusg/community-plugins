import { AppenderString, ComputedServerConfig, GraphDefinition, GraphType } from "../types";
import { BackstageRequest } from "./request";

export interface GraphElementsQuery {
    ambientTraffic?: string;
    appenders?: AppenderString;
    boxBy?: string;
    duration?: string;
    graphType?: GraphType;
    includeIdleEdges?: boolean;
    injectServiceNodes?: boolean;
    namespaces?: string;
    queryTime?: string;
    rateGrpc?: string;
    rateHttp?: string;
    rateTcp?: string;
    responseTime?: string;
    throughputType?: string;
    waypoints?: boolean;
  }

export type GraphElementsRequest = BackstageRequest & {
    params: GraphElementsQuery    
}