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
const BOT_API_KEY = '2042cd8e-638c-4183-aef4-d4bef6f01981';

describe('Incoming routing', () => {
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

    it('only allows GET requests to bot manifest', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        request(bot.incoming())
            .post('/bot.json')
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
