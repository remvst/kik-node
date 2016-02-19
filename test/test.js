'use strict';

let nock = require('nock');
let request = require('supertest');
let assert = require('assert');
let EventEmitter = require('events').EventEmitter;
let defer = typeof setImmediate === 'function' ? setImmediate : (fn) => {
    process.nextTick(fn.bind.apply(fn, arguments));
};

let Bot = require('../index.js');

const BOT_USERNAME = 'testbot';
const BOT_API_KEY = 'ff467bf2-2837-477c-923d-c8148cb394d9';

describe('Incoming handling', () => {
    it('rejects invalid signatures', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY
        });

        request(bot.incoming())
            .post(bot.incomingPath)
            .send({
                messages: []
            })
            .expect(403)
            .end(done);
    });

    it('rejects missing messages object', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        request(bot.incoming())
            .post(bot.incomingPath)
            .send({
                messages: null
            })
            .expect(400)
            .end(done);
    });

    it('respects incoming path option', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
            incomingPath: '/incoming_test'
        });

        request(bot.incoming())
            .post('/incoming_test')
            .send({
                messages: []
            })
            .expect(200)
            .end(done);
    });

    it('routes incoming messages anywhere', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        bot.use((incoming, bot, next) => {
            assert.deepEqual(incoming.toJSON(), Bot.Message.text('Testing').toJSON());

            next();
            done();
        });

        request(bot.incoming())
            .post(bot.incomingPath)
            .send({
                messages: [
                    { type: 'text', body: 'Testing' }
                ]
            })
            .expect(200)
            .end();
    });

    it('routes incoming messages to incoming', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
        });

        bot.textMessage((incoming, bot, next) => {
            assert.deepEqual(incoming.toJSON(), Bot.Message.text('Testing').toJSON());

            next();
            done();
        });

        request(bot.incoming())
            .post(bot.incomingPath)
            .send({
                messages: [
                    { type: 'text', body: 'Testing' }
                ]
            })
            .expect(200)
            .end();
    });

    it('does not route content messages to text', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
        });

        bot.textMessage((incoming, bot, next) => {
            assert(false);
            next();
        });

        bot.use((incoming, bot, next) => {
            done();
            next();
        });

        request(bot.incoming())
            .post(bot.incomingPath)
            .send({
                messages: [
                    { type: 'picture', picUrl: 'http://i.imgur.com/MxnW5UM.jpg' }
                ]
            })
            .expect(200)
            .end();
    });

    it('routing respects ordering', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
        });
        let index = 0;

        bot.use((incoming, bot, next) => {
            assert.equal(index++, 0);
            next();
        });

        bot.use((incoming, bot, next) => {
            assert.equal(index++, 1);
            next();
        });

        bot.use((incoming, bot, next) => {
            assert.equal(index++, 2);
            done();
            next();
        });

        request(bot.incoming())
            .post(bot.incomingPath)
            .send({
                messages: [
                    { type: 'picture', picUrl: 'http://i.imgur.com/MxnW5UM.jpg' }
                ]
            })
            .expect(200)
            .end();
    });
});

describe('Outoing messages', () => {
    it('are sent properly', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        let engine = nock('https://engine.apikik.com')
            .post('/api/v1/message')
            .reply(200, (err, body, cb) => {
                assert.deepEqual(body, {
                    messages: [
                        { body: 'Test', type: 'text', to: 'mpr' }
                    ]
                });
                done();
            });

        bot.send('mpr', {
            type: 'text',
            body: 'Test'
        });
    });
});
