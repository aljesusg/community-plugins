import {
  ComponentFactory,
  DefaultGroup,
  GraphComponent,
  ModelKind,
  withPanZoom,
  withSelection,
} from '@patternfly/react-topology';
import { StyleEdge } from '../styles/styleEdge';
import { StyleNode } from '../styles/styleNode';

export const KialiComponentFactory: ComponentFactory = (
  kind: ModelKind,
  type: string,
) => {
  switch (type) {
    case 'group':
      return DefaultGroup;
    default:
      switch (kind) {
        case ModelKind.graph:
          return withPanZoom()(GraphComponent);
        case ModelKind.node:
          return StyleNode as any;
        case ModelKind.edge:
          return withSelection({ multiSelect: false, controlled: false })(
            StyleEdge as any,
          );
        default:
          return undefined;
      }
  }
};
