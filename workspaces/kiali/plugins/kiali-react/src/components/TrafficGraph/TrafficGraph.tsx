import React from 'react';
import { Model, TopologyView, VisualizationProvider, VisualizationSurface } from '@patternfly/react-topology';

export const TrafficGraph = (props: {model: Model}) => {
    return (
        <TopologyView>
            <VisualizationProvider>
                <VisualizationSurface state={props.model}/>
            </VisualizationProvider>
        </TopologyView>
    )
}