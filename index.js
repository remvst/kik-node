'use strict';

const util = require('util');
const crypto = require('crypto');
const Message = require('./lib/message.js');
const API = require('./lib/api.js');
const UserProfile = require('./lib/user-profile.js');
const KikCode = require('./lib/scan-code.js');
const uuid = require('node-uuid');
const url = require('url');

const UsernameRegex = /^[A-Za-z0-9_.]{2,32}$/;
const UuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const BotOptionsKeys = {
    'apiDomain': true,
    'baseUrl': true,
    'scanCodePath': true,
    'incomingPath': true,
    'maxMessagePerBatch': true,
    'manuallySendReadReceipts': true,
    'receiveReadReceipts': true,
    'receiveDeliveryReceipts': true,
    'receiveIsTyping': true,
    'username': true,
    'apiKey': true,
    'skipSignatureCheck': true
};

/**
 *  A callback
 *  @callback MessageHandlerCallback
 *  @param {IncomingMessage} message
 *  @param {Bot} bot
 *  @param {function} next
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

function prepareMessage(originalMessage, to, chatId) {
    let message = originalMessage;
    let result = {};

    // allow easy-mode use case where the user just sent along text
    if (util.isString(originalMessage)) {
        message = { 'type': 'text', 'body': originalMessage };
    }

    // serialize a Message object down to its wire form
    if (util.isFunction(originalMessage.toJSON)) {
        message = originalMessage.toJSON();
    }

    // make a copy of the message in the degenerate case so
    // we don't modify someone else along the way and add on
    // the routing information
    Object.assign(result, message, { 'to': to });

    if (chatId) {
        result.chatId = chatId;
    }

    return result;
}

/**
 *  @class IncomingMessage
 *  This is a test
 */
class IncomingMessage extends Message {
    constructor(bot) {
        super('');

        this.bot = bot;
    }

    /**
     *  @param {Message|array.<Message>}
     *  @return {promise.<object>}
     */
    reply(messages) {
        this.finish();

        return this.bot.send(messages, this.from, this.chatId);
    }

    /**
     *  @return {promise.<object>}
     */
    markRead() {
        return this.reply(Message.readReceipt([this.id]));
    }

    /**
     *  @return {promise.<object>}
     */
    startTyping() {

        return this.reply(Message.isTyping(true));
    }

    /**
     *  @return {promise.<object>}
     */
    stopTyping() {
        return this.reply(Message.isTyping(false));
    }

    /**
     *  @method
     */
    ignore() {
        this.finish();
    }
}

/**
 *  @class Bot
 *  This is a test
 *  @constructor
 *  @param {string} options.username
 *  @param {string} options.apiKey
 *  @param {string} [options.baseUrl]
 *  @param {string} [options.incomingPath]="/incoming" Set true to enable polling or set options
 *  @param {boolean} [options.manuallySendReadReceipts]=false
 *  @param {boolean} [options.receiveReadReceipts]=false
 *  @param {boolean} [options.receiveDeliveryReceipts]=false
 *  @param {boolean} [options.receiveIsTyping]=false
 *  @see https://bots.kik.com
 */
class Bot {

