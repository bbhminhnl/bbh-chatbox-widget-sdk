import axios from 'axios'
import { get } from 'lodash'
import {
    CHATBOX_APP_DOMAIN,
    CHATBOX_WIDGET_DOMAIN,
    CHATBOT_DOMAIN
} from './constant'

import {
    Callback, InitContructor, GetCustomerInfoCallback, GetConfigInput,
    SaveConfigInput,
} from './interface'

export class BbhChatboxWidget {
    private _is_debug: boolean
    private _chatbox_secret_key: string
    private _chatbox_widget_access_token?: string | null
    private _is_chatbox_page_admin?: boolean
    private _chatbot_public_token?: string
    private _fb_client_id?: string

    constructor(input: InitContructor) {
        this._is_debug = input.is_debug
        this._chatbox_secret_key = input.chatbox_secret_key
    }

    get chatbox_widget_access_token() {
        return this._chatbox_widget_access_token
    }
    get is_chatbox_page_admin() {
        return this._is_chatbox_page_admin
    }

    private _log(...data: any[]) {
        if (!this._is_debug) return

        console.log('BBH-Widget:', ...data)
    }
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
            .then(r => {
                if (r && r.data && r.data.data) return proceed(null, r.data.data)
                if (r && r.data) return proceed(null, r.data)

                proceed(null, r)
            })
            .catch(e => {
                if (e.response && e.response.data && e.response.data.message) return proceed(e.response.data.message)
                if (e.response && e.response.data) return proceed(e.response.data)
                if (e.response) return proceed(e.response)
                if (e.message) return proceed(e.message)

                proceed(e)
            })
    }
    private _get_query_string(field: string) {
        return new URLSearchParams(window.location.search).get(field)
    }
    private _init_chatbox_widget_access_token() {
        this._chatbox_widget_access_token = this._get_query_string('access_token')

        this._log(
            `Detect chatbox_widget_access_token:`,
            this._chatbox_widget_access_token
        )
    }
    private _to_boolean(value: any) {
        let result = false

        try { result = JSON.parse(value) } catch (e) { }

        return result
    }
    private _init_is_chatbox_page_admin() {
        this._is_chatbox_page_admin = this._to_boolean(
            this._get_query_string('is_page_admin')
        )

        this._log(`Detect is_chatbox_page_admin:`, this._is_chatbox_page_admin)
    }

    public init(proceed: Callback) {
        if (!proceed) throw new Error('Require callback function')

        if (!this._chatbox_secret_key) proceed('Require chatbox_secret_key')

        this._init_chatbox_widget_access_token()

        this._init_is_chatbox_page_admin()

        if (!this._chatbox_widget_access_token) proceed('Require chatbox_widget_access_token')

        this._log('Init Bbh Chatbox Widget successfully!')
    }
    public save_config(data: SaveConfigInput, proceed: Callback) {
        this._log('Do save_config')

        this._post_json(
            `${CHATBOX_WIDGET_DOMAIN}/setting/WidgetSetting/save-config`,
            data,
            { Authorization: this._chatbox_widget_access_token },
            proceed
        )
    }
    public delete_config(proceed: Callback) {
        this._log('Do delete_config')

        this._post_json(
            `${CHATBOX_WIDGET_DOMAIN}/setting/WidgetSetting/save-config`,
            {},
            { Authorization: this._chatbox_widget_access_token },
            proceed
        )
    }
    public get_config(data: GetConfigInput, proceed: Callback) {
        this._log('Do get config')

        this._post_json(
            `${CHATBOX_WIDGET_DOMAIN}/setting/WidgetSetting/get-config`,
            data,
            { Authorization: this._chatbox_widget_access_token },
            (e, r) => {
                if (e && e.error_message) return proceed(e.error_message)
                if (e) return proceed(e)

                if (r && r.config_data) return proceed(null, r.config_data)

                proceed(null, r)
            }
        )
    }
    public connect_widget_to_page_chatbox(
        token_partner: string,
        proceed: Callback
    ) {
        this._log('start connect widget and page chatbox')

        this._post_json(
            `${CHATBOX_APP_DOMAIN}/app/app-installed/update`,
            {
                access_token: this._chatbox_widget_access_token,
                token_partner: token_partner || 'active',
                _type: 'oauth-access-token'
            },
            {},
            proceed
        )
    }
    public get_client_info(proceed: GetCustomerInfoCallback) {
        this._log('get client info')

        this._post_json(
            `${CHATBOX_APP_DOMAIN}/service/partner-authenticate`,
            {
                access_token: this._chatbox_widget_access_token,
                secret_key: this._chatbox_secret_key
            },
            {},
            (e, r) => {
                this._chatbot_public_token = get(r, 'r.data.conversation_chatbot.bbh_public_token')
                this._fb_client_id = get(r, 'data.public_profile.fb_client_id')

                proceed(e, r)
            }
        )
    }
    public send_message_to_client(data: any, proceed: Callback) {
        this._log('send message to client')

        this._post_json(
            `${CHATBOT_DOMAIN}/public/json?access_token=${this._chatbot_public_token}&psid=${this._fb_client_id}`,
            data,
            {},
            proceed
        )
    }
    public proxy_request(uri: string, body: any, proceed: Callback) {
        this._post_json(
            `${CHATBOX_WIDGET_DOMAIN}/proxy/index`,
            { uri, post_data: body },
            { Authorization: this._chatbox_widget_access_token },
            (e, r) => {
                if (e && e.error_message) return proceed(e.error_message)
                if (e) return proceed(e)

                proceed(null, r)
            }
        )
    }
}