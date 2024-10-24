import { DecoratedGraphNodeData } from "@backstage-community/plugin-kiali-common";
import { Health } from "../useHealth/Health";

export interface DecoratedGraphNodeDataWithHealth extends DecoratedGraphNodeData {
    health: Health;
}