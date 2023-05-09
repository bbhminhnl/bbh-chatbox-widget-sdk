"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BbhChatboxWidget = void 0;
const axios_1 = __importDefault(require("axios"));
const lodash_1 = require("lodash");
const constant_1 = require("./constant");
class BbhChatboxWidget {
    constructor(input) {
        this._is_debug = input.is_debug;
        this._chatbox_secret_key = input.chatbox_secret_key;
    }
    get chatbox_widget_access_token() {
        return this._chatbox_widget_access_token;
    }
    get is_chatbox_page_admin() {
        return this._is_chatbox_page_admin;
    }
    _log(...data) {
        if (!this._is_debug)
            return;
        console.log('BBH-Widget:', ...data);
    }
    _post_json(uri, body, headers, proceed) {
        axios_1.default
            .post(uri, body, {
            headers: headers
        })
            .then(r => proceed(null, r.data))
            .catch(e => proceed(e.message || e));
    }
    _get_query_string(field) {
        return new URLSearchParams(window.location.search).get(field);
    }
    _init_chatbox_widget_access_token() {
        this._chatbox_widget_access_token = this._get_query_string('access_token');
        this._log(`Detect chatbox_widget_access_token:`, this._chatbox_widget_access_token);
    }
    _to_boolean(value) {
        let result = false;
        try {
            result = JSON.parse(value);
        }
        catch (e) { }
        return result;
    }
    _init_is_chatbox_page_admin() {
        this._is_chatbox_page_admin = this._to_boolean(this._get_query_string('is_page_admin'));
        this._log(`Detect is_chatbox_page_admin:`, this._is_chatbox_page_admin);
    }
    init(proceed) {
        if (!proceed)
            throw new Error('Require callback function');
        if (!this._chatbox_secret_key)
            proceed('Require chatbox_secret_key');
        this._init_chatbox_widget_access_token();
        this._init_is_chatbox_page_admin();
        if (!this._chatbox_widget_access_token)
            proceed('Require chatbox_widget_access_token');
        this._log('Init Bbh Chatbox Widget successfully!');
    }
    save_config(data, proceed) {
        this._log('Do save_config');
        this._post_json(`${constant_1.CHATBOX_WIDGET_DOMAIN}/setting/WidgetSetting/save-config`, data, { Authorization: this._chatbox_widget_access_token }, proceed);
    }
    get_config(data, proceed) {
        this._log('Do get config');
        this._post_json(`${constant_1.CHATBOX_WIDGET_DOMAIN}/setting/WidgetSetting/get-config`, data, { Authorization: this._chatbox_widget_access_token }, proceed);
    }
    connect_widget_to_page_chatbox(token_partner, proceed) {
        this._log('start connect widget and page chatbox');
        this._post_json(`${constant_1.CHATBOX_APP_DOMAIN}/app/app-installed/update`, {
            access_token: this._chatbox_widget_access_token,
            token_partner: token_partner || 'active',
            _type: 'oauth-access-token'
        }, {}, proceed);
    }
    get_client_info(proceed) {
        this._log('get client info');
        this._post_json(`${constant_1.CHATBOX_APP_DOMAIN}/service/partner-authenticate`, {
            access_token: this._chatbox_widget_access_token,
            secret_key: this._chatbox_secret_key
        }, {}, (e, r) => {
            this._chatbot_public_token = (0, lodash_1.get)(r, 'r.data.conversation_chatbot.bbh_public_token');
            this._fb_client_id = (0, lodash_1.get)(r, 'data.public_profile.fb_client_id');
            proceed(e, r);
        });
    }
    send_message_to_client(data, proceed) {
        this._log('send message to client');
        this._post_json(`${constant_1.CHATBOT_DOMAIN}/public/json?access_token=${this._chatbot_public_token}&psid=${this._fb_client_id}`, data, {}, proceed);
    }
}
exports.BbhChatboxWidget = BbhChatboxWidget;
