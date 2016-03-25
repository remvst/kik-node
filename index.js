'use strict';

const util = require('util');
const crypto = require('crypto');
const Message = require('./lib/message.js');
const API = require('./lib/api.js');
const UserProfile = require('./lib/user-profile.js');
const ScanCode = require('./lib/scan-code.js');

const UsernameRegex = /^[A-Za-z0-9_.]{2,32}$/;
const UuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

/**
 * A callback
 * @callback MessageHandlerCallback
 * @param {IncomingMessage} message
 * @param {Bot} bot
 * @param {function} next
 */

function isSignatureValid(body, apiKey, signature) {
    if (!signature) {
        return false;
    }

    const expected = crypto.createHmac('sha1', apiKey)
        .update(new Buffer(body))
        .digest('hex')
        .toLowerCase();

    return expected === signature.toLowerCase();
}

/**
 * @class IncomingMessage
 * This is a test
 */
class IncomingMessage extends Message {
    constructor(bot) {
        super('');

        this.bot = bot;
    }

    reply(messages) {
        this.completion();

        if (!util.isArray(messages)) {
            messages = [messages];
        }

        let chatId = this.chatId;
        let to = this.from;

        messages = messages.map((message) => {
            if (util.isString(message)) {
                message = { 'type': 'text', 'body': message };
            }

            if (util.isFunction(message.toJSON)) {
                message = message.toJSON();
            }

            return message;
        });

        return this.bot.send(messages, to, chatId);
    }

    markRead() {
        return this.reply(Message.readReceipt([this.id]));
    }

    ignore() {
        this.completion();
    }

    startTyping() {
        return this.reply(Message.isTyping(true));
    }

    stopTyping() {
        return this.reply(Message.isTyping(false));
    }
}

/**
 * @class Bot
 * This is a test
 * @constructor
 * @param {String} options.username
 * @param {String} options.apiKey
 * @param {String} [options.incomingPath]="/incoming" Set true to enable polling or set options
 * @see https://bots.kik.com
 */
class Bot {

    constructor(options) {
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

        if (!this.username || !this.username.match(UsernameRegex)) {
            errors.push('Option "username" must be a valid Kik username');
        }

        if (!this.apiKey || !this.apiKey.match(UuidRegex)) {
            errors.push('Option "apiKey" must be a Kik API key, see http://dev.kik.com/');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        this.stack = [];
        this.pendingMessages = [];
        this.pendingFlush = null;
    }

    handle(incoming, done) {
        let index = 0;
        let finished = false;
        const complete = (err) => {
            finished = true;

            if (done) {
                done(err);
            }
        };

        const advance = (err) => {
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

        incoming.completion = complete;

        advance();
    }

    /**
     *  @param {MessageHandlerCallback} handler
     */
    use(handler) {
        this.stack.push(handler);
        return this;
    }

    /**
     *  @param {MessageHandlerCallback} handler
     *  @example
     *  bot.onTextMessage((incoming, bot) => {
     *      // reply handles the message and stops other handlers
     *      // from being called for this message
     *      incoming.reply(`Hi I'm ${bot.username}`);
     *  });
     *  @example
     *  bot.onTextMessage((incoming, bot, next) => {
     *      if (incoming.body !== 'Hi') {
     *          // we only handle welcoming, let someone else deal with this
     *          // message
     *          return next();
     *      }
     *
     *      // say hello...
     *  });
     */
    onTextMessage(handler) {
        this.use((incoming, bot, next) => {
            if (incoming.type === 'text') {
                handler(incoming, bot, next);
            } else {
                next();
            }
        });
        return this;
    }

    /**
     *  @return {promise.<ScanCode>}
     **/
    getScanCode(options) {
        if (!options || !options.data) {
            return API.usernameScanCode(this.username);
        }

        return API.dataScanCode(this.username, data);
    }

    /**
     *  @return {promise.<UserProfile>}
     **/
    getUserProfile(username) {
        const fetch = (username) => {
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

    broadcast(recipients, messages) {
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

        const pendingMessages = [];

        recipients.forEach((recipient) => {
            messages.forEach((message) => {
                if (util.isFunction(message.toJSON)) {
                    message = message.toJSON();
                }

                message.to = recipient;

                pendingMessages.push(message);
            });
        });

        return API.sendMessages(this.apiDomain, this.username, this.apiKey, messagses);
    }

    send(messages, recipient, chatId) {
        if (!recipient) {
            throw 'Invalid recipient';
        }

        // force recipients to be an array
        if (!!recipient && !util.isString(recipient)) {
            throw 'Invalid recipient, must be a string';
        }

        // force messages to be an array
        if (!!messages && !util.isArray(messages)) {
            messages = [messages];
        }

        messages.forEach((message) => {
            if (util.isFunction(message.toJSON)) {
                message = message.toJSON();
            }

            message.to = recipient;
            message.chatId = chatId;

            this.pendingMessages.push(message);
        });

        return this.flush();
    }

    incoming(incomingPath) {
        incomingPath = incomingPath || this.incomingPath;

        return (req, res, next) => {
            next = next || (() => {});

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
                }

                parsed.messages.forEach((json) => {
                    this.handle(new IncomingMessage(this).parse(json), checkDone);
                });

                res.statusCode = 200;

                return res.end('OK');
            });
        };
    }

    flush(forced) {
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
