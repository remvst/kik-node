'use strict';

const Message = require('./message');

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

module.exports = IncomingMessage;
