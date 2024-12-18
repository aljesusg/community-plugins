import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { TestApiProvider } from '@backstage/test-utils';
import { GraphEntityCard, KialiConfig, MiniGraphEntityCard } from '../src';
import { mockEntity, mockEntityMultiple, mockEntityNoAnnotation } from './__mockData__/entity';
import { kialiApiRef } from '../src/apiRef';
import { MockKialiClient } from './MockAPI';
import config from './__mockData__/config.json';
import { ComputedServerConfig } from '@backstage-community/plugin-kiali-common';
import { Grid } from '@material-ui/core';

const TestComponent = (props: {children: React.ReactNode;}) => {
  return (
    <KialiConfig.Provider value={config as ComputedServerConfig}>
      <TestApiProvider apis={[[kialiApiRef, new MockKialiClient()]]}>
        {props.children}
      </TestApiProvider>
    </KialiConfig.Provider>
  )
}


const MiniGraphComponent = () => {
  return (
    <TestComponent>
      <Grid container spacing={3} alignItems="stretch">        
        <Grid item md={6}>
          <MiniGraphEntityCard entity={mockEntity} title={"Kiali Minigraph"}/>
        </Grid>
        <Grid item md={6}>
        <MiniGraphEntityCard entity={mockEntityNoAnnotation}  title={"Empty Graph"} hideTimestamp={false}/>
        </Grid>
        <Grid item md={6}>
        <MiniGraphEntityCard entity={mockEntity} title={"Timestamp hide"}  hideTimestamp={true}/>
        </Grid>
        <Grid item md={6}>
        <MiniGraphEntityCard entity={mockEntity} title={"Filtered with app"}/>
        </Grid>
        <Grid item md={12} xs={12} style={{height: "800px"}}>
          <MiniGraphEntityCard entity={mockEntity} title={"Bigger"}/>
        </Grid>
      </Grid>
    </TestComponent>    
  )
}

createDevApp()
      .addPage({
        element: <TestComponent><GraphEntityCard entity={mockEntity}/></TestComponent>,
        title: 'TrafficGraph',
        path: `/TrafficGraph`,
      })
      .addPage({
        element: <TestComponent><GraphEntityCard entity={mockEntityMultiple}/></TestComponent>,
        title: 'TrafficGraph Multiple Ns',
        path: `/TrafficGraphMultiple`,
      })
      .addPage({
        element: <MiniGraphComponent/>,
        title: 'MiniGraph',
        path: `/MiniGraph`,
      })
      .addPage({
        element: <TestComponent><GraphEntityCard entity={mockEntityNoAnnotation}/></TestComponent>,
        title: 'Empty Graph',
        path: `/EmptyGraph`,
      })
      .render();