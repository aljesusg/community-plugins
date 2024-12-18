import * as React from 'react';
import { SecondaryMasthead } from '../../Nav/SecondaryMasthead';
import { ToolbarDropdown } from '../../Dropdown/ToolbarDropdown';
import * as _ from 'lodash';
import { TimeDurationComponent } from '../../Time/TimeDurationComponent';
import { GraphTraffic } from './GraphTraffic';
import { style } from 'typestyle';
import { NamespaceDropdown } from '../../Dropdown/NamespaceDropdown';
import { GraphType, Namespace, TrafficRate } from '@backstage-community/plugin-kiali-common';

type GraphSecondaryMastheadProps = {
  disabled: boolean;  
  graphType: GraphType;
  isNodeGraph: boolean;
  onGraphTypeChange: (graphType: GraphType) => void;
  namespaces: Namespace[];
  activeNamespaces: Namespace[];
  setActiveNamespaces: (namespaces: Namespace[]) => void;
  clearAll: () => void;
  filter: string;
  setFilter: (filter: string) => void;
  trafficRates: TrafficRate[];
  setTrafficRates: (trafficRates: TrafficRate[]) => void;
};

const mastheadStyle = style({
  marginLeft: '-1.25rem',
  marginRight: '-2.5rem'
});

const leftSpacerStyle = style({
  marginLeft: '0.5rem'
});

const vrStyle = style({
  border: '1px inset',
  height: '1.25rem',
  margin: '0.25rem 0 0 0.5rem',
  width: '1px'
});

const rightToolbarStyle = style({
  float: 'right'
});

/**
 *  Key-value pair object representation of GraphType enum.  Values are human-readable versions of enum keys.
 *
 *  Example:  GraphType => {'APP': 'App', 'VERSIONED_APP': 'VersionedApp'}
 */
const GRAPH_TYPES = _.mapValues(GraphType, val => `${_.capitalize(_.startCase(val))} graph`);

export const GraphSecondaryMasthead: React.FC<GraphSecondaryMastheadProps> = (props: GraphSecondaryMastheadProps) => {
  const setGraphType = (type: string): void => {
    const graphType: GraphType = GraphType[type] as GraphType;
    if (props.graphType !== graphType) {
      props.onGraphTypeChange(graphType);
    }
  };

  const graphTypeKey = _.findKey(GraphType, val => val === props.graphType)!;

  return (
    <SecondaryMasthead>
      <div className={mastheadStyle}>
        <NamespaceDropdown 
          disabledNs={props.namespaces.length <= 1}
          {...props}
          />
        <span className={vrStyle} />
          <span className={leftSpacerStyle}>
            <GraphTraffic disabled={props.disabled} trafficRates={props.trafficRates} setTrafficRates={props.setTrafficRates} />
          </span>

        <span className={vrStyle} />
          <span className={leftSpacerStyle}>
            <ToolbarDropdown
              id={'graph_type_dropdown'}
              disabled={props.disabled || props.isNodeGraph}
              handleSelect={setGraphType}
              value={graphTypeKey}
              label={GRAPH_TYPES[graphTypeKey]}
              options={GRAPH_TYPES}
            />
          </span>
        <div className={rightToolbarStyle}>
            <TimeDurationComponent id="graph_time_range" disabled={props.disabled} supportsReplay={true} />
        </div>
      </div>
    </SecondaryMasthead>
  );
};
