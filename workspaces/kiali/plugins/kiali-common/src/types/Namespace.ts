export interface Namespace {
    name: string;
    cluster?: string;
    isAmbient?: boolean;
    labels?: { [key: string]: string };
  }