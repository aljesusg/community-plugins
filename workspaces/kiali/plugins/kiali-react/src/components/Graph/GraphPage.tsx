import { TimeInMilliseconds } from "@backstage-community/plugin-kiali-common";
import { DecoratedGraphElements } from "../../types";
import { FetchParams } from "../../services/GraphDataSource";

export type GraphData = {
    elements: DecoratedGraphElements;
    elementsChanged: boolean; // true if current elements differ from previous fetch, can be used as an optimization.
    errorMessage?: string;
    fetchParams: FetchParams;
    isError?: boolean;
    isLoading: boolean;
    timestamp: TimeInMilliseconds;
  };