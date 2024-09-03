import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { kialiPlugin, KialiGraphCard } from '../src/plugin';

createDevApp()
  .registerPlugin(kialiPlugin)
  .addPage({
    element: <KialiGraphCard />,
    title: 'Kiali Graph',
    path: '/graph',
  })
  .render();
