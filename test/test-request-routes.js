'use strict';

const nock = require('nock');
const request = require('supertest');
const assert = require('assert');
const crypto = require('crypto');
const EventEmitter = require('events').EventEmitter;
const defer = typeof setImmediate === 'function' ? setImmediate : (fn) => {
    process.nextTick(fn.bind.apply(fn, arguments));
};

const Bot = require('../index.js');

const BOT_USERNAME = 'testbot';
const BOT_API_KEY = '2042cd8e-638c-4183-aef4-d4bef6f01981';

describe('Incoming routing', () => {
    it('verifies signature', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            incomingPath: '/incoming'
        });

        const data = '{"messages":[{"body":"Test", "type":"text", "from":"testuser1"}]}';
        const signature = crypto.createHmac('sha1', BOT_API_KEY)
            .update(new Buffer(data))
            .digest('hex');

        request(bot.incoming())
            .post('/incoming')
            .set('X-Kik-Signature', signature)
            .send(data)
            .expect(200)
            .end(done);
    });

    it('will not tolerate junk data', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
            incomingPath: '/incoming'
        });

        request(bot.incoming())
            .post('/incoming')
            .send("messages: [{ body: 'Test', type: 'text', from: 'testuser1']")
            .expect(400)
            .end(done);
    });

    it('only allows POST requests to incoming path', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
            incomingPath: '/incoming'
        });

        request(bot.incoming())
            .get('/incoming')
            .expect(405)
            .end(done);
    });

    it('ignores other URLs', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
            incomingPath: '/incoming'
        });

        request((req, res) => {
            let called = false;
            let next = () => {
                called = true;
            };

            bot.incoming()(req, res, next);

            assert(called);
            done();
        })
            .post('/other')
            .end();
    });
});
