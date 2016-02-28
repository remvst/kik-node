'use strict';

let util = require('util');
let extend = util._extend;
let validator = require('validator');
let crypto = require('crypto');
let Message = require('./lib/message.js');
let API = require('./lib/api.js');
let UserProfile = require('./lib/user-profile.js');
let ScanCode = require('./lib/scan-code.js');

function isSignatureValid(body, apiKey, signature)
{
    if (!signature) {
        return false;
    }

    let signatureToLowerCase = signature.toLowerCase();
    let expected = crypto
        .createHmac('sha1', apiKey)
        .update(new Buffer(body))
        .digest('hex')
        .toLowerCase();

    return expected === signatureToLowerCase;
}

class BotReply {

    constructor()
    {
    }

    reply(message)
    {
    }

    ignore()
    {
    }
}

/**
 * @class Bot
 * This is a test
 * @constructor
 * @param {String} options.username
 * @param {String} options.apiToken
 * @param {String} [options.incomingPath]="/incoming" Set true to enable polling or set options
 * @see https://engine.kik.com
 */
class Bot {

    constructor(options)
    {
        // default configuration
        this.apiDomain = 'https://engine.apikik.com';
        this.incomingPath = '/incoming';
        this.maxMessagePerBatch = 25;

        // override any specified configuration
        Object.keys(options).forEach((key) => {
            this[key] = options[key];
        });

        // validate options
        let errors = [];

        if (!validator.matches(this.username, /[A-Za-z0-9_.]{2,32}/)) {
            errors.push('Option "username" must be a valid Kik username');
        }

        if (validator.isHexadecimal(this.apiKey)) {
            errors.push('Option "apiKey" must be a Kik API key, see http://dev.kik.com/');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        this.stack = [];
        this.pendingMessages = [];
        this.pendingFlush = null;

        this.onTextMessage((msg, bot, next) => {
            if (msg.body) {
                let components = msg.body.split('|');

                if (components.length > 1) {
                    msg.body = components[0];
                    msg.chats = components[1].split(',');
                    msg.members = components[2].split(',');
                }

                if (msg.body.indexOf('@') === 0) {
                    let mentionComponents = /^(@[A-Za-z0-9._]{2,32})(.*)/.exec(msg.body);

                    if (mentionComponents) {
                        msg.body = mentionComponents[2].trim();
                        msg.isMention = true;
                    }
                }
            }

            next();
        });
    }

    handle(incoming, done)
    {
        let index = 0;
        let finished = false;
        let complete = (err) => {
            finished = true;

            if (done) {
                done(err);
            }
        };
        let advance = (err) => {
            if (finished) {
                return;
            }

            let layer = this.stack[index++];

            if (!layer) {
                complete();

                return;
            }

            try {
                layer(incoming, advance);
            }
            catch (e) {
                advance(e);
            }
        };
        
        incoming.reply = (messages) => {
            complete();

            if (!incoming) {
                throw 'Invalid recipient list';
            }

            if (!util.isArray(messages)) {
                messages = [messages];
            }


            messages = messages.map((message) => {
                if (util.isString(message)) {
                    return {'type': 'text', 'body': message};
                }

                return message;
            });

            let members = incoming.members ? incoming.members : [incoming.from];

            members.forEach((to, index) => {
                let chat;

                if (incoming.chats) {
                    chat = incoming.chats[index];
                }

                if (chat) {
                    this.send(to, messages.map((message) => {
                        if (util.isFunction(message.toJSON)) {
                            message = message.toJSON();
                        }

                        message = extend({}, message);

                        let oldText = message.body;

                        if (message.attribution) {
                            oldText = message.attribution.name;
                        }

                        if (message.type === 'text') {
                            message.body = oldText + '|' + chat;
                        }
                        else {
                            message.attribution.name = oldText + '|' + chat;
                        }

                        return message;
                    }));
                }
                else {
                    this.send(to, messages);
                }
            });
        };

        incoming.ignore = () => {
            complete();
        };

        advance();
    }

    use(handler)
    {
        this.stack.push(handler);
    }

    onTextMessage(handler)
    {
        this.use((incoming, bot, next) => {
            if (incoming.type === 'text') {
                handler(incoming, bot, next);
            }
            else {
                next();
            }
        });
    }

    scanCode(options)
    {
        if (!options || !options.data) {
            return API.usernameScanCode(this.username);
        }

        return API.dataScanCode(this.username, data);
    }

    getUserProfile(username)
    {
        let fetch = (username) => {
            return API.userInfo(
                this.apiDomain,
                this.username,
                this.apiKey,
                username)
            .then((result) => {
                return new UserProfile(username, result);
            });
        };

        if (util.isArray(username)) {
            return Promise.all(username.map(fetch));
        }

        return fetch(username);
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
                if (util.isFunction(message.toJSON)) {
                    message = message.toJSON();
                }

                message = extend({}, message);

                message.to = recipient;

                this.pendingMessages.push(message);
            });
        });

        return this.flush();
    }

    incoming(incomingPath)
    {
        incomingPath = incomingPath || this.incomingPath;

        return (req, res, next) => {
            next = next || function() {};

            if (req.url !== incomingPath) {
                return next();
            }

            if (req.method !== 'POST') {
                res.statusCode = 405;

                return res.end(incomingPath + ' only accepts POST');
            }

            let body = '';

            req.on('data', chunk => {
                body += chunk;
            });

            req.on('end', () => {
                if (!this.skipSignatureCheck) {
                    if (!isSignatureValid(body, this.apiKey, req.headers['x-kik-signature'])) {
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

                let remainingMessages = parsed.messages.length + 1;

                function checkDone() {
                    --remainingMessages;

                    if (remainingMessages <= 0) {
                        res.statusCode = 200;

                        return res.end('OK');
                    }
                }

                parsed.messages.forEach((json) => {
                    let msg = Message.fromJSON(json);

                    this.handle(msg, checkDone);
                });

                checkDone();
            });
        };
    }

    flush(forced)
    {
        return new Promise((fulfill, reject) => {
            let pendingMessages = this.pendingMessages;

            if (!forced) {
                if (!this.pendingFlush) {
                    this.pendingFlush = true;

                    process.nextTick(() => fulfill(this.flush(true)));
                }

                return;
            }

            this.pendingFlush = false;
            this.pendingMessages = [];

            let batches = {};

            pendingMessages.forEach((message) => {
                let to = message.to;
                let batch = batches[to];

                if (!batch) {
                    batch = batches[to] = [];
                }

                batch.push(message);
            });

            Object.keys(batches).forEach((key) => {
                let batch = batches[key];

                while (batch.length > 0) {
                    // keep the remainder around to send after
                    let nextBatch = batch.slice(this.maxMessagePerBatch, batch.length);

                    // trim the batch to the max limit
                    batch.length = Math.min(batch.length, this.maxMessagePerBatch);

                    API.sendMessages(this.apiDomain, this.username, this.apiKey, batch);

                    batch = nextBatch;
                }
            });

            fulfill();
        });
    }
}

Bot.Message = Message;
Bot.API = API;

module.exports = Bot;
