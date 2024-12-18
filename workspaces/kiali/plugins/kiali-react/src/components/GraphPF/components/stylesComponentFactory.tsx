import {
  ComponentFactory,
  GraphComponent,
  ModelKind,
  withPanZoom,
} from '@patternfly/react-topology';
import { StyleEdge } from '../styles/styleEdge';
import { StyleNode } from '../styles/styleNode';
import { StyleGroup } from '../styles/styleGroup';

export const stylesComponentFactory: ComponentFactory = (
  kind: ModelKind,
  type: string,
) => {

  switch (kind) {
    case ModelKind.edge:
      return StyleEdge as any;
    case ModelKind.graph:
      return withPanZoom()(GraphComponent);      
    case ModelKind.node: {
      return (type === 'group' ? StyleGroup : StyleNode) as any;
    }
    default:
      return undefined;
  }  
};
