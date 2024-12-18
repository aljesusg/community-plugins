import { ComputedServerConfig, GraphDefinition, GraphElementsRequest, KialiApi } from '@backstage-community/plugin-kiali-common';
import { Entity } from '@backstage/catalog-model';
import { TypedResponse } from '@backstage-community/plugin-kiali-common/src/client';
import { kialiData } from './__mockData__';


function createMockResponse(
  body: any,
  status: number = 200,
  statusText: string = 'OK'
): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    headers: {
      get: (headerName: string) => {
        if (headerName === 'content-type') {
          return 'application/json'
        }
        return null
      },
    },
    json: async () => body,
  } as unknown as Response
}


export class MockKialiClient implements KialiApi {
  private entity?: Entity;

  constructor() {
    this.entity = undefined;
  }

  async getGraphElements(request: GraphElementsRequest): Promise<TypedResponse<GraphDefinition>> {
    if(request.params.namespaces && kialiData['graph'].hasOwnProperty(request.params.namespaces)) {
      return createMockResponse(kialiData['graph'][request.params.namespaces]['graph'])
    }
    return createMockResponse(kialiData['graph']['empty'])
  }

  async getConfig(): Promise<TypedResponse<ComputedServerConfig>> {
    return createMockResponse(kialiData.config);
  }
}