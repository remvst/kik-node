'use strict';

let util = require('util');
let rp = require('request-promise');

const API_MESSAGES_PATH = '/api/v1/message';

class API {

    static sendMessages(domain, username, apiToken, messages)
    {
        if (!util.isArray(messages)) {
            messages = [messages];
        }

        let data = {'messages': messages};

        return rp({
            method: 'POST',
            uri: domain + API_MESSAGES_PATH,
            body: data,
            json: true,
            auth: {
                user: username,
                pass: apiToken
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

module.exports = API;
