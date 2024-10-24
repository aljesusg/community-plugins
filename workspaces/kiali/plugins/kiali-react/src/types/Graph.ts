import { GraphEdgeData, GraphNodeData, Responses, ValidProtocols } from "@backstage-community/plugin-kiali-common";
import { Health } from "./Health";

// Node data after decorating at fetch-time (what is mainly used by ui code)
export interface DecoratedGraphNodeData extends GraphNodeData {
  grpcIn: number;
  grpcInErr: number;
  grpcInNoResponse: number;
  grpcOut: number;
  health: Health;
  healthStatus: string; // status name
  httpIn: number;
  httpIn3xx: number;
  httpIn4xx: number;
  httpIn5xx: number;
  httpInNoResponse: number;
  httpOut: number;
  tcpIn: number;
  tcpOut: number;

  traffic: never;

  // computed values...

  // true if has istio namespace
  isIstio?: boolean;
  // assigned when node ranking is enabled. relative importance from most to least important [1..100]. Multiple nodes can have same rank.
  rank?: number;
}

// Edge data after decorating at fetch-time (what is mainly used by ui code)
export interface DecoratedGraphEdgeData extends GraphEdgeData {
  grpc: number;
  grpcErr: number;
  grpcNoResponse: number;
  grpcPercentErr: number;
  grpcPercentReq: number;
  http: number;
  http3xx: number;
  http4xx: number;
  http5xx: number;
  httpNoResponse: number;
  httpPercentErr: number;
  httpPercentReq: number;
  protocol: ValidProtocols;
  responses: Responses;
  tcp: number;

  // During the decoration process, we make non-optional some number attributes (giving them a default value)
  // computed, true if traffic rate > 0
  hasTraffic?: boolean;
  // Default value -1
  isMTLS: number;
  // Default value NaN
  responseTime: number;
  // Default value NaN
  throughput: number;

  // computed values...

  // assigned when graph is updated, the edge health depends on the node health, traffic, and config
  healthStatus?: string; // status name
}

export interface DecoratedGraphNodeWrapper {
  data: DecoratedGraphNodeData;
}

export interface DecoratedGraphEdgeWrapper {
  data: DecoratedGraphEdgeData;
}

export interface DecoratedGraphElements {
  nodes?: DecoratedGraphNodeWrapper[];
  edges?: DecoratedGraphEdgeWrapper[];
}