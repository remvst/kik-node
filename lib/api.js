'use strict';

let util = require('util');
let rp = require('request-promise');

const API_REMOTE_SCAN_CODE_CREATE = 'https://remote-scancode.kik.com/api/v1/codes';
const API_MESSAGES_PATH_BASE = '/api/v1/';
const API_USER_INFO_PATH = '/api/v1/user/';
const API_CONFIG_PATH = '/api/v1/config';

const DEFAULT_SCAN_CODE_WIDTH = 1200;
const DEFAULT_SCAN_CODE_HEIGHT = 1200;

function sendMessages(endpoint, domain, username, apiKey, messages) {
    const data = { 'messages': messages };

    return rp({
        method: 'POST',
        uri: domain + API_MESSAGES_PATH_BASE + endpoint,
        body: data,
        json: true,
        auth: { user: username, pass: apiKey },
        headers: { 'Content-Type': 'application/json' }
    });
}

class API {
    static dataScanCode(botUsername, options) {
        const payload = {
            'type': 'username',
            'payload': {
                'username': botUsername, 'nonce': 0, 'data': JSON.stringify(options.data)
            }
        };

        return rp({
            method: 'POST',
            uri: API_REMOTE_SCAN_CODE_CREATE,
            body: payload,
            json: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return {
                id: response.id,
                url: `https://scancode.kik.com/api/v1/images/remote/${response.id}/`
                    + (options.width || options.size || DEFAULT_SCAN_CODE_WIDTH) + 'x'
                    + (options.height || options.size || DEFAULT_SCAN_CODE_HEIGHT) + '.png'
                    + (options.color ? '?c=' + options.color : '')
            };
        });
    }

    static updateConfiguration(domain, botUsername, apiKey, configuration) {
        return rp({
            method: 'POST',
            uri: domain + API_CONFIG_PATH,
            body: configuration,
            json: true,
            auth: {
                user: botUsername,
                pass: apiKey
            }
        });
    }

    static getConfiguration(domain, botUsername, apiKey) {
        return rp({
            method: 'GET',
            uri: domain + API_CONFIG_PATH,
            json: true,
            auth: {
                user: botUsername,
                pass: apiKey
            }
        });
    }

    static usernameScanCode(botUsername, options) {
        let url = 'https://scancode.kik.com/api/v1/images/username/' + botUsername + '/'
                + (options.width || options.size || DEFAULT_SCAN_CODE_WIDTH) + 'x'
                + (options.height || options.size || DEFAULT_SCAN_CODE_HEIGHT) + '.png'
                + (options.color ? '?c=' + options.color : '');
        return Promise.resolve({ url: url });
    }

    static userInfo(domain, botUsername, apiKey, username) {
        return rp({
            method: 'GET',
            uri: domain + API_USER_INFO_PATH + username,
            json: true,
            auth: {
                user: botUsername,
                pass: apiKey
            }
        });
    }

    static sendMessages(domain, username, apiKey, messages) {
        return sendMessages('message', domain, username, apiKey, messages);
    }

    static broadcastMessages(domain, username, apiKey, messages) {
        return sendMessages('broadcast', domain, username, apiKey, messages);
    }
}

module.exports = API;
