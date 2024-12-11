// Node Shapes
import workloadImage from '../../assets/img/graph/pf/node.svg';
import appImage from '../../assets/img/graph/pf/app.svg';
import serviceImage from '../../assets/img/graph/pf/service.svg';
import operationImage from '../../assets/img/graph/pf/operation.svg';
import serviceEntryImage from '../../assets/img/graph/pf/service-entry.svg';
// Node Colors
import nodeColorHealthyImage from '../../assets/img/graph/pf/node-color-healthy.svg';
import nodeColorWarningImage from '../../assets/img/graph/pf/node-color-warning.svg';
import nodeColorDangerImage from '../../assets/img/graph/pf/node-color-danger.svg';
import nodeColorIdleImage from '../../assets/img/graph/pf/node-color-idle.svg';
// Node Background
import externalNamespaceImage from '../../assets/img/graph/external-namespace.svg';
import restrictedNamespaceImage from '../../assets/img/graph/restricted-namespace.svg';
// Edges
import edgeSuccessImage from '../../assets/img/graph/pf/edge-success.svg';
import edgeDangerImage from '../../assets/img/graph/pf/edge-danger.svg';
import edgeWarnImage from '../../assets/img/graph/pf/edge-warn.svg';
import edgeIdlemage from '../../assets/img/graph/pf/edge-idle.svg';
import edgeTcpImage from '../../assets/img/graph/pf/edge-tcp.svg';
import edgeMtlsImage from '../../assets/img/graph/mtls-badge.svg';
// Traffic Animation
import trafficHealthyImage from '../../assets/img/graph/pf/traffic-healthy-request.svg';
import trafficFailedImage from '../../assets/img/graph/pf/traffic-failed-request.svg';
import trafficTcpImage from '../../assets/img/graph/pf/traffic-tcp.svg';
// Badges
import badgeCircuitBreakerImage from '../../assets/img/graph/node-badge-circuit-breaker.svg';
import badgeFaultInjectionImage from '../../assets/img/graph/node-badge-fault-injection.svg';
import badgeGatewaysImage from '../../assets/img/graph/node-badge-gateways.svg';
import badgeMirroringImage from '../../assets/img/graph/node-badge-mirroring.svg';
import badgeMissingSidecarImage from '../../assets/img/graph/node-badge-missing-sidecar.svg';
import badgeRequestTimeoutImage from '../../assets/img/graph/node-badge-request-timeout.svg';
import badgeTrafficShiftingSourceImage from '../../assets/img/graph/node-badge-traffic-shifting.svg';
import badgeTrafficSourceImage from '../../assets/img/graph/node-badge-traffic-source.svg';
import badgeVirtualServicesImage from '../../assets/img/graph/node-badge-virtual-services.svg';
import badgeWorkloadEntryImage from '../../assets/img/graph/node-badge-workload-entry.svg';
import badgeWaypointImage from '../../assets/img/graph/node-badge-waypoint.svg';
import { ComputedServerConfig } from '@backstage-community/plugin-kiali-common';

export interface GraphLegendItem {
  data: GraphLegendItemRow[];
  isBadge?: boolean;
  title: string;
}

export interface GraphLegendItemRow {
  icon: string;
  label: string;
}

export const legendData = (serverConfig: ComputedServerConfig): GraphLegendItem[] => {
  const nodeBadges = [
    { label: ('Circuit Breaker'), icon: badgeCircuitBreakerImage },
    { label: ('Fault Injection'), icon: badgeFaultInjectionImage },
    { label: ('Gateway'), icon: badgeGatewaysImage },
    { label: ('Mirroring'), icon: badgeMirroringImage },
    { label: ('Missing Sidecar'), icon: badgeMissingSidecarImage },
    { label: ('Request Timeout'), icon: badgeRequestTimeoutImage },
    { label: ('Traffic Shifting / TCP Traffic Shifting'), icon: badgeTrafficShiftingSourceImage },
    { label: ('Traffic Source'), icon: badgeTrafficSourceImage },
    { label: ('Virtual Service / Request Routing'), icon: badgeVirtualServicesImage },
    { label: ('Workload Entry'), icon: badgeWorkloadEntryImage }
  ];

  if (serverConfig.ambientEnabled) {
    nodeBadges.push({ label: ('Waypoint'), icon: badgeWaypointImage });
  }

  return [
    {
      title: ('Node Shapes'),
      data: [
        { label: ('Workload'), icon: workloadImage },
        { label: ('App'), icon: appImage },
        { label: ('Operation'), icon: operationImage },
        { label: ('Service'), icon: serviceImage },
        { label: ('Service Entry'), icon: serviceEntryImage }
      ]
    },
    {
      title: ('Node Colors'),
      data: [
        { label: ('Healthy'), icon: nodeColorHealthyImage },
        { label: ('Warn'), icon: nodeColorWarningImage },
        { label: ('Unhealthy'), icon: nodeColorDangerImage },
        { label: ('Idle'), icon: nodeColorIdleImage }
      ]
    },
    {
      title: ('Node Background'),
      data: [
        { label: ('Unselected Namespace'), icon: externalNamespaceImage },
        { label: ('Restricted / External'), icon: restrictedNamespaceImage }
      ]
    },
    {
      title: ('Edges'),
      data: [
        { label: ('Failure'), icon: edgeDangerImage },
        { label: ('Degraded'), icon: edgeWarnImage },
        { label: ('Healthy'), icon: edgeSuccessImage },
        { label: ('TCP Connection'), icon: edgeTcpImage },
        { label: ('Idle'), icon: edgeIdlemage },
        { label: ('mTLS (badge)'), icon: edgeMtlsImage }
      ]
    },
    {
      title: ('Traffic Animation'),
      data: [
        { label: ('Healthy Request'), icon: trafficHealthyImage },
        { label: ('Failed Request'), icon: trafficFailedImage },
        { label: ('TCP Traffic'), icon: trafficTcpImage }
      ]
    },
    {
      title: ('Node Badges'),
      isBadge: true,
      data: nodeBadges
    }
  ];
};
