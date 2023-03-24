import { Callback, InitFunction } from './interface';
export declare const init: ({ is_debug }: InitFunction) => void;
export declare const log: (...data: any[]) => void;
export declare const post: (path: string, body: any, proceed: Callback) => void;
