import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { kialiApiRef } from '../../apiRef';
import { Model } from '@patternfly/react-topology';
import { EdgeLabelMode, GraphDefinition, GraphType, TrafficRate } from '@backstage-community/plugin-kiali-common';
import { decorateGraphData } from './util/GraphDecorator';
import { generateDataModel } from './util/GraphGenerator';
import { getAnnotationValuesFromEntity } from '../../utils';

const graphConfig = {
    id: 'g1',
    type: 'graph',
    layout: 'Dagre',
  };

/**
 * Shows an example alert.
 *
 * @public
 */
export const useGraph = (entity: Entity, istioNs: string): {
  dataGraph?: Model;
  loading: boolean;
  error?: Error;
} => {
    const kialiApi = useApi(kialiApiRef);
    const { namespaces, app, selector } = getAnnotationValuesFromEntity(entity);
    const graphQueryElements = {
      appenders: 'health,deadNode,istio,serviceEntry,meshCheck,workloadEntry',
      activeNamespaces: namespaces.join(','),
      namespaces: namespaces.join(','),
      graphType: GraphType.VERSIONED_APP,
      injectServiceNodes: true,
      boxByNamespace: true,
      boxByCluster: true,
      showOutOfMesh: false,
      showSecurity: false,
      showVirtualServices: false,
      edgeLabels: [
        EdgeLabelMode.TRAFFIC_RATE,
        EdgeLabelMode.TRAFFIC_DISTRIBUTION,
      ],
      trafficRates: [
        TrafficRate.HTTP_REQUEST,
        TrafficRate.GRPC_TOTAL,
        TrafficRate.TCP_TOTAL,
      ],
    };    
 
    return useAsync(async() => {
      const entityRef = stringifyEntityRef(entity);           
      const response = await kialiApi.getGraphElements({params: graphQueryElements, entityRef: entityRef})      
      const payload = await response.json();   
      const graphData = decorateGraphData(payload.elements, payload.duration, istioNs);
      const g = generateDataModel(graphData, graphQueryElements);      
      return {
          nodes: g.nodes,
          edges: g.edges,
          graph: graphConfig,
      }        
    }, []);   
  }