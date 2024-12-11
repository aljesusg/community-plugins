import { EdgeLabelMode, EdgeMode, GraphDefinition, GraphType, Layout, NodeParamsType, RankMode, RankResult, SummaryData, TimeInMilliseconds, TrafficRate } from "@backstage-community/plugin-kiali-common";

export interface GraphToolbarState {
    // Toggle props
    boxByCluster: boolean;
    boxByNamespace: boolean;
    // dropdown props
    edgeLabels: EdgeLabelMode[];
    // find props
    findValue: string;
    graphType: GraphType;
    hideValue: string;
    rankBy: RankMode[];
    showFindHelp: boolean;
    showIdleEdges: boolean;
    showIdleNodes: boolean;
    showLegend: boolean;
    showOperationNodes: boolean;
    showOutOfMesh: boolean;
    showRank: boolean;
    showSecurity: boolean;
    showServiceNodes: boolean;
    showTrafficAnimation: boolean;
    showVirtualServices: boolean;
    showWaypoints: boolean;
    trafficRates: TrafficRate[];
  }

export interface GraphState {
    edgeMode: EdgeMode;
    graphDefinition: GraphDefinition | null; // Not for consumption. Only for "Debug" dialog.
    layout: Layout;
    namespaceLayout: Layout;
    node?: NodeParamsType;
    rankResult: RankResult;
    summaryData: SummaryData | null;
    toolbarState: GraphToolbarState;
    updateTime: TimeInMilliseconds;
  }