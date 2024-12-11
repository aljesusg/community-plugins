import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { GraphData, GraphEntityCard } from '../src';


const MockGraphData: GraphData = {
  elements: { edges: [], nodes: [] },
  elementsChanged: false,
  isLoading: true,
  timestamp: 0
}

createDevApp()
    .addPage({
        element: <GraphEntityCard graphData={MockGraphData}/>,
        title: 'TrafficGraph',
        path: `/TrafficGraph`,
      })
      .render();