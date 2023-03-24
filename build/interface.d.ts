export type Callback = (error: Error | string | any, result?: any) => void;
export interface InitContructor {
    is_debug: boolean;
    chatbox_secret_key: string;
}
