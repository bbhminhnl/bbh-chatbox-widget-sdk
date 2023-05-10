import { Callback, InitContructor, GetCustomerInfoCallback, GetConfigInput, SaveConfigInput } from './interface';
export declare class BbhChatboxWidget {
    private _is_debug;
    private _chatbox_secret_key;
    private _chatbox_widget_access_token?;
    private _is_chatbox_page_admin?;
    private _chatbot_public_token?;
    private _fb_client_id?;
    constructor(input: InitContructor);
    get chatbox_widget_access_token(): string | null | undefined;
    get is_chatbox_page_admin(): boolean | undefined;
    private _log;
    private _post_json;
    private _get_query_string;
    private _init_chatbox_widget_access_token;
    private _to_boolean;
    private _init_is_chatbox_page_admin;
    init(proceed: Callback): void;
    save_config(data: SaveConfigInput, proceed: Callback): void;
    delete_config(proceed: Callback): void;
    get_config(data: GetConfigInput, proceed: Callback): void;
    connect_widget_to_page_chatbox(token_partner: string, proceed: Callback): void;
    get_client_info(proceed: GetCustomerInfoCallback): void;
    send_message_to_client(data: any, proceed: Callback): void;
    proxy_request(uri: string, body: any, proceed: Callback): void;
}
