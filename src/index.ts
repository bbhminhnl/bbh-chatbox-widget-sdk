import axios from 'axios'
import { get } from 'lodash'
import {
    CHATBOX_APP_DOMAIN,
    CHATBOX_WIDGET_DOMAIN,
    CHATBOT_DOMAIN
} from './constant'

import {
    Callback, InitContructor, GetCustomerInfoCallback, GetConfigInput,
    SaveConfigInput, WidgetConfigRequireData, ChatboxEvent,
} from './interface'

/**
 * Lớp BbhChatboxWidget để widget thực hiện các tương tác với hệ thống chatbox
 */
export class BbhChatboxWidget {
    /**
     * Biến cờ để bật/tắt chế độ debug.
     */
    private _is_debug: boolean;
    /**
     * Khóa bí mật của widget.
     */
    private _chatbox_secret_key: string;
    /**
     * Mã truy cập của widget đến chatbox.
     */
    private _chatbox_widget_access_token?: string | null;
    /**
     * Xác định xem nhân viên hiện tại có phải là quản trị viên của chatbox hay không.
     */
    private _is_chatbox_page_admin?: boolean;
    /**
     * Mã thông báo công khai của chatbot.
     */
    private _chatbot_public_token?: string;
    /**
     * ID của khách hàng trên Facebook.
     */
    private _fb_client_id?: string;

    /**
     * Khởi tạo một đối tượng BbhChatboxWidget.
     * @param input - Đối tượng đầu vào chứa các thông tin cấu hình.
     */
    constructor(input: InitContructor) {
        this._is_debug = input.is_debug;
        this._chatbox_secret_key = input.chatbox_secret_key;
    }

    /**
     * Trả về mã truy cập của widget chatbox.
     */
    get chatbox_widget_access_token() {
        return this._chatbox_widget_access_token;
    }


    /**
     * Gán giá trị cho biến chatbox_widget_access_token.
     * @param value - Giá trị cần gán.
     */
    set chatbox_widget_access_token(value: string | null | undefined) {
        this._chatbox_widget_access_token = value
    }


    /**
     * Trả về giá trị xác định xem nhân viên hiện tại có phải là quản trị viên của chatbox hay không.
     */
    get is_chatbox_page_admin() {
        return this._is_chatbox_page_admin;
    }

    /**
     * Ghi log dữ liệu.
     * @param data - Dữ liệu cần ghi log.
     */
    private _log(...data: any[]) {
        if (!this._is_debug) return;

        console.log('BBH-Widget:', ...data);
    }

    /**
     * Gửi yêu cầu POST với dữ liệu dạng JSON.
     * @param uri - Đường dẫn của API.
     * @param body - Dữ liệu gửi đi.
     * @param headers - Các header của yêu cầu.
     * @param proceed - Callback được gọi sau khi yêu cầu hoàn thành.
     */
    private _post_json(
        uri: string,
        body: Object,
        headers: Object,
        proceed: Callback
    ) {
        axios
            .post(
                uri,
                body,
                { headers: headers as any }
            )
            .then(r => proceed(null, r?.data?.data || r.data || r))
            .catch(e => proceed(e?.response?.data?.message || e?.response?.data || e?.response || e?.message || e))
    }

    /**
     * Lấy giá trị của trường query từ URL.
     * @param field - Tên trường query.
     * @returns Giá trị của trường query.
     */
    private _get_query_string(field: string) {
        return new URLSearchParams(window.location.search).get(field);
    }

    /**
     * Khởi tạo mã truy cập của widget từ trường query 'access_token'.
     */
    private _init_chatbox_widget_access_token() {
        this._chatbox_widget_access_token = this._get_query_string('access_token');

        this._log(
            `Phát hiện mã truy cập của widget chatbox:`,
            this._chatbox_widget_access_token
        );
    }

    /**
     * Chuyển đổi giá trị thành kiểu boolean.
     * @param value - Giá trị cần chuyển đổi.
     * @returns Giá trị boolean tương ứng.
     */
    private _to_boolean(value: any) {
        let result = false;

        try { result = JSON.parse(value) } catch (e) { }

        return result;
    }

    /**
     * Khởi tạo giá trị xác định xem nhân viên hiện tại có phải là quản trị viên của chatbox hay không từ trường query 'is_page_admin'.
     */
    private _init_is_chatbox_page_admin() {
        this._is_chatbox_page_admin = this._to_boolean(
            this._get_query_string('is_page_admin')
        );

        this._log(`Phát hiện giá trị xác định xem trang hiện tại có phải là trang quản trị của chatbox hay không:`, this._is_chatbox_page_admin);
    }

    /**
     * Khởi tạo widget chatbox.
     * @param proceed - Callback được gọi sau khi khởi tạo hoàn thành.
     */
    public init(proceed: Callback) {
        if (!proceed) throw new Error('Yêu cầu callback function');

        if (!this._chatbox_secret_key) proceed('Yêu cầu chatbox_secret_key');

        this._init_chatbox_widget_access_token();

        this._init_is_chatbox_page_admin();

        if (!this._chatbox_widget_access_token) proceed('Yêu cầu chatbox_widget_access_token');

        this._log('Khởi tạo Bbh Chatbox Widget thành công!');

        proceed()
    }

