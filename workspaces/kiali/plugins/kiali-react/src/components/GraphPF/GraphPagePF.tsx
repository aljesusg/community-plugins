import * as React from 'react';
import FlexView from 'react-flexview';
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary';
import { GraphToolbar } from '../Graph/GraphToolbar/GraphToolbar';
import { EmptyGraphLayout } from '../../components/CytoscapeGraph/EmptyGraphLayout';
import { Badge, Chip } from '@patternfly/react-core';
import { JaegerTrace } from '../../types/TracingInfo';
import { ServiceDetailsInfo } from '../../types/ServiceInfo';
import { PeerAuthentication } from '../../types/IstioObjects';
import { GraphData } from '..//Graph/GraphPage';
import { GraphPF, FocusNode } from './GraphPF';
import { Controller } from '@patternfly/react-topology';
import { GraphLegendPF } from './GraphLegendPF';
import { DurationInSeconds, GraphEvent, IntervalInMilliseconds, Namespace, TimeInMilliseconds, TimeInSeconds,
  EdgeLabelMode,
  GraphDefinition,
  GraphType,
  Layout,
  NodeParamsType,
  NodeType,
  SummaryData,
  UNKNOWN,
  TrafficRate,
  RankMode,
  RankResult,
  EdgeMode,
  ComputedServerConfig
 } from '@backstage-community/plugin-kiali-common';
import { style } from 'typestyle';
import { PFColors } from '../Pf';
import { toRangeString } from '../Time/Utils';
import { arrayEquals } from '../../utils/Common';

// GraphURLPathProps holds path variable values.  Currently all path variables are relevant only to a node graph
export type GraphURLPathProps = {
  aggregate: string;
  aggregateValue: string;
  app: string;
  namespace: string;
  service: string;
  version: string;
  workload: string;
};

type ReduxDispatchProps = {
  onNamespaceChange: () => void;
  onReady: (controller: any) => void;
  setActiveNamespaces: (namespaces: Namespace[]) => void;
  setEdgeMode: (edgeMode: EdgeMode) => void;
  setGraphDefinition: (graphDefinition: GraphDefinition) => void;
  setLayout: (layout: Layout) => void;
  setNode: (node?: NodeParamsType) => void;
  setRankResult: (result: RankResult) => void;
  setTraceId: (traceId?: string) => void;
  setUpdateTime: (val: TimeInMilliseconds) => void;
  toggleIdleNodes: () => void;
  toggleLegend: () => void;
  updateSummary: (event: GraphEvent) => void;
};

export type GraphReduxStateProps = {
  graphData: GraphData;
  config: ComputedServerConfig;
  namespaces: Namespace[];
  activeNamespaces: Namespace[];
  boxByCluster: boolean;
  boxByNamespace: boolean;
  duration: DurationInSeconds; // current duration (dropdown) setting
  edgeLabels: EdgeLabelMode[];
  edgeMode: EdgeMode;
  findValue: string;
  graphType: GraphType;
  hideValue: string;
  isPageVisible: boolean;
  istioAPIEnabled: boolean;
  layout: Layout;
  mtlsEnabled: boolean;
  namespaceLayout: Layout;
  node?: NodeParamsType;
  rankBy: RankMode[];
  refreshInterval: IntervalInMilliseconds;
  replayActive: boolean;
  replayQueryTime: TimeInMilliseconds;
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
  summaryData: SummaryData | null;
  trace?: JaegerTrace;
  trafficRates: TrafficRate[];
  filter: string;
  setFilter: (filter: string) => void;
};
type ReduxProps = GraphReduxStateProps & ReduxDispatchProps;

export type GraphPagePropsPF = Partial<GraphURLPathProps> &
  ReduxProps & {
    lastRefreshAt: TimeInMilliseconds; // redux by way of ConnectRefresh
  };

// GraphRefs are passed back from the graph when it is ready, to allow for
// other components, or test code, to manipulate the graph programatically.
export type GraphRefs = {
  getController: () => Controller;
  setSelectedIds: (values: string[]) => void;
};

type WizardsData = {
  // Data (payload) sent to the wizard or the confirm delete dialog
  gateways: string[];
  k8sGateways: string[];
  namespace: string;
  peerAuthentications: PeerAuthentication[];
  serviceDetails?: ServiceDetailsInfo;
  // Wizard configuration
  showWizard: boolean;
  updateMode: boolean;
  wizardType: string;
};

const NUMBER_OF_DATAPOINTS = 30;

