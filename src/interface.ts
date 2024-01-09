// Định nghĩa kiểu dữ liệu MyError có thể là Error, string hoặc bất kỳ kiểu dữ liệu nào
type MyError = Error | string | any

// Định nghĩa kiểu dữ liệu TypeConfig là 'CRM'
type TypeConfig = 'CRM'

// Định nghĩa kiểu dữ liệu Callback là một hàm có tham số error kiểu MyError và result kiểu bất kỳ, không trả về giá trị
export type Callback = (error?: MyError, result?: any) => void

// Định nghĩa kiểu dữ liệu InitContructor là một đối tượng có thuộc tính is_debug kiểu boolean và chatbox_secret_key kiểu string
export interface InitContructor {
    is_debug: boolean
    chatbox_secret_key: string
}

// Định nghĩa kiểu dữ liệu CustomerInfo là một đối tượng có các thuộc tính public_profile, conversation_contact, conversation_message, conversation_label, conversation_last_note, conversation_staff và conversation_chatbot
export interface CustomerInfo {
    public_profile: {
        fb_page_id: string
        fb_client_id: string
        page_name?: string
        client_name?: string
        token_partner: string
        current_staff_id: string
        current_staff_name: string
        conversation_id: string
        page_id: string
        conversation_index: number
        /**id của quảng cáo cuối cùng nếu có */
        last_ad_id?: string
    }
    conversation_contact?: {
        client_phone?: string
        client_email?: string
    }
    conversation_message?: {
        last_read_message: string
        last_message_time: number
        last_message: string
        last_message_type: string
        platform_type: string
    }
    conversation_label?: {
        label_id: string[]
        snap_label: {
            type: string
            text_color: string
            bg_color: string
            _id: string
            title: string
        }[]
    }
    conversation_last_note?: {}
    conversation_staff?: {
        fb_staff_id: string
        snap_staff: {
            type: string
            is_auto_assign: boolean
            _id: string
            name: string
        }
    }
    conversation_chatbot?: {
        bbh_public_token: string
        bbh_private_token: string
    }
}

// Định nghĩa kiểu dữ liệu GetCustomerInfoCallback là một hàm có tham số error kiểu MyError và result kiểu CustomerInfo, không trả về giá trị
export interface GetCustomerInfoCallback {
    (error: MyError, result?: CustomerInfo): void
}

// Định nghĩa kiểu dữ liệu GetConfigInput là một đối tượng có thuộc tính type_config kiểu TypeConfig và brand_name kiểu string
export interface GetConfigInput {
    type_config: TypeConfig
    brand_name: string
}

// Định nghĩa kiểu dữ liệu WidgetConfigRequireData là một đối tượng có thuộc tính type_config kiểu TypeConfig và brand_name kiểu string
export interface WidgetConfigRequireData {
    type_config: TypeConfig
    brand_name: string
}

// Định nghĩa kiểu dữ liệu SaveConfigInput là một đối tượng có thuộc tính type_config kiểu TypeConfig, brand_name kiểu string và config_data kiểu bất kỳ
export interface SaveConfigInput extends WidgetConfigRequireData {
    config_data: any
}

/**dữ liệu được chatbox truyền sang */
export interface ChatboxEvent {
    /**sự kiện được gửi từ đâu */
    from?: 'CHATBOX'
    /**sự kiện dùng làm gì */
    type?: 'RELOAD'
    /**dữ liệu kèm theo */
    payload?: {
        /**token mới */
        access_token?: string
    }
}