    constructor(options) {
        // default configuration
        this.apiDomain = 'https://api.kik.com';
        this.scanCodePath = '/kik-code.png';
        this.incomingPath = '/incoming';
        this.maxMessagePerBatch = 25;

        this.manuallySendReadReceipts = false;
        this.receiveReadReceipts = false;
        this.receiveDeliveryReceipts = false;
        this.receiveIsTyping = false;

        // override any specified configuration
        Object.keys(options).forEach((key) => {
            // only copy over the appropriate keys
            if (!BotOptionsKeys[key]) {
                return;
            }

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

        if (!this.incomingPath || !util.isString(this.incomingPath)) {
            errors.push('Option "incomingPath" must be path, see http://dev.kik.com/');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        this.stack = [];
        this.pendingMessages = [];
        this.pendingFlush = null;
    }

    get configuration() {
        return {
            webhook: url.resolve(this.baseUrl, this.incomingPath),
            features: {
                manuallySendReadReceipts: !!this.manuallySendReadReceipts,
                receiveReadReceipts: !!this.receiveReadReceipts,
                receiveDeliveryReceipts: !!this.receiveDeliveryReceipts,
                receiveIsTyping: !!this.receiveIsTyping
            }
        };
    }

    updateBotConfiguration() {
        return API.updateConfiguration(
            this.apiDomain,
            this.username,
            this.apiKey,
            this.configuration);
    }

    getBotConfiguration() {
        return API.getConfiguration(this.apiDomain, this.username, this.apiKey);
    }

    /**
     *  @param {MessageHandlerCallback} handler
     */
    use(handler) {
        this.stack.push(handler);
        return this;
    }

    /**
     *  @param {string|regexp} [text]
     *  @param {MessageHandlerCallback} handler
     *  @example
     *  bot.onTextMessage((incoming, bot) => {
     *      // reply handles the message and stops other handlers
     *      // from being called for this message
     *      incoming.reply(`Hi I'm ${bot.username}`);
     *  });
     *  @example
     *  bot.onTextMessage((incoming, next) => {
     *      if (incoming.body !== 'Hi') {
     *          // we only handle welcoming, let someone else deal with this
     *          // message
     *          return next();
     *      }
     *
     *      // say hello...
     *  });
     *  @example
     *  bot.onTextMessage(/^hi|hello|bonjour$/i, (incoming, next) => {
     *      // say hello...
     *  });
     */
    onTextMessage(text, handler) {
        const isString = util.isString(text);
        const isRegExp = util.isRegExp(text);

        // deal with optional param
        if (!handler && util.isFunction(text)) {
            handler = text;
        }

        this.use((incoming, next) => {
            // if this isn't a text message, give up
            // if we have text to match and it doesn't, give up
            // if we have a reg ex to match and it doesn't, give up
            // otherwise this is ours }:-)
            if (incoming.isTextMessage()) {
                if ((!isString && !isRegExp)
                  || (isString && incoming.body === text)) {
                    handler(incoming, next);
                } else if (isRegExp && util.isString(incoming.body)) {
                    let matches = incoming.body.match(text);

                    if (matches) {
                        incoming.matches = matches;
                        handler(incoming, next);
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            } else {
                next();
            }
        });
        return this;
    }

    /**
     *  @param {MessageHandlerCallback} handler
     */
    onLinkMessage(handler) {
        this.use((incoming, next) => {
            if (incoming.isLinkMessage()) {
                handler(incoming, next);
            } else {
                next();
            }
        });
        return this;
    }

    /**
     *  @param {MessageHandlerCallback} handler
     */
    onPictureMessage(handler) {
        this.use((incoming, next) => {
            if (incoming.isPictureMessage()) {
                handler(incoming, next);
            } else {
                next();
            }
        });
        return this;
    }

    /**
     *  @param {MessageHandlerCallback} handler
     */
    onVideoMessage(handler) {
        this.use((incoming, next) => {
            if (incoming.isVideoMessage()) {
                handler(incoming, next);
            } else {
                next();
            }
        });
        return this;
    }

    /**
     *  @param {MessageHandlerCallback} handler
     */
    onStartChattingMessage(handler) {
        this.use((incoming, next) => {
            if (incoming.isStartChattingMessage()) {
                handler(incoming, next);
            } else {
                next();
            }
        });
        return this;
    }

    /**
     *  @param {MessageHandlerCallback} handler
     */
    onScanDataMessage(handler) {
        this.use((incoming, next) => {
            if (incoming.isScanDataMessage()) {
                handler(incoming, next);
            } else {
                next();
            }
        });
        return this;
    }

    /**
     *  @param {MessageHandlerCallback} handler
     */
    onStickerMessage(handler) {
        this.use((incoming, next) => {
            if (incoming.isStickerMessage()) {
                handler(incoming, next);
            } else {
                next();
            }
        });
        return this;
    }

    /**
     *  @param {MessageHandlerCallback} handler
     */
    onIsTypingMessage(handler) {
        this.use((incoming, next) => {
            if (incoming.isIsTypingMessage()) {
                handler(incoming, next);
            } else {
                next();
            }
        });
        return this;
    }

    /**
     *  @param {MessageHandlerCallback} handler
     */
    onDeliveryReceiptMessage(handler) {
        this.use((incoming, next) => {
            if (incoming.isDeliveryReceiptMessage()) {
                handler(incoming, next);
            } else {
                next();
            }
        });
        return this;
    }

    /**
     *  @param {MessageHandlerCallback} handler
     */
    onReadReceiptMessage(handler) {
        this.use((incoming, next) => {
            if (incoming.isReadReceiptMessage()) {
                handler(incoming, next);
            } else {
                next();
            }
        });
        return this;
    }

    /**
     *  Creates a Kik Code with the intended options and returns the
     *  URL of the Kik Code image. If the options specify a data Kik Code
     *  this will hit the Kik Code service and store that data for you.
     *  @param {string|object} [options.data] The data to be sent back to this bot after
     *                                        the user scans
     *  @param {number} [options.width] Width of the Kik code in the PNG image
     *  @param {number} [options.height] Height of the Kik code in the PNG image
     *  @param {number} [options.size] Helper for the width and height in the PNG image
     *  @param {number} [options.color] The color which the user will see after scanning.
     *                                  See {KikCode.Colors}
     *  @return {promise.<string>}
     **/
    getKikCodeUrl(options) {
        let result;

        options = options || {};

        if (!options.data) {
            result = API.usernameScanCode(this.username, options);
        } else {
            result = API.dataScanCode(this.username, options);
        }

        return result.then((response) => response.url);
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

    /**
     *  @param {array} messages
     *  @param {array} recipients
     */
    broadcast(messages, recipients) {
        if (!recipients) {
            throw 'You must specify a recipient to send a message';
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

        // generate a message object for every receipient and every message
        recipients.forEach((recipient) => {
            messages.forEach((message) => {
                message = prepareMessage(message, recipient);

                pendingMessages.push(message);
            });
        });

        return API.broadcastMessages(this.apiDomain, this.username, this.apiKey, pendingMessages);
    }

    /**
     *  @param {array} messages
     *  @param {string} recipient
     *  @param {string} [chatId]
     */
    send(messages, recipient, chatId) {
        if (!recipient) {
            throw 'You must specify a recipient to send a message';
        }

        // force messages to be an array
        if (!!messages && !util.isArray(messages)) {
            messages = [messages];
        }

        messages.forEach((message) => {
            // transform each message to allow for text and custom
            // messages
            message = prepareMessage(message, recipient, chatId);

            this.pendingMessages.push(message);
        });

        return this.flush();
    }

    /**
     *  Handles the incoming requests for messages
     *  configuration.
     */
    incoming() {
        const stack = this.stack;

        function handle(incoming, done) {
            let index = 0;
            let finished = false;
            const finish = () => {
                if (!finished) {
                    finished = true;

                    if (done) {
                        done();
                    }
                }
            };

            const advance = () => {
                let layer = stack[index++];

                if (!layer) {
                    finish();

                    return;
                }

                layer(incoming, advance);
            };

            incoming.finish = finish;

            advance();
        }

        return (req, res, next) => {
            if (req.url.indexOf(this.scanCodePath) === 0) {
                // the kik code image only accepts GET requests
                // requests, reject everything else
                if (req.method !== 'GET') {
                    res.statusCode = 405;

                    return res.end(this.scanCodePath + ' only accepts GET');
                }

                let urlComponents = url.parse(req.url, true);
                let query = urlComponents.query;

                query.width = query.width || 512;
                query.height = query.height || 512;

                this.getKikCodeUrl(query)
                    .then((kikCodeUrl) => {
                        res.redirect(301, kikCodeUrl);
                    });
            } else if (req.url === this.incomingPath) {
                // the incoming route for the bot only accepts POST
                // requests, reject everything else
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

                    function doNothing() {
                    }

                    parsed.messages.forEach((json) => {
                        handle(new IncomingMessage(this).parse(json), doNothing);
                    });

                    res.statusCode = 200;

                    return res.end('OK');
                });
            } else {
                if (next) {
                    next();
                }
            }
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

            let promises = [];

            Object.keys(batches).forEach((key) => {
                let batch = batches[key];

                while (batch.length > 0) {
                    // keep the remainder around to send after
                    let nextBatch = batch.slice(this.maxMessagePerBatch, batch.length);

                    // trim the batch to the max limit
                    batch.length = Math.min(batch.length, this.maxMessagePerBatch);

                    promises.push(API.sendMessages(
                        this.apiDomain,
                        this.username,
                        this.apiKey,
                        batch)
                    );

                    batch = nextBatch;
                }
            });

            fulfill(promises);
        });
    }
}

Bot.Message = Message;
Bot.KikCode = KikCode;
Bot.API = API;

module.exports = Bot;
