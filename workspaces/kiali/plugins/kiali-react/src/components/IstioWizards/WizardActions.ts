export const WIZARD_TRAFFIC_SHIFTING = 'traffic_shifting';
export const WIZARD_TCP_TRAFFIC_SHIFTING = 'tcp_traffic_shifting';
export const WIZARD_REQUEST_ROUTING = 'request_routing';
export const WIZARD_FAULT_INJECTION = 'fault_injection';
export const WIZARD_REQUEST_TIMEOUTS = 'request_timeouts';

export const WIZARD_K8S_REQUEST_ROUTING = 'k8s_request_routing';

export const WIZARD_ENABLE_AUTO_INJECTION = 'enable_auto_injection';
export const WIZARD_DISABLE_AUTO_INJECTION = 'disable_auto_injection';
export const WIZARD_REMOVE_AUTO_INJECTION = 'remove_auto_injection';
export const WIZARD_EDIT_ANNOTATIONS = 'edit_annotations';


export const KIALI_WIZARD_LABEL = 'kiali_wizard';
export const KIALI_RELATED_LABEL = 'kiali_wizard_related';

// Wizard don't operate with EnvoyFilters so they can use the v1beta1 version
export const ISTIO_NETWORKING_VERSION = 'networking.istio.io/v1beta1';
export const ISTIO_SECURITY_VERSION = 'security.istio.io/v1beta1';
export const GATEWAY_NETWORKING_VERSION = 'gateway.networking.k8s.io/v1beta1';