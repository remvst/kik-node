'use strict';

let util = require('util');
let extend = util._extend;
let validator = require('validator');
let crypto = require('crypto');
let rp = require('request-promise');

const API_MESSAGES_PATH = '/api/v1/messages';

function isSignatureValid(body, apiToken, signature)
{
    if (!signature) {
        return false;
    }

    let signatureToLowerCase = signature.toLowerCase();
    let expected = crypto
        .createHmac('sha1', apiToken)
        .update(new Buffer(body))
        .digest('hex')
        .toLowerCase();

    return expected === signatureToLowerCase;
}

class Bot {

    constructor(options)
    {
        // default configuration
        this.apiDomain = 'http://engine.apikik.com';
        this.incomingPath = '/receive';
        this.maxMessagePerBatch = 100;

        // override any specified configuration
        Object.keys(options).forEach((key) => {
            this[key] = options[key];
        });

        // validate options
        let errors = [];

        if (!validator.matches(this.username, /[A-Za-z0-9_.]{2,32}/)) {
            errors.push('Option "username" must be a valid Kik username');
        }

        if (validator.isHexadecimal(this.apiToken)) {
            errors.push('Option "apiToken" must be a Kik API token, see http://dev.kik.com/');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        this.pendingMessages = [];
        this.pendingFlush = null;

        let stack = [];

        this.handle = (stack, data, bot, done) => {
            let index = 0;

            function next(err)
            {
                let layer = stack[index++];

                if (!layer) {
                    if (done) {
                        done(err);
                    }
                }

                layer(data, bot, next);
            }
        };

        this.use = (handler) => {
            stack.push(handler);
        };
    }

    incomingMessage(handler)
    {
        this.use((incoming, bot, next) => {
            if (incoming.type === 'message') {
                handler(incoming, bot, next);
            }
            else {
                next();
            }
        });
    }

    send(recipients, messages)
    {
        if (!recipients) {
            throw 'Invalid recipient list';
        }

        // force recipients to be an array
        if (!!recipients && !util.isArray(recipients)) {
            recipients = [recipients];
        }

        // force messages to be an array
        if (!!messages && !util.isArray(messages)) {
            messages = [messages];
        }

        recipients.forEach((recipient) => {
            messages.forEach((message) => {
                message = extend({}, message);

                message.to = recipient;

                this.pendingMessages.push(message);
            });
        });

        return this.flush();
    }

    incoming()
    {
        return (req, res) => {
            if (req.url !== this.incomingPath) {
                return;
            }

            if (req.method !== 'POST') {
                res.statusCode = 405;

                return res.end(this.incomingPath + ' only accepts POST');
            }

            let body = '';

            req.on('data', chunk => {
                body += chunk;
            });

            req.on('end', () => {
                if (!this.skipSignatureCheck) {
                    if (!isSignatureValid(body, this.apiToken, req.headers['x-kik-signature'])) {
                        // the request was not sent with a valid signature, so we reject it
                        res.statusCode = 403;

                        return res.end('Invalid signature');
                    }
                }

                let parsed;

                try {
                    parsed = JSON.parse(body);
                }
                catch (ex) {
                    res.statusCode = 400;

                    return res.end('Invalid body');
                }

                if (!parsed.messages || !util.isArray(parsed.messages)) {
                    res.statusCode = 400;

                    return res.end('Invalid body');
                }

                parsed.messages.forEach((json) => {
                    this.handle(json, this);
                });

                res.statusCode = 200;

                return res.end('OK');
            });
        };
    }

    flush(forced)
    {
        return new Promise((resolve, reject) => {
            let pendingMessages = this.pendingMessages;

            if (!forced) {
                if (!this.pendingFlush) {
                    this.pendingFlush = true;

                    process.nextTick(() => resolve(this.flush(true)));
                }

                return;
            }

            this.pendingFlush = false;

            // trim the batch and schedule another flush
            if (pendingMessages.length > this.maxMessagePerBatch) {
                this.pendingMessages = pendingMessages.slice(this.maxMessagePerBatch, pendingMessages.length);
                pendingMessages.length = this.maxMessagePerBatch;
            }
            else {
                this.pendingMessages = [];
            }

            let data = {'messages': pendingMessages};

            if (pendingMessages.length) {
                rp({
                    method: 'POST',
                    uri: this.apiDomain + API_MESSAGES_PATH,
                    body: data,
                    json: true,
                    auth: {
                        user: this.username,
                        pass: this.apiToken
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((data) => {
                    console.log('g', data);
                }, (error) => {
                    console.log('h', error);
                });
            }

            if (this.pendingMessages.length > 0) {
                resolve(this.flush());
            }
            else {
                resolve();
            }
        });
    }
}

module.exports = Bot;