const containerStyle = style({
  minHeight: '350px',
  // TODO: try flexbox to remove this calc
  height: 'calc(100vh - 113px)' // View height minus top bar height minus secondary masthead
});

const graphContainerStyle = style({ flex: '1', minWidth: '350px', zIndex: 0, paddingRight: '5px' });
const graphWrapperDivStyle = style({ position: 'relative', backgroundColor: PFColors.BackgroundColor200 });

const graphTimeRange = style({
  position: 'absolute',
  top: '10px',
  left: '10px',
  width: 'auto',
  zIndex: 2
});

const replayBackground = style({
  backgroundColor: PFColors.Replay
});

const graphBackground = style({
  backgroundColor: PFColors.BackgroundColor100
});

const GraphErrorBoundaryFallback = (): React.ReactElement => {
  return (
    <div className={graphContainerStyle}>
      <EmptyGraphLayout
        isError={true}
        isMiniGraph={false}
        namespaces={[]}
        showIdleNodes={false}
        toggleIdleNodes={() => undefined}
      />
    </div>
  );
};

type GraphPageStatePF = {
  graphRefs?: GraphRefs;
  isReady: boolean;
};

export class GraphPagePF extends React.Component<GraphPagePropsPF, GraphPageStatePF> {
  private readonly errorBoundaryRef: any;
  private focusNode?: FocusNode;

  static getNodeParamsFromProps(props: Partial<GraphURLPathProps>): NodeParamsType | undefined {
    const aggregate = props.aggregate;
    const aggregateOk = aggregate && aggregate !== UNKNOWN;
    const aggregateValue = props.aggregateValue;
    const aggregateValueOk = aggregateValue && aggregateValue !== UNKNOWN;
    const app = props.app;
    const appOk = app && app !== UNKNOWN;
    const namespace = props.namespace;
    const namespaceOk = namespace && namespace !== UNKNOWN;
    const service = props.service;
    const serviceOk = service && service !== UNKNOWN;
    const workload = props.workload;
    const workloadOk = workload && workload !== UNKNOWN;
    if (!aggregateOk && !aggregateValueOk && !appOk && !namespaceOk && !serviceOk && !workloadOk) {
      // @ts-ignore
      return;
    }

    let nodeType: NodeType;
    let version: string | undefined;
    if (aggregateOk) {
      nodeType = NodeType.AGGREGATE;
      version = '';
    } else if (appOk || workloadOk) {
      nodeType = appOk ? NodeType.APP : NodeType.WORKLOAD;
      version = props.version;
    } else {
      nodeType = NodeType.SERVICE;
      version = '';
    }
    return {
      aggregate: aggregate!,
      aggregateValue: aggregateValue!,
      app: app!,
      cluster: getClusterName(),
      namespace: { name: namespace! },
      nodeType: nodeType,
      service: service!,
      version: version,
      workload: workload!
    };
  }

  static isNodeChanged(prevNode?: NodeParamsType, node?: NodeParamsType): boolean {
    if (prevNode === node) {
      return false;
    }
    if ((prevNode && !node) || (!prevNode && node)) {
      return true;
    }
    if (prevNode && node) {
      const nodeAggregateHasChanged =
        prevNode.aggregate !== node.aggregate || prevNode.aggregateValue !== node.aggregateValue;
      const nodeAppHasChanged = prevNode.app !== node.app;
      const nodeServiceHasChanged = prevNode.service !== node.service;
      const nodeVersionHasChanged = prevNode.version !== node.version;
      const nodeTypeHasChanged = prevNode.nodeType !== node.nodeType;
      const nodeWorkloadHasChanged = prevNode.workload !== node.workload;
      return (
        nodeAggregateHasChanged ||
        nodeAppHasChanged ||
        nodeServiceHasChanged ||
        nodeVersionHasChanged ||
        nodeWorkloadHasChanged ||
        nodeTypeHasChanged
      );
    }
    return false;
  }

  constructor(props: GraphPagePropsPF) {
    super(props);
    this.errorBoundaryRef = React.createRef();      
    this.state = {    
      isReady: false
    };  
  }

