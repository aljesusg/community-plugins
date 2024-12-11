import { EdgeLabelMode, GraphType, Namespace, TrafficRate } from '@backstage-community/plugin-kiali-common';

export type GraphPFSettings = {
  activeNamespaces: Namespace[];
  edgeLabels: EdgeLabelMode[];
  graphType: GraphType;
  showOutOfMesh: boolean;
  showSecurity: boolean;
  showVirtualServices: boolean;
  trafficRates: TrafficRate[];
};