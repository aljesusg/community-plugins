import { DurationInSeconds } from "./Common";
import { MeshCluster } from "./Mesh";


export type IstioLabelKey =
| 'ambientWaypointLabel'
| 'ambientWaypointLabelValue'
| 'appLabelName'
| 'versionLabelName'
| 'injectionLabelName'
| 'injectionLabelRev';

interface DeploymentConfig {
  viewOnlyMode: boolean;
}

interface IstioAnnotations {
  ambientAnnotation: string;
  ambientAnnotationEnabled: string;
  // this could also be the name of the pod label, both label and annotation are supported
  istioInjectionAnnotation: string;
}

interface GraphFindOption {
  autoSelect: boolean;
  description: string;
  expression: string;
}

interface GraphTraffic {
  ambient: string;
  grpc: string;
  http: string;
  tcp: string;
}

interface GraphSettings {
  animation: 'point' | 'dash';
  fontLabel: number;
  minFontBadge: number;
  minFontLabel: number;
}

interface GraphUIDefaults {
  findOptions: GraphFindOption[];
  hideOptions: GraphFindOption[];
  impl: 'both' | 'cy' | 'pf';
  settings: GraphSettings;
  traffic: GraphTraffic;
}

interface ListUIDefaults {
  includeHealth: boolean;
  includeIstioResources: boolean;
  includeValidations: boolean;
  showIncludeToggles: boolean;
}

interface UIDefaults {
  graph: GraphUIDefaults;
  list: ListUIDefaults;
  metricsPerRefresh?: string;
  namespaces?: string[];
  refreshInterval?: string;
}

interface CertificatesInformationIndicators {
  enabled: boolean;
}

interface KialiFeatureFlags {
  certificatesInformationIndicators: CertificatesInformationIndicators;
  disabledFeatures: string[];
  istioInjectionAction: boolean;
  istioAnnotationAction: boolean;
  istioUpgradeAction: boolean;
  uiDefaults: UIDefaults;
}

// Not based exactly on Kiali configuration but rather whether things like prometheus config
// allow for certain Kiali features. True means the feature is crippled, false means supported.
export interface KialiCrippledFeatures {
  requestSize: boolean;
  requestSizeAverage: boolean;
  requestSizePercentiles: boolean;
  responseSize: boolean;
  responseSizeAverage: boolean;
  responseSizePercentiles: boolean;
  responseTime: boolean;
  responseTimeAverage: boolean;
  responseTimePercentiles: boolean;
}

interface IstioCanaryRevision {
  current: string;
  upgrade: string;
}

/*
 Health Config
*/
export type RegexConfig = string | RegExp;

// rateHealthConfig
export interface RateHealthConfig {
  namespace?: RegexConfig;
  kind?: RegexConfig;
  name?: RegexConfig;
  tolerance: ToleranceConfig[];
}

export interface HealthConfig {
  rate: RateHealthConfig[];
}
// toleranceConfig
export interface ToleranceConfig {
  code: RegexConfig;
  degraded: number;
  failure: number;
  protocol?: RegexConfig;
  direction?: RegexConfig;
}

export interface ServerConfig {
    accessibleNamespaces: Array<string>;
    ambientEnabled: boolean;
    authStrategy: string;
    clusters: { [key: string]: MeshCluster };
    deployment: DeploymentConfig;
    gatewayAPIEnabled: boolean;
    healthConfig: HealthConfig;
    installationTag?: string;
    istioAnnotations: IstioAnnotations;
    istioCanaryRevision: IstioCanaryRevision;
    istioIdentityDomain: string;
    istioNamespace: string;
    istioLabels: { [key in IstioLabelKey]: string };
    kialiFeatureFlags: KialiFeatureFlags;
    logLevel: string;
    prometheus: {
      globalScrapeInterval?: DurationInSeconds;
      storageTsdbRetention?: DurationInSeconds;
    };
  }

export type Durations = { [key: number]: string };

export type ComputedServerConfig = ServerConfig & {
  durations: Durations;
};

export const defaultServerConfig: ComputedServerConfig = {
  accessibleNamespaces: [],
  ambientEnabled: false,
  authStrategy: '',
  clusters: {},
  durations: {},
  gatewayAPIEnabled: false,
  logLevel: '',
  healthConfig: {
    rate: [],
  },
  deployment: {
    viewOnlyMode: false,
  },
  installationTag: 'Kiali Console',
  istioAnnotations: {
    ambientAnnotation: 'ambient.istio.io/redirection',
    ambientAnnotationEnabled: 'enabled',
    istioInjectionAnnotation: 'sidecar.istio.io/inject',
  },
  istioCanaryRevision: {
    current: '',
    upgrade: '',
  },
  istioIdentityDomain: 'svc.cluster.local',
  istioNamespace: 'istio-system',
  istioLabels: {
    ambientWaypointLabel: 'gateway.istio.io/managed',
    ambientWaypointLabelValue: 'istio.io-mesh-controller',
    appLabelName: 'app',
    injectionLabelName: 'istio-injection',
    injectionLabelRev: 'istio.io/rev',
    versionLabelName: 'version',
  },
  kialiFeatureFlags: {
    certificatesInformationIndicators: {
      enabled: true,
    },
    disabledFeatures: [],
    istioInjectionAction: true,
    istioAnnotationAction: true,
    istioUpgradeAction: false,
    uiDefaults: {
      graph: {
        findOptions: [],
        hideOptions: [],
        impl: 'cy',
        settings: {
          animation: 'point',
          fontLabel: 13,
          minFontBadge: 7,
          minFontLabel: 10,
        },
        traffic: {
          grpc: 'requests',
          http: 'requests',
          tcp: 'sent',
        },
      },
      list: {
        includeHealth: true,
        includeIstioResources: true,
        includeValidations: true,
        showIncludeToggles: false,
      },
    },
  },
  prometheus: {
    globalScrapeInterval: 15,
    storageTsdbRetention: 21600,
  },
};