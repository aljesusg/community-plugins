export type TracingQuery = {
    startMicros: number;
    endMicros?: number;
    tags?: string;
    limit?: number;
    minDuration?: number;
};
  
export type Tag = {
    key: string;
    type: string;
    value: any;
};

export type Span = {
    traceID: string;
    spanID: string;
    operationName: string;
    startTime: number;
    duration: number;
    tags: Tag[];
    warnings?: string[];
    traceSize: number;
};

export const TEMPO = 'tempo';
  