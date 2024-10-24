
import { Entity } from '@backstage/catalog-model';
import {
  KIALI_NAMESPACE,
  KIALI_APP,
  KIALI_LABEL_SELECTOR_QUERY_ANNOTATION
} from '@backstage-community/plugin-kiali-common';

export function getAnnotationValuesFromEntity(entity: Entity): {
  namespaces: string[];
  app?: string;
  selector?: string;
} {
  const namespaces = getNamespaces(entity.metadata.annotations);
  const app = getApp(entity.metadata.annotations);
  const selector = getSelector(entity.metadata.annotations)

  if(namespaces) {
    return {
      namespaces,
      app,
      selector
    }
  }

  throw new Error('Expected "backstage.io/kiali" annotations were not found');
}

function getApp(annotations?: Record<string, string>): 
  string | undefined {
  const annotation = annotations?.[KIALI_APP];
  if (!annotation) {
    return undefined;
  }

  if(annotation !== '') {
    return annotation
  }

  throw new Error(
    `Invalid value for annotation "${KIALI_APP}"; expected format is: <app1>,<app2>... found: "${annotation}"`,
  );
}

function getSelector(annotations?: Record<string, string>): 
  string | undefined {
  const annotation = annotations?.[KIALI_LABEL_SELECTOR_QUERY_ANNOTATION];
  if (!annotation) {
    return undefined;
  }  

  throw new Error(
    `Invalid value for annotation "${KIALI_LABEL_SELECTOR_QUERY_ANNOTATION}"; expected format is: <resource>=<value>,<resource2>=<value>... found: "${annotation}"`,
  );
}

function getNamespaces(annotations?: Record<string, string>): 
  string[] {
  const annotation = annotations?.[KIALI_NAMESPACE];
  if (!annotation) {
    return [];
  }

  if(annotation !== '') {
    return annotation.split(',');
  }

  throw new Error(
    `Invalid value for annotation "${KIALI_NAMESPACE}"; expected format is: <ns1>,<ns2>... found: "${annotation}"`,
  );
}
