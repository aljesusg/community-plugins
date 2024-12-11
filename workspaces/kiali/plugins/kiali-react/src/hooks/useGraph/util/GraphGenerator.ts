import {
    EdgeAnimationSpeed,
    EdgeModel,
    EdgeStyle,
    NodeModel,
  } from '@patternfly/react-topology';  
import { DecoratedGraphElements } from '../../../types/Graph';
import { getNodeShape, getNodeStatus, NodeData, EdgeData } from '../types';
import { assignEdgeHealth, setEdgeOptions } from './EdgeLabels';
import { setNodeLabel } from './NodeLabels';
import { ComputedServerConfig } from '@backstage-community/plugin-kiali-common';
  
  const DEFAULT_NODE_SIZE = 50;
  
  export const generateDataModel = (
    graphData: DecoratedGraphElements,
    graphSettings: any,
    config: ComputedServerConfig
  ): { edges: EdgeModel[]; nodes: NodeModel[] } => {
    const nodeMap: Map<string, NodeModel> = new Map<string, NodeModel>();
    const edges: EdgeModel[] = [];
  
    function addGroup(data: NodeData): NodeModel {
      const group: NodeModel = {
        children: [],
        collapsed: false,
        data: data,
        group: true,
        id: data.id,
        status: getNodeStatus(data),
        style: { padding: [35, 35, 35, 35] },
        type: 'group',
      };
      setNodeLabel(group, nodeMap, graphSettings);
      nodeMap.set(data.id, group);
  
      return group;
    }
  
    function addNode(data: NodeData): NodeModel {
      const node: NodeModel = {
        data: data,
        height: DEFAULT_NODE_SIZE,
        id: data.id,
        shape: getNodeShape(data),
        status: getNodeStatus(data),
        type: 'node',
        width: DEFAULT_NODE_SIZE,
      };
      setNodeLabel(node, nodeMap, graphSettings);
      nodeMap.set(data.id, node);
  
      return node;
    }
  
    function addEdge(data: EdgeData): EdgeModel {
      const edge: EdgeModel = {
        animationSpeed: EdgeAnimationSpeed.none,
        data: data,
        edgeStyle: EdgeStyle.solid,
        id: data.id,
        source: data.source,
        target: data.target,
        type: 'edge',
      };
      setEdgeOptions(edge, nodeMap, graphSettings);
      edges.push(edge);
  
      return edge;
    }
  
    function addChild(node: NodeModel): void {
      const parentId = (node.data as NodeData).parent!;
      const parent = nodeMap.get(parentId);
      if (parent) {
        parent.children?.push(node.id);
      }
    }
  
    graphData.nodes?.forEach(n => {
      const nd = n.data;
      let newNode: NodeModel;
      if (nd.isBox) {
        newNode = addGroup(nd as NodeData);
      } else {
        newNode = addNode(nd as NodeData);
      }
      if (nd.parent) {
        addChild(newNode);
      }
    });
    
    // Compute edge healths one time for the graph
    assignEdgeHealth(graphData.edges || [], nodeMap, graphSettings, config);
    graphData.edges?.forEach(e => {
      const ed = e.data;
      addEdge(ed as EdgeData);
    });
  
    const nodes = Array.from(nodeMap.values());
    return { nodes: nodes, edges: edges };
  };