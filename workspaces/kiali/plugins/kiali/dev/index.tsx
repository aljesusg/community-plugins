import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { kialiPlugin, KialiGraphCard } from '../src/plugin';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { bookinfoEntity } from './entities/bookinfo';

createDevApp()
  .registerPlugin(kialiPlugin)
  .addPage({
    element: 
      <EntityProvider entity={bookinfoEntity}>
        <KialiGraphCard />
      </EntityProvider> ,
    title: 'Kiali Graph',
    path: '/graph',
  })
  .render();
