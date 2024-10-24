import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { TrafficCard } from '../src/backstage/TrafficCard';

createDevApp()
  .addPage({
    element: 
        <TrafficCard/> ,
    title: 'Kiali Graph',
    path: '/graph',
  })
  .render();
