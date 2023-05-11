type MyError = Error | string | any;
type TypeConfig = 'CRM';
export type Callback = (error: MyError, result?: any) => void;
export interface InitContructor {
    is_debug: boolean;
    chatbox_secret_key: string;
}
export interface CustomerInfo {
    public_profile: {
        fb_page_id: string;
        fb_client_id: string;
        page_name?: string;
        client_name?: string;
        token_partner: string;
        current_staff_id: string;
        current_staff_name: string;
        conversation_id: string;
        page_id: string;
        conversation_index: number;
    };
    conversation_contact?: {
        client_phone?: string;
        client_email?: string;
    };
    conversation_message?: {
        last_read_message: string;
        last_message_time: number;
        last_message: string;
        last_message_type: string;
        platform_type: string;
    };
    conversation_label?: {
        label_id: string[];
        snap_label: {
            type: string;
            text_color: string;
            bg_color: string;
            _id: string;
            title: string;
        }[];
    };
    conversation_last_note?: {};
    conversation_staff?: {
        fb_staff_id: string;
        snap_staff: {
            type: string;
            is_auto_assign: boolean;
            _id: string;
            name: string;
        };
    };
    conversation_chatbot?: {
        bbh_public_token: string;
        bbh_private_token: string;
    };
}
export interface GetCustomerInfoCallback {
    (error: MyError, result?: CustomerInfo): void;
}
export interface GetConfigInput {
    type_config: TypeConfig;
    brand_name: string;
}
export interface WidgetConfigRequireData {
    type_config: TypeConfig;
    brand_name: string;
}
export interface SaveConfigInput extends WidgetConfigRequireData {
    config_data: any;
}
export {};
