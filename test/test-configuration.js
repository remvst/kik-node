'use strict';

const assert = require('assert');
const Bot = require('../index.js');

const BOT_USERNAME = 'testbot';
const BOT_API_KEY = '2042cd8e-638c-4183-aef4-d4bef6f01981';

describe('Bot construction', () => {
    it('throws for a missing API key', () => {
        assert.throws(() => {
            new Bot({
                username: BOT_USERNAME
            });
        });
    });

    it('throws for an invalid API key', () => {
        assert.throws(() => {
            new Bot({
                username: BOT_USERNAME,
                apiKey: '123123123y'
            });
        });
    });

    it('throws for a missing username', () => {
        assert.throws(() => {
            new Bot({
                apiKey: BOT_API_KEY
            });
        });
    });

    it('throws for an invalid username', () => {
        assert.throws(() => {
            new Bot({
                username: 'abc-123',
                apiKey: BOT_API_KEY
            });
        });
    });

    it('throws for an invalid path', () => {
        assert.throws(() => {
            new Bot({
                username: BOT_USERNAME,
                apiKey: BOT_API_KEY,
                incomingPath: 12
            });
        });
    });

    it('does not copy over arbitrary option keys', () => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            otherKey: 'some value'
        });

        assert.ifError(bot.otherKey);
    });
});

describe('Bot configuration', () => {
    function expectConfig(botParams, expectedConfig){
        const bot = new Bot(botParams);
        assert.deepEqual(bot.configuration, expectedConfig);
    }

    it('can be exported to JSON', () => {
        expectConfig({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            baseUrl: 'http://foo.bar',
            incomingPath: 'inc'
        }, {
            webhook: 'http://foo.bar/inc',
            features: {
                manuallySendReadReceipts: false,
                receiveReadReceipts: false,
                receiveDeliveryReceipts: false,
                receiveIsTyping: false
            }
        });
    });

    it('can be exported to JSON with features params', () => {
        expectConfig({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            baseUrl: 'http://foo.bar',
            incomingPath: 'inc',
            manuallySendReadReceipts: true
        }, {
            webhook: 'http://foo.bar/inc',
            features: {
                manuallySendReadReceipts: true,
                receiveReadReceipts: false,
                receiveDeliveryReceipts: false,
                receiveIsTyping: false
            }
        });

        expectConfig({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            baseUrl: 'http://foo.bar',
            incomingPath: 'inc',
            receiveReadReceipts: true
        }, {
            webhook: 'http://foo.bar/inc',
            features: {
                manuallySendReadReceipts: false,
                receiveReadReceipts: true,
                receiveDeliveryReceipts: false,
                receiveIsTyping: false
            }
        });

        expectConfig({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            baseUrl: 'http://foo.bar',
            incomingPath: 'inc',
            receiveDeliveryReceipts: true
        }, {
            webhook: 'http://foo.bar/inc',
            features: {
                manuallySendReadReceipts: false,
                receiveReadReceipts: false,
                receiveDeliveryReceipts: true,
                receiveIsTyping: false
            }
        });

        expectConfig({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            baseUrl: 'http://foo.bar',
            incomingPath: 'inc',
            receiveIsTyping: true
        }, {
            webhook: 'http://foo.bar/inc',
            features: {
                manuallySendReadReceipts: false,
                receiveReadReceipts: false,
                receiveDeliveryReceipts: false,
                receiveIsTyping: true
            }
        });
    });

    it('can have a keyboard specified', () => {
        const keyboard = new Bot.ResponseKeyboard(['1', '2']);

        expectConfig({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            baseUrl: 'http://foo.bar',
            incomingPath: 'inc',
            staticKeyboard: keyboard
        }, {
            webhook: 'http://foo.bar/inc',
            features: {
                manuallySendReadReceipts: false,
                receiveReadReceipts: false,
                receiveDeliveryReceipts: false,
                receiveIsTyping: false
            },
            staticKeyboard: keyboard.toJSON()
        });
    });
});
