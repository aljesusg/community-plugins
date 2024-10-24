import { AppenderString } from "../../../kiali-react/src/types/Common";
import { GraphType } from "../types";
import { BackstageRequest } from "./request";

export interface GraphElementsQuery {
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