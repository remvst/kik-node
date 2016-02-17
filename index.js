'use strict';

let util = require('util');
let extend = util._extend;
let validator = require('validator');
let crypto = require('crypto');
let Message = require('./lib/message.js');
let API = require('./lib/api.js');

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
        this.apiDomain = 'https://engine.apikik.com';
        this.incomingPath = '/incoming';
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

        this.stack = [];
        this.pendingMessages = [];
        this.pendingFlush = null;

        this.textMessage((msg, bot, next) => {
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

    handle(data, bot, done)
    {
        let index = 0;
        let advance = (err) => {
            let layer = this.stack[index++];

            if (!layer) {
                if (done) {
                    done(err);
                }

                return;
            }

            try {
                layer(data, bot, advance);
            }
            catch (e) {
                advance(e);
            }
        };

        advance();
    }

    use(handler)
    {
        this.stack.push(handler);
    }

    textMessage(handler)
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

    lookupUserInfo(username)
    {
        return API.userInfo(
            this.apiDomain,
            this.username,
            this.apiToken,
            username);
    }

    reply(incoming, messages)
    {
        if (!incoming) {
            throw 'Invalid recipient list';
        }

        if (!util.isArray(messages)) {
            messages = [messages];
        }

        for(var i = 0 ; i < messages.length ; i++){
            if (util.isString(messages[i])) {
                messages[i] = {
                    'type': 'text',
                    'body': messages[i]
                };
            }
        }

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

        return (req, res) => {
            if (req.url !== incomingPath) {
                return;
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

                let remainingMessages = parsed.messages.length + 1;

                function checkDone() {
                    --remainingMessages;

                    if (remainingMessages <= 0) {
                        res.statusCode = 200;

                        return res.end('OK');
                    }
                }

                parsed.messages.forEach((json) => {
                    this.handle(Message.fromJSON(json), this, checkDone);
                });

                checkDone();
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

            if (pendingMessages.length > 0) {
                API.sendMessages(
                    this.apiDomain,
                    this.username,
                    this.apiToken,
                    pendingMessages);

                resolve(this.flush());
            }
            else {
                resolve();
            }
        });
    }
}

Bot.Message = Message;

module.exports = Bot;
