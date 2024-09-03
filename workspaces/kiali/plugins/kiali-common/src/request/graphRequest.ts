import { BackstageRequest } from "./request";

export type graphRequest = BackstageRequest & {
    query: string;
    
}