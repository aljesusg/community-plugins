import { useApi } from '@backstage/core-plugin-api';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';
import useInterval from 'react-use/esm/useInterval';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { kialiApiRef } from '../../apiRef';
import { AppenderString, BoxByType, ComputedServerConfig, EdgeLabelMode, GraphDefinition, GraphElementsQuery, GraphType, TrafficRate } from '@backstage-community/plugin-kiali-common';
import { decorateGraphData } from './util/GraphDecorator';
import { getAnnotationValuesFromEntity } from '../../utils';
import { useCallback, useContext } from 'react';
import { GraphData } from '../../components/GraphPF/GraphPF';
import { KialiConfig } from '../KialiConfig';
import { EMPTY_GRAPH_DATA, FetchParams } from '../../services/GraphDataSource';
import { isMC } from '../../config';
import { DecoratedGraphElements } from '../../types';
import { elementsChanged } from '../../components/CytoscapeGraph/CytoscapeGraphUtils';

/**
 * Fetch Graph Component
 */

export const initialStateGraphData: GraphData = {
  elements: { edges: [], nodes: [] },
  elementsChanged: false,
  isLoading: true,
  timestamp: 0
}

const getGraphQuery = (fetchParams: FetchParams, serverConfig: ComputedServerConfig):  GraphElementsQuery => {
  const restParams: GraphElementsQuery = {
    duration: `${fetchParams.duration}s`,
    graphType: fetchParams.graphType,
    includeIdleEdges: fetchParams.showIdleEdges,
    injectServiceNodes: fetchParams.injectServiceNodes
  };

  const boxBy: string[] = [];

  if (fetchParams.boxByCluster) {
    boxBy.push(BoxByType.CLUSTER);
  }

  if (fetchParams.boxByNamespace) {
    boxBy.push(BoxByType.NAMESPACE);
  }

  if (fetchParams.graphType === GraphType.APP || fetchParams.graphType === GraphType.VERSIONED_APP) {
    boxBy.push(BoxByType.APP);
  }

  if (boxBy.length > 0) {
    restParams.boxBy = boxBy.join(',');
  }

  if (fetchParams.queryTime) {
    restParams.queryTime = String(Math.floor(fetchParams.queryTime / 1000));
  }

   // Some appenders are expensive so only specify an appender if needed.
   let appenders: AppenderString = 'deadNode,istio,serviceEntry,meshCheck,workloadEntry';

   if (fetchParams.includeHealth) {
     appenders += ',health';
   }

   if (fetchParams.showOperationNodes) {
     appenders += ',aggregateNode';
   }

   if (!fetchParams.node && fetchParams.showIdleNodes) {
     // note we only use the idleNode appender if this is NOT a drilled-in node graph and
     // the user specifically requests to see idle nodes.
     appenders += ',idleNode';
   }

   if (serverConfig.ambientEnabled) {
     appenders += ',ambient';
     restParams.waypoints = fetchParams.showWaypoints;
   }

   if (fetchParams.includeLabels) {
     appenders += ',labeler';
   }

   if (fetchParams.showSecurity) {
     appenders += ',securityPolicy';
   }

   fetchParams.edgeLabels.forEach(edgeLabel => {
     switch (edgeLabel) {
       case EdgeLabelMode.RESPONSE_TIME_AVERAGE:
         appenders += ',responseTime';
         restParams.responseTime = 'avg';
         break;
       case EdgeLabelMode.RESPONSE_TIME_P50:
         appenders += ',responseTime';
         restParams.responseTime = '50';
         break;
       case EdgeLabelMode.RESPONSE_TIME_P95:
         appenders += ',responseTime';
         restParams.responseTime = '95';
         break;
       case EdgeLabelMode.RESPONSE_TIME_P99:
         appenders += ',responseTime';
         restParams.responseTime = '99';
         break;
       case EdgeLabelMode.THROUGHPUT_REQUEST:
         appenders += ',throughput';
         restParams.throughputType = 'request';
         break;
       case EdgeLabelMode.THROUGHPUT_RESPONSE:
         appenders += ',throughput';
         restParams.throughputType = 'response';
         break;
       case EdgeLabelMode.TRAFFIC_DISTRIBUTION:
       case EdgeLabelMode.TRAFFIC_RATE:
       default:
         break;
     }
   });

   restParams.ambientTraffic = 'none';
   restParams.appenders = appenders;
   restParams.rateGrpc = 'none';
   restParams.rateHttp = 'none';
   restParams.rateTcp = 'none';

   fetchParams.trafficRates.forEach(trafficRate => {
     switch (trafficRate) {
       case TrafficRate.AMBIENT_TOTAL:
         restParams.ambientTraffic = 'total';
         break;
       case TrafficRate.AMBIENT_WAYPOINT:
         restParams.ambientTraffic = 'waypoint';
         break;
       case TrafficRate.AMBIENT_ZTUNNEL:
         restParams.ambientTraffic = 'ztunnel';
         break;
       case TrafficRate.GRPC_RECEIVED:
         restParams.rateGrpc = 'received';
         break;
       case TrafficRate.GRPC_REQUEST:
         restParams.rateGrpc = 'requests';
         break;
       case TrafficRate.GRPC_SENT:
         restParams.rateGrpc = 'sent';
         break;
       case TrafficRate.GRPC_TOTAL:
         restParams.rateGrpc = 'total';
         break;
       case TrafficRate.HTTP_REQUEST:
         restParams.rateHttp = 'requests';
         break;
       case TrafficRate.TCP_RECEIVED:
         restParams.rateTcp = 'received';
         break;
       case TrafficRate.TCP_SENT:
         restParams.rateTcp = 'sent';
         break;
       case TrafficRate.TCP_TOTAL:
         restParams.rateTcp = 'total';
         break;
       default:
         break;
     }
   });
   if (!serverConfig.ambientEnabled) {
     restParams.ambientTraffic = 'none';
   }  

  return restParams
}

