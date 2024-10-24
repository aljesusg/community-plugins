
import React, { Dispatch, useEffect, useState } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useGraph, useLoadKiali } from '@backstage-community/plugin-kiali-react';
import {
  Progress,
  ResponseErrorPanel
} from '@backstage/core-components';
import {  } from '@backstage-community/plugin-kiali-react/src/hooks/useLoad';
export const GraphCard = () => {
  const { entity } = useEntity();
    
  const { dataGraph, loading, error } = useGraph(entity, 'istio-system')
  
  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }
  return (
    <>
    {dataGraph.toString()}
    </>
  );
};
