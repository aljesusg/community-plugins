/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { Entity } from '@backstage/catalog-model';
import React, { useContext } from 'react';
import { style } from 'typestyle';
import { GraphData, GraphPF } from '../components/GraphPF/GraphPF';
import { KialiDagreGraph } from '../components/CytoscapeGraph/graphs/KialiDagreGraph';
import { DefaultTrafficRates, DurationInSeconds, EdgeMode, GraphEvent, GraphType, Layout, NodeType, RankResult, TimeInMilliseconds, TrafficRate, UNIT_TIME } from '@backstage-community/plugin-kiali-common';
import { GraphState } from '../store/Store';
import { Controller } from '@patternfly/react-topology';
import { KialiConfig, useGraph } from '../hooks';
import { useConfig } from '../hooks/useConfig';
import { initialStateGraphData } from '../hooks/useGraph/useGraph';
import { FetchParams } from '../services/GraphDataSource';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { toRangeString } from '../components/Time/Utils';
import FlexView from 'react-flexview';
import { EmptyGraphLayout } from '../components/CytoscapeGraph/EmptyGraphLayout';
/**
 * Props for {@link TrafficGraph}.
 *
 * @public
 */
export interface GraphEntityCardProps {
  entity: Entity;
}
/**
 * Graph Style
 */

const graphStyle = style({
  height: '93%',
});

const containerStyle = style({
  minHeight: '350px',
  // TODO: try flexbox to remove this calc
  height: 'calc(100vh - 113px)' // View height minus top bar height minus secondary masthead
});


const initialGraphState: GraphState = {
  edgeMode: EdgeMode.ALL,
  graphDefinition: null,
  layout: KialiDagreGraph.getLayout(),
  namespaceLayout: KialiDagreGraph.getLayout(),
  node: undefined,
  rankResult: {
    upperBound: 0
  },
  summaryData: null,
  toolbarState: {
    boxByCluster: true,
    boxByNamespace: true,
    edgeLabels: [],
    findValue: '',
    graphType: GraphType.VERSIONED_APP,
    hideValue: '',
    rankBy: [],
    showFindHelp: false,
    showIdleEdges: false,
    showIdleNodes: false,
    showLegend: false,
    showOutOfMesh: true,
    showOperationNodes: false,
    showRank: false,
    showSecurity: false,
    showServiceNodes: true,
    showTrafficAnimation: false,
    showVirtualServices: true,
    showWaypoints: false,
    trafficRates: [
      TrafficRate.AMBIENT_GROUP,
      TrafficRate.AMBIENT_TOTAL,
      TrafficRate.GRPC_GROUP,
      TrafficRate.GRPC_REQUEST,
      TrafficRate.HTTP_GROUP,
      TrafficRate.HTTP_REQUEST,
      TrafficRate.TCP_GROUP,
      TrafficRate.TCP_SENT
    ]
  },
  updateTime: 0
}

export type GraphRefs = {
  getController: () => Controller;
  setSelectedIds: (values: string[]) => void;
};

const defaultFetchParams = (duration: DurationInSeconds, namespace: string): FetchParams => {
  // queryTime defaults to server's 'now', leave unset
  return {
    boxByCluster: false, // not the main graph default, the helpers are for detail graphs
    boxByNamespace: false, // not the main graph default, the helpers are for detail graphs
    duration: duration,
    edgeLabels: [],
    graphType: GraphType.WORKLOAD,
    includeHealth: true,
    includeLabels: false,
    injectServiceNodes: true,
    namespaces: [{ name: namespace }],
    node: {
      app: '',
      namespace: { name: namespace },
      nodeType: NodeType.UNKNOWN,
      service: '',
      version: '',
      workload: ''
    },
    showIdleEdges: false,
    showIdleNodes: false,
    showOperationNodes: false,
    showSecurity: false,
    showWaypoints: true,
    trafficRates: DefaultTrafficRates
  };
}

/**
 * Displays Graph.
 *
 * @remarks
 *
 * Longer descriptions should be put after the `@remarks` tag. That way the initial summary
 * will show up in the API docs overview section, while the longer description will only be
 * displayed on the page for the specific API.
 *
 * @public
 */
export function MiniGraphEntityCard(props: GraphEntityCardProps) {
  const [graphData, setGraphData] = React.useState<GraphData>(initialStateGraphData)
  const [duration, setDuration] = React.useState<DurationInSeconds>(UNIT_TIME.MINUTE)
  const [fetchParams, setFetchParams] = React.useState<FetchParams>(defaultFetchParams(UNIT_TIME.MINUTE, ''))
  const [graphRefs, setGraphRefs] = React.useState<GraphRefs>()
  const [graphState, setGraphState] = React.useState<GraphState>(initialGraphState)
  const [isReady, setIsReady] = React.useState<boolean>(false)
  const { data } = useGraph(props.entity,graphData.elements, fetchParams, 1000000)
  if (data.isLoading) {
    console.log("Loading")
  } else {    
    if (!data.isError) {      
      console.log(data.elements)      
      const isEmpty = !(
        data.elements.nodes && Object.keys(data.elements.nodes).length > 0
      );
    } else {
      console.log(data.errorMessage)
    }
  }

  const handleReady = (refs: GraphRefs): void => {
    setGraphRefs(refs)
    setIsReady(true)
  }

  const rangeEnd: TimeInMilliseconds = data.timestamp * 1000;
  const rangeStart: TimeInMilliseconds = rangeEnd - fetchParams.duration * 1000;

  const intervalTitle =
    rangeEnd > 0 ? toRangeString(rangeStart, rangeEnd, { second: '2-digit' }, { second: '2-digit' }) : 'Loading';

  return (
    <Card style={{ marginBottom: 20, height: 500 }}>
      <CardHeader title="Kiali Graph" />
      <CardContent style={{marginBottom: '20px'}}>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>{intervalTitle}</Typography>
        <div id="pft-graph" style={{ height: '100%' }}>
          <EmptyGraphLayout
            elements={data.elements}
            isLoading={data.isLoading}
            isError={data.isError!}
            isMiniGraph={true}
          >
            <GraphPF
                  edgeLabels={graphState.toolbarState.edgeLabels}
                  edgeMode={EdgeMode.ALL}
                  graphData={data}
                  isMiniGraph={true}
                  layout={KialiDagreGraph.getLayout()} 
                  onReady={handleReady}
                  rankBy={[]}
                  setEdgeMode={(edgeMode: EdgeMode) => setGraphState((previous) => ({...previous, edgeMode}))}
                  setLayout={(layout: Layout) => setGraphState((previous) => ({...previous, layout}))}
                  setRankResult={() => {}}
                  setUpdateTime={(updateTime: TimeInMilliseconds) => setGraphState((previous) => ({...previous, updateTime}))} 
                  updateSummary={(graphEvent: GraphEvent) => setGraphState((previous) => ({...previous, summaryData: {
                    isPF: graphEvent.isPF,
                    summaryTarget: graphEvent.summaryTarget,
                    summaryType: graphEvent.summaryType
                  }}))}     
                  showLegend={false}
                  showRank={false}
                  showOutOfMesh={true}
                  showSecurity={true}
                  showTrafficAnimation={false}
                  showVirtualServices={true}
                />
          </EmptyGraphLayout>
        </div>        
      </CardContent>      
    </Card>    
  );
}