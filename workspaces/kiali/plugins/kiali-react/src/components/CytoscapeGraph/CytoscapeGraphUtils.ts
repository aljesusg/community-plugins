import * as Cy from 'cytoscape';
import { DecoratedGraphEdgeWrapper, DecoratedGraphElements, DecoratedGraphNodeData, DecoratedGraphNodeWrapper } from '../../types';


export const decoratedEdgeData = (ele: Cy.EdgeSingular): DecoratedGraphNodeData => {
  return ele.data();
};

export const decoratedNodeData = (ele: Cy.NodeSingular): DecoratedGraphNodeData => {
  return ele.data();
};

export const toSafeCyFieldName = (fieldName: string): string => {
  const alnumString = /^[a-zA-Z0-9]*$/;
  const unsafeChar = /[^a-zA-Z0-9]/g;

  if (fieldName.match(alnumString)) {
    return fieldName;
  }

  return fieldName.replace(unsafeChar, '_');
};

const nodeOrEdgeArrayHasSameIds = <T extends DecoratedGraphNodeWrapper | DecoratedGraphEdgeWrapper>(
  a: Array<T>,
  b: Array<T>
): boolean => {
  const aIds = a.map(e => e.data.id).sort();
  return b
    .map(e => e.data.id)
    .sort()
    .every((eId, index) => eId === aIds[index]);
};

// It is common that when updating the graph that the element topology (nodes, edges) remain the same,
// only their activity changes (rates, etc). When the topology remains the same we may be able to optimize
// some behavior.  This returns true if the topology changes, false otherwise.
// 1) Quickly compare the number of nodes and edges, if different return true.
// 2) Compare the ids
export const elementsChanged = (
  prevElements: DecoratedGraphElements,
  nextElements: DecoratedGraphElements
): boolean => {
  if (prevElements === nextElements) {
    return false;
  }

  if (
    !prevElements ||
    !nextElements ||
    !prevElements.nodes ||
    !prevElements.edges ||
    !nextElements.nodes ||
    !nextElements.edges ||
    prevElements.nodes.length !== nextElements.nodes.length ||
    prevElements.edges.length !== nextElements.edges.length
  ) {
    return true;
  }

  return !(
    nodeOrEdgeArrayHasSameIds(nextElements.nodes, prevElements.nodes) &&
    nodeOrEdgeArrayHasSameIds(nextElements.edges, prevElements.edges)
  );
};