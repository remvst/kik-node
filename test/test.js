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
const BOT_API_TOKEN = 'ff467bf2-2837-477c-923d-c8148cb394d9';

describe('Incoming handling', () => {
    it('Rejects invalid signatures', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiToken: BOT_API_TOKEN
        });

        request(bot.incoming())
            .post('/receive')
            .send({
                messages: []
            })
            .expect(403)
            .end(done);
    });

    it('Rejects missing messages object', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiToken: BOT_API_TOKEN,
            skipSignatureCheck: true
        });

        request(bot.incoming())
            .post('/receive')
            .send({
                messages: null
            })
            .expect(400)
            .end(done);
    });

    it('Respects incoming path option', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiToken: BOT_API_TOKEN,
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

    it('Routes incoming messages anywhere', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiToken: BOT_API_TOKEN,
            skipSignatureCheck: true,
        });

        bot.use((incoming, bot, next) => {
            assert.deepEqual(incoming, { type: 'text', body: 'Testing' });

            next();
            done();
        });

        request(bot.incoming())
            .post('/receive')
            .send({
                messages: [
                    { type: 'text', body: 'Testing' }
                ]
            })
            .expect(200)
            .end();
    });

    it('Routes incoming messages to incoming', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiToken: BOT_API_TOKEN,
            skipSignatureCheck: true,
        });

        bot.textMessage((incoming, bot, next) => {
            assert.deepEqual(incoming, { type: 'text', body: 'Testing' });

            next();
            done();
        });

        request(bot.incoming())
            .post('/receive')
            .send({
                messages: [
                    { type: 'text', body: 'Testing' }
                ]
            })
            .expect(200)
            .end();
    });

    it('Does not route content messages to text', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiToken: BOT_API_TOKEN,
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
            .post('/receive')
            .send({
                messages: [
                    { type: 'picture', picUrl: 'http://i.imgur.com/MxnW5UM.jpg' }
                ]
            })
            .expect(200)
            .end();
    });

    it('Routing respects ordering', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiToken: BOT_API_TOKEN,
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
            .post('/receive')
            .send({
                messages: [
                    { type: 'picture', picUrl: 'http://i.imgur.com/MxnW5UM.jpg' }
                ]
            })
            .expect(200)
            .end();
    });
});

describe('Outoing messaging', () => {
    it('Respects incoming path', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiToken: BOT_API_TOKEN,
            skipSignatureCheck: true
        });

        let engine = nock('http://engine.apikik.com')
                        .persist()
                        .post('/api/v1/messages')
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
