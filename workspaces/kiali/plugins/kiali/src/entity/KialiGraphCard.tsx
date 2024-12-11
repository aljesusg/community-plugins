/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { GraphEntityCard, KialiConfig, MiniGraphEntityCard } from '@backstage-community/plugin-kiali-react';
import { useEntity } from '@backstage/plugin-catalog-react';
import '@patternfly/patternfly/patternfly.css';
import { useConfig } from '@backstage-community/plugin-kiali-react/src/hooks/useConfig';

/**
 * Props for {@link KialiGraphCard}.
 *
 * @public
 */
export interface KialiGraphCardProps {
  isMiniGraph?: boolean;
}

export const KialiGraphCard = (props: KialiGraphCardProps) => {
  const { entity } = useEntity();
  const { config, loading, error } = useConfig()
  
  return config && !error && !loading && (
    <>
      <KialiConfig.Provider value={config}>
        {props.isMiniGraph? (
          <MiniGraphEntityCard entity={entity}/>         
        ):(
          <GraphEntityCard entity={entity}/> 
        )}       
      </KialiConfig.Provider>
    </>    
  ) 
}

