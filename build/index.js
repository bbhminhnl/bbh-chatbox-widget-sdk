"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = exports.log = exports.init = void 0;
const axios_1 = __importDefault(require("axios"));
let IS_DEBUG;
const init = ({ is_debug }) => {
    IS_DEBUG = is_debug;
};
exports.init = init;
const log = (...data) => {
    if (!IS_DEBUG)
        return;
    console.log('BBH-Widget:', ...data);
};
exports.log = log;
const post = (path, body, proceed) => {
    axios_1.default.post('https://jsonplaceholder.typicode.com/posts', { answer: 42 }).then(r => {
        console.log('hey::', r.data);
    }).catch(e => {
        console.log('ee::', e);
    });
};
exports.post = post;