export const useGraph = (entity: Entity, prevGraphData: DecoratedGraphElements, fetchParams: FetchParams,intervalMs: number = 10000): { data: GraphData} => {
  console.log("Loading Graph")
  console.log(fetchParams)
  if (fetchParams.namespaces.length === 0) {
    return {data: {
      elements: EMPTY_GRAPH_DATA,
      elementsChanged: false,
      fetchParams: fetchParams,
      isLoading: false,
      isError: false,
      timestamp: 0        
    }}
  }
  const config = useContext(KialiConfig);
  const restParams = getGraphQuery(fetchParams, config)

  let cluster: string | undefined;

  if (fetchParams.node?.cluster && isMC(config)) {
    cluster = fetchParams.node.cluster;
  }


  // Need to make the request for node
  
  const kialiApi = useApi(kialiApiRef);  
  const { namespaces, app, selector } = getAnnotationValuesFromEntity(entity);     
  restParams.namespaces = namespaces.join(',')

  const getGraph = useCallback(async (): Promise<GraphDefinition> => {        
    const entityRef = stringifyEntityRef(entity);
    const response = await kialiApi.getGraphElements({params: restParams, entityRef: entityRef})      
    let payload = await response.json(); 
    return {
        elements: payload.elements? payload.elements : EMPTY_GRAPH_DATA,
        timestamp: payload.timestamp? payload.timestamp : 0,
        duration: payload.duration? payload.duration : 0,
        graphType: fetchParams.graphType      
    }    
  }, [entity, kialiApi, fetchParams])

  const { value, loading, error, retry } = useAsyncRetry(
    () => getGraph(),
    [getGraph],
  );

  useInterval(() => retry(), intervalMs);

  const decoratedElements = decorateGraphData(value?.elements || EMPTY_GRAPH_DATA, config, value?.duration || 0)
  return {data: {
    elements: decoratedElements,
    timestamp: value?.timestamp || 0,
    isLoading: loading,
    fetchParams: fetchParams,
    elementsChanged: elementsChanged(prevGraphData, decoratedElements),
    isError: error? true: false,
    errorMessage: error?.message    
    }
  }

}
