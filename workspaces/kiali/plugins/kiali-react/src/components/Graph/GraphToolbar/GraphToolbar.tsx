import * as React from 'react';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { GraphSettings } from './GraphSettings';
import { HistoryManager, URLParam, location } from '../../../app/History';
import { namespacesFromString, namespacesToString } from '../../../types/Namespace';
import { GraphSecondaryMasthead } from './GraphSecondaryMasthead';
import { GraphFindPF } from './GraphFindPF';
import { Namespace, RankMode,  GraphType,
  NodeParamsType,
  EdgeLabelMode,
  SummaryData,
  TrafficRate,
  ComputedServerConfig, } from '@backstage-community/plugin-kiali-common';

type GraphToolbarProps = {
  controller?: any;
  cy?: any;
  disabled: boolean;
  elementsChanged: boolean;
  isPF?: boolean;
  onToggleHelp: () => void;
  activeNamespaces: Namespace[];
  namespaces: Namespace[];
  edgeLabels: EdgeLabelMode[];
  graphType: GraphType;
  kiosk: string;
  node?: NodeParamsType;
  rankBy: RankMode[];
  replayActive: boolean;
  showIdleNodes: boolean;
  summaryData: SummaryData | null;
  trafficRates: TrafficRate[];
  setActiveNamespaces: (activeNamespaces: Namespace[]) => void;
  setEdgeLabels: (edgeLabels: EdgeLabelMode[]) => void;
  setGraphType: (graphType: GraphType) => void;
  setIdleNodes: (idleNodes: boolean) => void;
  setNode: (node?: NodeParamsType) => void;
  setRankBy: (rankLabels: RankMode[]) => void;
  setTrafficRates: (rates: TrafficRate[]) => void;
  toggleReplayActive: () => void;
  clearAll: () => void;
  filter: string;
  setFilter: (filter: string) => void;
};

export class GraphToolbar extends React.PureComponent<GraphToolbarProps> {
  static contextTypes = {
    router: () => null
  };

  constructor(props: GraphToolbarProps) {
    super(props);
    // Let URL override current redux state at construction time. Update URL as needed.
   
  }

  render(): React.ReactNode {
    return (
      <>
        <GraphSecondaryMasthead
          disabled={this.props.disabled}
          graphType={this.props.graphType}
          isNodeGraph={!!this.props.node}
          onGraphTypeChange={this.props.setGraphType}
          activeNamespaces={this.props.activeNamespaces}
          setActiveNamespaces={this.props.setActiveNamespaces}
          namespaces={this.props.namespaces}
          clearAll={this.props.clearAll}
          setFilter={this.props.setFilter}
          filter={this.props.filter}
          trafficRates={this.props.trafficRates}
          setTrafficRates={this.props.setTrafficRates}
        />
       
             
      </>
    );
  }  
}

/*
 <Toolbar style={{ width: '100%' }}>
          <ToolbarGroup aria-label="graph settings" style={{ margin: 0, alignItems: 'flex-start' }}>         

            <ToolbarItem style={{ margin: 0 }}>
                <GraphSettings graphType={this.props.graphType} disabled={this.props.disabled} />
            </ToolbarItem>

            
              <ToolbarItem>
                <GraphFindPF controller={this.props.controller} elementsChanged={this.props.elementsChanged} />
              </ToolbarItem>          

          </ToolbarGroup>
            </Toolbar> 
            */