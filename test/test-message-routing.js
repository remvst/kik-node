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

let messageChecker;
let engine = nock('https://engine.apikik.com')
    .post('/api/v1/message')
    .reply(200, (err, body, cb) => {
        if (messageChecker) {
            messageChecker(err, body, cb);
        }
    });

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

        bot.use((incoming, next) => {
            assert.equal(incoming.body, 'Testing');

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

        bot.onTextMessage((incoming, next) => {
            assert.equal(incoming.body, 'Testing');

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

        bot.onTextMessage((incoming, bot, next) => {
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

        messageChecker = (err, body, cb) => {
            assert.deepEqual(body, {
                messages: [
                    { body: 'Test', type: 'text', to: 'testuser1' }
                ]
            });
            done();
        };

        bot.send({
            type: 'text',
            body: 'Test'
        }, 'testuser1');
    });

    it('are batched together', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        messageChecker = (err, body, cb) => {
            assert.deepEqual(body, {
                messages: [
                    { body: 'Test 1', type: 'text', to: 'testuser1' },
                    { body: 'Test 2', type: 'text', to: 'testuser1' },
                    { body: 'Test 3', type: 'text', to: 'testuser1' }
                ]
            });
            done();
        };

        bot.send({
            type: 'text',
            body: 'Test 1'
        }, 'testuser1');
        bot.send({
            type: 'text',
            body: 'Test 2'
        }, 'testuser1');
        bot.send({
            type: 'text',
            body: 'Test 3'
        }, 'testuser1');
    });

    it('are batched together by recipient', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });
        let batch = 0;

        messageChecker = (err, body, cb) => {
            ++batch;

            if (batch === 1) {
                assert.deepEqual(body, {
                    messages: [
                        { body: 'Test 1', type: 'text', to: 'testuser1' },
                        { body: 'Test 4', type: 'text', to: 'testuser1' }
                    ]
                });
            } else if (batch === 2) {
                assert.deepEqual(body, {
                    messages: [
                        { body: 'Test 2', type: 'text', to: 'chris' }
                    ]
                });
            } else if (batch === 3) {
                assert.deepEqual(body, {
                    messages: [
                        { body: 'Test 3', type: 'text', to: 'ted' }
                    ]
                });
                done();
            }
        };

        bot.send({
            type: 'text',
            body: 'Test 1'
        }, 'testuser1');
        bot.send({
            type: 'text',
            body: 'Test 2'
        }, 'chris');
        bot.send({
            type: 'text',
            body: 'Test 3'
        }, 'ted');
        bot.send({
            type: 'text',
            body: 'Test 4'
        }, 'testuser1');
    });

    it('are limited to the max batch size', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            maxMessagePerBatch: 2,
            skipSignatureCheck: true
        });
        let batch = 0;

        messageChecker = (err, body, cb) => {
            ++batch;

            if (batch === 1) {
                assert.deepEqual(body, {
                    messages: [
                        { body: 'Test 1', type: 'text', to: 'testuser1' },
                        { body: 'Test 2', type: 'text', to: 'testuser1' }
                    ]
                });
            } else if (batch === 2) {
                assert.deepEqual(body, {
                    messages: [
                        { body: 'Test 3', type: 'text', to: 'testuser1' },
                        { body: 'Test 4', type: 'text', to: 'testuser1' }
                    ]
                });
            } else if (batch === 3) {
                assert.deepEqual(body, {
                    messages: [
                        { body: 'Test 5', type: 'text', to: 'testuser1' }
                    ]
                });
            } else if (batch === 4) {
                assert.deepEqual(body, {
                    messages: [
                        { body: 'Test 1', type: 'text', to: 'chris' },
                        { body: 'Test 2', type: 'text', to: 'chris' }
                    ]
                });
                done();
            }
        };

        bot.send({
            type: 'text',
            body: 'Test 1'
        }, 'testuser1');
        bot.send({
            type: 'text',
            body: 'Test 2'
        }, 'testuser1');
        bot.send({
            type: 'text',
            body: 'Test 3'
        }, 'testuser1');
        bot.send({
            type: 'text',
            body: 'Test 4'
        }, 'testuser1');
        bot.send({
            type: 'text',
            body: 'Test 5'
        }, 'testuser1');
        bot.send({
            type: 'text',
            body: 'Test 1'
        }, 'chris');
        bot.send({
            type: 'text',
            body: 'Test 2'
        }, 'chris');
    });
});

describe('Incoming routing', () => {
    it('replies to message', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
            incomingPath: '/incoming'
        });

        bot.use((incoming, next) => {
            incoming.reply('Complete');
        });

        messageChecker = (err, body, cb) => {
            assert.deepEqual(body, {
                messages: [
                    { body: 'Complete', type: 'text', to: 'testuser1' }
                ]
            });
            done();
        };

        request(bot.incoming())
            .post('/incoming')
            .send({
                messages: [{ body: 'Test', type: 'text', from: 'testuser1' }]
            })
            .expect(200)
            .end(() => {});
    });

    it('ignores message but responds', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
            incomingPath: '/incoming'
        });

        bot.use((incoming, next) => {
            incoming.ignore();
        });

        request(bot.incoming())
            .post('/incoming')
            .send({
                messages: [{ body: 'Test', type: 'text', from: 'testuser1' }]
            })
            .expect(200)
            .end(done);
    });
});
