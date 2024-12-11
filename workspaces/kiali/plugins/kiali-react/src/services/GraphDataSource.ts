import { AppenderString, ComputedServerConfig, defaultServerConfig, DurationInSeconds, TimeInMilliseconds, TimeInSeconds } from '@backstage-community/plugin-kiali-common';
import {
  EdgeLabelMode,
  GraphDefinition,
  GraphElements,
  GraphType,
  BoxByType,
  NodeParamsType,
  NodeType,
  TrafficRate,
  DefaultTrafficRates,
  GraphElementsQuery,
  Namespace
} from '@backstage-community/plugin-kiali-common';
import { decorateGraphData } from '../store/Selectors/GraphData';
import EventEmitter from 'eventemitter3';
import { createSelector } from 'reselect';
import { isMC } from '../config/ServerConfig';
import { DecoratedGraphElements } from '../types';

export const EMPTY_GRAPH_DATA = { nodes: [], edges: [] };
const PROMISE_KEY = 'CURRENT_REQUEST';

// GraphDataSource allows us to have multiple graphs in play, which functionally allows us to maintain
// the master graph page as well as to offer mini-graphs in the detail pages.
//
// GraphDataSource (GDS) emits events asynchronously and has the potential to disrupt the expected
// react+redux workflow typical of our components.  To avoid unexpected results here are some
// [anti-]patterns for using GraphDataSource:
//   - Do not set up GDS callbacks in nested components.  It is better to process the callbacks in the
//     top-level component and then update props (via react or redux) and let the lower components update normally.
//       - if A embeds B, do not have callbacks for the same GDS in A and B, just A
//   - Avoid accessing GDS fields to access fetch information (elements, timestamps, fetchParameters, etc).  In
//     short, the fields are volatile and can change at unexpected times.
//       - Instead, in the callbacks save what you need to local variables or properties.  Then use them to
//         trigger react/redux state changes normally.
//   - Avoid passing a GDS as a property.
//       - The only reason to do this is for an embedded component to access the GDS fields directly, which is
//         an anti-pattern explained above.  Having said that, if you are SURE the GDS is stable, it will work
//         (at this writing we still do this for mini-graphs).

export interface FetchParams {
  boxByCluster?: boolean;
  boxByNamespace?: boolean;
  duration: DurationInSeconds;
  edgeLabels: EdgeLabelMode[];
  graphType: GraphType;
  includeHealth: boolean;
  includeLabels: boolean;
  injectServiceNodes: boolean;
  namespaces: Namespace[];
  node?: NodeParamsType;
  queryTime?: TimeInMilliseconds; // default now
  showIdleEdges: boolean;
  showIdleNodes: boolean;
  showOperationNodes: boolean;
  showSecurity: boolean;
  showWaypoints: boolean;
  trafficRates: TrafficRate[];
}