  componentDidMount(): void {
    // Connect to graph data source updates
    /*this.graphDataSource.on('loadStart', this.handleGraphDataSourceStart);
    this.graphDataSource.on('fetchError', this.handleGraphDataSourceError);
    this.graphDataSource.on('fetchSuccess', this.handleGraphDataSourceSuccess);
    this.graphDataSource.on('emptyNamespaces', this.handleGraphDataSourceEmpty);
    */
    // Let URL override current redux state at mount time.  We usually do this in
    // the constructor but it seems to work better here when the initial URL
    // is for a node graph.  When setting the node here it is available for the
    // loadGraphFromBackend() call.
    const urlNode = GraphPagePF.getNodeParamsFromProps(this.props);
    if (GraphPagePF.isNodeChanged(urlNode, this.props.node)) {
      // add the node namespace if necessary, but don't lose previously selected namespaces
      if (urlNode && !this.props.activeNamespaces.map(ns => ns.name).includes(urlNode.namespace.name)) {
        this.props.setActiveNamespaces([urlNode.namespace, ...this.props.activeNamespaces]);
      }
      this.props.setNode(urlNode);
    }

    // trace url info
    /*const urlTrace = getTraceId();
    if (urlTrace !== this.props.trace?.traceID) {
      this.props.setTraceId(urlTrace);
    }

    // layout url info
    const urlLayout = HistoryManager.getParam(URLParam.GRAPH_LAYOUT);
    if (urlLayout) {
      if (urlLayout !== this.props.layout.name) {
        this.props.setLayout(getLayoutByName(urlLayout));
      }
    } else {
      HistoryManager.setParam(URLParam.GRAPH_LAYOUT, this.props.layout.name);
    }*/

    // Ensure we initialize the graph. We wait for the toolbar to render and
    // ensure all redux props are updated with URL settings.
    // That in turn ensures the initial fetchParams are correct.
    setTimeout(() => this.loadGraphDataFromBackend(), 0);
  }

  componentDidUpdate(prev: GraphPagePropsPF): void {
    const curr = this.props;

    const activeNamespacesChanged = !arrayEquals(
      prev.activeNamespaces,
      curr.activeNamespaces,
      (n1, n2) => n1.name === n2.name
    );

    // Ensure we initialize the graph when there is a change to activeNamespaces.
    if (activeNamespacesChanged) {
      this.props.onNamespaceChange();
    }

    if (
      activeNamespacesChanged ||
      prev.boxByCluster !== curr.boxByCluster ||
      prev.boxByNamespace !== curr.boxByNamespace ||
      prev.duration !== curr.duration ||
      (prev.edgeLabels !== curr.edgeLabels && // test for edge labels that invoke graph gen appenders
        (curr.edgeLabels.includes(EdgeLabelMode.RESPONSE_TIME_GROUP) ||
          curr.edgeLabels.includes(EdgeLabelMode.THROUGHPUT_GROUP))) ||
      (prev.findValue !== curr.findValue && curr.findValue.includes('label:')) ||
      prev.graphType !== curr.graphType ||
      (prev.hideValue !== curr.hideValue && curr.hideValue.includes('label:')) ||
      (prev.lastRefreshAt !== curr.lastRefreshAt && curr.replayQueryTime === 0) ||
      (prev.replayActive !== curr.replayActive && !curr.replayActive) ||
      prev.replayQueryTime !== curr.replayQueryTime ||
      prev.showIdleEdges !== curr.showIdleEdges ||
      prev.showOperationNodes !== curr.showOperationNodes ||
      prev.showServiceNodes !== curr.showServiceNodes ||
      prev.showSecurity !== curr.showSecurity ||
      prev.showIdleNodes !== curr.showIdleNodes ||
      prev.showWaypoints !== curr.showWaypoints ||
      prev.trafficRates !== curr.trafficRates ||
      GraphPagePF.isNodeChanged(prev.node, curr.node)
    ) {
      this.loadGraphDataFromBackend();
    }

    if (
      prev.layout.name !== curr.layout.name ||
      prev.namespaceLayout.name !== curr.namespaceLayout.name ||
      activeNamespacesChanged
    ) {
      this.errorBoundaryRef.current.cleanError();
    }
  }

  componentWillUnmount(): void {
    // Disconnect from graph data source updates
    /*this.graphDataSource.removeListener('loadStart', this.handleGraphDataSourceStart);
    this.graphDataSource.removeListener('fetchError', this.handleGraphDataSourceError);
    this.graphDataSource.removeListener('fetchSuccess', this.handleGraphDataSourceSuccess);
    this.graphDataSource.removeListener('emptyNamespaces', this.handleGraphDataSourceEmpty);
    */
  }

