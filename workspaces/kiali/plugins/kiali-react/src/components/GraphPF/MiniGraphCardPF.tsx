import * as React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from '@patternfly/react-core';
import { ServiceDetailsInfo } from '../../types/ServiceInfo';
import { GraphData, GraphPF } from './GraphPF';
import { EmptyGraphLayout } from '../CytoscapeGraph/EmptyGraphLayout';
import { EdgeMode, TimeInMilliseconds } from '@backstage-community/plugin-kiali-common';
import { GraphRefs } from './GraphPagePF';
import { Workload } from '../../types/Workload';
import { toRangeString } from '../Time/Utils';
import { KialiDagreGraph } from '../CytoscapeGraph/graphs';

type MiniGraphCardPropsPF = {
  data: GraphData;
  hideTimestamp?: boolean;
  title?: string;
};

type MiniGraphCardState = {
  graphRefs?: GraphRefs;
  isKebabOpen: boolean;
  isReady: boolean;
  isTimeOptionsOpen: boolean;
};

export class MiniGraphCardPF extends React.Component<MiniGraphCardPropsPF, MiniGraphCardState> {
  constructor(props: MiniGraphCardPropsPF) {
    super(props);
    this.state = {
      isReady: false,
      isKebabOpen: false,
      isTimeOptionsOpen: false
    };
  }

  render(): React.ReactNode {

    // The parent component supplies the datasource and the target element. Here we protect against a lifecycle issue where the two
    // can be out of sync. If so, just assume the parent is currently loading until it things get synchronized.
    const rangeEnd: TimeInMilliseconds = this.props.data.timestamp * 1000;
    const rangeStart: TimeInMilliseconds = rangeEnd - this.props.data.fetchParams.duration * 1000;

    const intervalTitle =
      rangeEnd > 0 ? toRangeString(rangeStart, rangeEnd, { second: '2-digit' }, { second: '2-digit' }) : 'Loading';

    return (
      <>
        <Card style={{ height: '100%' }} id={'MiniGraphCard'} data-test="mini-graph">
          <CardHeader>
            {this.props.title && (<CardTitle style={{ float: 'left' }}>{this.props.title}</CardTitle>) }
            {!this.props.hideTimestamp && (<CardTitle style={{ float: 'left' }}>{intervalTitle}</CardTitle>)}
          </CardHeader>

          <CardBody>
            <div id="pft-graph" style={{ height: '100%' }}>
              <EmptyGraphLayout
                elements={this.props.data.elements}
                isLoading={this.props.data.isLoading}
                isError={this.props.data.isError}
                isMiniGraph={true}
              >
                <GraphPF
                  edgeLabels={this.props.data.fetchParams.edgeLabels}
                  edgeMode={EdgeMode.ALL}
                  graphData={{
                    elements: this.props.data.elements,
                    elementsChanged: true,
                    errorMessage: !!this.props.data.errorMessage ? this.props.data.errorMessage : undefined,
                    isError: this.props.data.isError,
                    isLoading: this.props.data.isLoading,
                    fetchParams: this.props.data.fetchParams,
                    timestamp: this.props.data.timestamp
                  }}
                  isMiniGraph={true}
                  layout={KialiDagreGraph.getLayout()}
                  onReady={this.handleReady}
                  rankBy={[]}
                  setEdgeMode={() => {}}
                  setLayout={() => {}}
                  setRankResult={() => {}}
                  setUpdateTime={() => {}}
                  updateSummary={() => {}}
                  showLegend={false}
                  showRank={false}
                  showOutOfMesh={true}
                  showSecurity={true}
                  showTrafficAnimation={false}
                  showVirtualServices={true}
                />
              </EmptyGraphLayout>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }

  private handleReady = (refs: GraphRefs): void => {
    this.setState({ graphRefs: refs, isReady: true });
  };
}