    /**
     * Lưu cấu hình của widget.
     * @param data - Dữ liệu cấu hình cần lưu.
     * @param proceed - Callback được gọi sau khi lưu cấu hình hoàn thành.
     */
    public save_config(data: SaveConfigInput, proceed: Callback) {
        this._log('Thực hiện lưu cấu hình');

        this._post_json(
            `${CHATBOX_WIDGET_DOMAIN}/setting/WidgetSetting/save-config`,
            data,
            { Authorization: this._chatbox_widget_access_token },
            proceed
        );
    }

    /**
     * Xóa cấu hình của widget.
     * @param input - Dữ liệu cần thiết để xóa cấu hình.
     * @param proceed - Callback được gọi sau khi xóa cấu hình hoàn thành.
     */
    public delete_config(input: WidgetConfigRequireData, proceed: Callback) {
        this._log('Thực hiện xóa cấu hình');

        this._post_json(
            `${CHATBOX_WIDGET_DOMAIN}/setting/WidgetSetting/save-config`,
            { ...input, config_data: {} },
            { Authorization: this._chatbox_widget_access_token },
            proceed
        );
    }

    /**
     * Lấy cấu hình của widget.
     * @param data - Dữ liệu cần thiết để lấy cấu hình.
     * @param proceed - Callback được gọi sau khi lấy cấu hình hoàn thành.
     */
    public get_config(data: GetConfigInput, proceed: Callback) {
        this._log('Thực hiện lấy cấu hình');

        this._post_json(
            `${CHATBOX_WIDGET_DOMAIN}/setting/WidgetSetting/get-config`,
            data,
            { Authorization: this._chatbox_widget_access_token },
            (e, r) => {
                if (e && e.error_message) return proceed(e.error_message);
                if (e) return proceed(e);

                if (r && r.config_data) return proceed(null, r.config_data);

                proceed(null, r);
            }
        );
    }

    /**
     * Kết nối widget với chatbox trên trang.
     * @param token_partner - Mã truy cập đối tác.
     * @param proceed - Callback được gọi sau khi kết nối hoàn thành.
     */
    public connect_widget_to_page_chatbox(
        token_partner: string,
        proceed: Callback
    ) {
        this._log('Bắt đầu kết nối widget và chatbox trên trang');

        this._post_json(
            `${CHATBOX_APP_DOMAIN}/app/app-installed/update`,
            {
                access_token: this._chatbox_widget_access_token,
                token_partner: token_partner || 'active',
                _type: 'oauth-access-token'
            },
            {},
            proceed
        );
    }

    /**
     * Lấy thông tin khách hàng.
     * @param proceed - Callback được gọi sau khi lấy thông tin hoàn thành.
     */
    public get_client_info(proceed: GetCustomerInfoCallback) {
        this._log('Lấy thông tin khách hàng');

        this._post_json(
            `${CHATBOX_APP_DOMAIN}/service/partner-authenticate`,
            {
                access_token: this._chatbox_widget_access_token,
                secret_key: this._chatbox_secret_key
            },
            {},
            (e, r) => {
                this._chatbot_public_token = get(r, 'r.data.conversation_chatbot.bbh_public_token');
                this._fb_client_id = get(r, 'data.public_profile.fb_client_id');

                proceed(e, r);
            }
        );
    }

    /**
     * Gửi tin nhắn tới khách hàng.
     * @param data - Dữ liệu tin nhắn cần gửi.
     * @param proceed - Callback được gọi sau khi gửi tin nhắn hoàn thành.
     */
    public send_message_to_client(data: any, proceed: Callback) {
        this._log('Gửi tin nhắn tới khách hàng');

        this._post_json(
            `${CHATBOT_DOMAIN}/public/json?access_token=${this._chatbot_public_token}&psid=${this._fb_client_id}`,
            data,
            {},
            proceed
        );
    }

    /**
     * Gửi yêu cầu proxy.
     * @param input - Đối tượng chứa thông tin yêu cầu proxy.
     * @param proceed - Callback được gọi sau khi yêu cầu hoàn thành.
     */
    public proxy_request(
        input: {
            uri: string
            body?: any
            headers?: any
            qs?: any
            method?: 'POST' | 'GET' | 'DELETE' | 'PUT'
            json?: boolean
        },
        proceed: Callback
    ) {
        this._post_json(
            `${CHATBOX_WIDGET_DOMAIN}/proxy/index`,
            input,
            { Authorization: this._chatbox_widget_access_token },
            (e, r) => {
                if (e) return proceed(e?.error_message || e);

                proceed(null, r?.data || r);
            }
        );
    }

    /**
     * lắng nghe liên tục khi chatbox đổi conversation
     * @param proceed - Callback được gọi sau khi lấy thông tin hoàn thành.
     */
    public on_chatbox_message(proceed: Callback) {
        // reload dữ liệu không cần load lại toàn bộ widget
        window.addEventListener('message', ($event: MessageEvent<ChatboxEvent>) => {
            if (
                $event?.data?.from !== 'CHATBOX' ||
                $event?.data?.type !== 'RELOAD' ||
                !$event?.data?.payload?.access_token
            ) return

            // ghi đè access_token của chatbox mới
            this._chatbox_widget_access_token = $event?.data?.payload?.access_token as string

            proceed()
        })
    }
}