import { Model, NodeModel } from '@patternfly/react-topology';

const graphConfig = {
    id: 'g1',
    type: 'graph',
    layout: 'Dagre',
  };

const nodes: NodeModel[] = {

}  

const edges: NodeModel[] = {

}  

export const graphModelExample: Model = {
    edges: nodes,
    nodes: edges,
    graph: graphConfig
}