  render(): React.ReactNode {
    let conStyle = containerStyle;   
    const isEmpty = !(
      this.props.graphData.elements.nodes && Object.keys(this.props.graphData.elements.nodes).length > 0
    );
    const isReady = !(isEmpty || this.props.graphData.isError);
    const isReplayReady = this.props.replayActive && !!this.props.replayQueryTime;

    return this.props.graphData && (
      <>
        <FlexView className={conStyle} column={true}>
          <div>
            <GraphToolbar
              controller={this.state.graphRefs?.getController()}
              config={this.props.config}
              disabled={this.props.graphData.isLoading}
              elementsChanged={this.props.graphData.elementsChanged}
              isPF={true}
              namespaces={this.props.namespaces}
              activeNamespaces={this.props.activeNamespaces}
              filter={this.props.filter}
              setFilter={this.props.setFilter}
              trafficRates={this.props.trafficRates}
              setTrafficRates={this.props.setTrafficRates}
            />
          </div>
          <FlexView grow={true} className={`${graphWrapperDivStyle}`}>
            <ErrorBoundary
              ref={this.errorBoundaryRef}
              onError={this.notifyError}
              fallBackComponent={<GraphErrorBoundaryFallback />}
            >
              {this.props.showLegend && <GraphLegendPF config={this.props.config} closeLegend={this.props.toggleLegend} />}
              {isReady && (
                <Chip
                  className={`${graphTimeRange} ${this.props.replayActive ? replayBackground : graphBackground}`}
                  isReadOnly={true}
                >
                  {this.props.replayActive && <Badge style={{ marginRight: '4px' }} isRead={true}>{`Replay`}</Badge>}
                  {!isReplayReady && this.props.replayActive && `click Play to start`}
                  {!isReplayReady && !this.props.replayActive && `${this.displayTimeRange()}`}
                  {isReplayReady && `${this.displayTimeRange()}`}
                </Chip>
              )}              
                <div id="pft-graph" className={graphContainerStyle}>
                  <EmptyGraphLayout
                    action={this.handleEmptyGraphAction}
                    elements={this.props.graphData.elements}
                    error={this.props.graphData.errorMessage}
                    isLoading={this.props.graphData.isLoading}
                    isError={!!this.props.graphData.isError}
                    isMiniGraph={false}
                    namespaces={this.props.graphData.fetchParams.namespaces}
                    showIdleNodes={this.props.showIdleNodes}
                    toggleIdleNodes={this.props.toggleIdleNodes}
                  >
                    <GraphPF
                      {...this.props}
                      focusNode={this.focusNode}
                      graphData={this.props.graphData}
                      isMiniGraph={false}
                      onReady={this.handleReady}
                    />
                  </EmptyGraphLayout>
                </div>              
            </ErrorBoundary>
           
          </FlexView>
        </FlexView>        
      </>
    );
  }

  /*
 {this.props.summaryData && (
              <SummaryPanel
                data={this.props.summaryData}
                duration={this.state.graphData.fetchParams.duration}
                graphType={this.props.graphType}
                injectServiceNodes={this.props.showServiceNodes}
                isPageVisible={this.props.isPageVisible}
                namespaces={this.props.activeNamespaces}
                onDeleteTrafficRouting={this.handleDeleteTrafficRouting}
                onFocus={this.onFocus}
                onLaunchWizard={this.handleLaunchWizard}
                queryTime={this.state.graphData.timestamp / 1000}
                trafficRates={this.props.trafficRates}
                {...computePrometheusRateParams(this.props.duration, NUMBER_OF_DATAPOINTS)}
              />
            )}
  */
  // TODO Focus...
  private onFocus = (focusNode: FocusNode): void => {
    console.debug(`onFocus(${focusNode})`);
  };

  private handleReady = (refs: GraphRefs): void => {
    this.setState({ graphRefs: refs, isReady: true });
  };

  private handleEmptyGraphAction = (): void => {
    this.loadGraphDataFromBackend();
  };

  private loadGraphDataFromBackend = (): void => {
    const queryTime: TimeInMilliseconds | undefined = !!this.props.replayQueryTime
      ? this.props.replayQueryTime
      : undefined;

   //
   console.log("Load graph")
  };

  private notifyError = (error: Error, _componentStack: string): void => {
    console.log(`There was an error when rendering the graph: ${error.message}, please try a different layout`);
  };

  private displayTimeRange = (): string => {
    const rangeEnd: TimeInMilliseconds = this.props.graphData.timestamp;
    const rangeStart: TimeInMilliseconds = rangeEnd - this.props.duration * 1000;

    return toRangeString(rangeStart, rangeEnd, { second: '2-digit' }, { second: '2-digit' });
  };
}