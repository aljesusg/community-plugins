import { DecoratedGraphNodeData } from "../../types";
import { Health } from "../../types/Health";


export interface DecoratedGraphNodeDataWithHealth extends DecoratedGraphNodeData {
    health: Health;
}