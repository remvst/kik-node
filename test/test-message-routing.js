'use strict';

let nock = require('nock');
let request = require('supertest');
let assert = require('assert');

let Bot = require('../index.js');

const BOT_USERNAME = 'testbot';
const BOT_API_KEY = '2042cd8e-638c-4183-aef4-d4bef6f01981';

let messageChecker;

function setupNock() {
    nock('https://api.kik.com')
        .post('/v1/message')
        .reply(200, (err, body, cb) => {
            let currentMessageChecker = messageChecker;

            messageChecker = null;

            if (currentMessageChecker) {
                currentMessageChecker(err, body, cb);
            }
        })
        .post('/v1/broadcast')
        .reply(200, (err, body, cb) => {
            let currentMessageChecker = messageChecker;

            messageChecker = null;

            if (currentMessageChecker) {
                currentMessageChecker(err, body, cb);
            }
        });
}

function tearDownNock() {
    nock.cleanAll();
}

describe('Incoming handling', () => {
    beforeEach(setupNock);
    afterEach(tearDownNock);

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
            .end(() => {});
    });

    it('stops routing after being handled', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        bot.use((incoming) => {
            incoming.ignore();
            done();
        });

        bot.use((incoming, next) => {
            assert.fail();

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
            .end(() => {});
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
            .end(() => {});
    });

    it('does not route content messages to text', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
        });

        bot.onTextMessage((incoming, next) => {
            assert(false);
            next();
        });

        bot.use((incoming, next) => {
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
            .end(() => {});
    });

    it('routing respects ordering', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
        });
        let index = 0;

        bot.use((incoming, next) => {
            assert.equal(index++, 0);
            next();
        });

        bot.use((incoming, next) => {
            assert.equal(index++, 1);
            next();
        });

        bot.use((incoming, next) => {
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
            .end(() => {});
    });
});

describe('Type handler', () => {
    beforeEach(setupNock);
    afterEach(tearDownNock);

    it('handles all message types', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
        });
        let messageCount = 0;
        let typeCounts = {
            'text': 0,
            'link': 0,
            'picture': 0,
            'video': 0,
            'start-chatting': 0,
            'scan-data': 0,
            'sticker': 0,
            'is-typing': 0,
            'delivery-receipt': 0,
            'read-receipt': 0,
            'friend-picker': 0
        };
        const messages = [
            { type: 'link' },
            { type: 'text' },
            { type: 'video' },
            { type: 'delivery-receipt' },
            { type: 'sticker' },
            { type: 'text' },
            { type: 'sticker' },
            { type: 'is-typing' },
            { type: 'friend-picker' },
            { type: 'picture' },
            { type: 'read-receipt' },
            { type: 'start-chatting' },
            { type: 'is-typing' },
            { type: 'video' },
            { type: 'scan-data' },
            { type: 'start-chatting' },
            { type: 'delivery-receipt' },
            { type: 'picture' },
            { type: 'link' },
            { type: 'scan-data' },
            { type: 'read-receipt' },
            { type: 'friend-picker' }
        ];

        bot.onTextMessage((incoming, next) => {
            ++typeCounts.text;
            next();
        });

        bot.onLinkMessage((incoming, next) => {
            ++typeCounts.link;
            next();
        });

        bot.onPictureMessage((incoming, next) => {
            ++typeCounts.picture;
            next();
        });

        bot.onVideoMessage((incoming, next) => {
            ++typeCounts.video;
            next();
        });

        bot.onStartChattingMessage((incoming, next) => {
            ++typeCounts['start-chatting'];
            next();
        });

        bot.onScanDataMessage((incoming, next) => {
            ++typeCounts['scan-data'];
            next();
        });

        bot.onStickerMessage((incoming, next) => {
            ++typeCounts.sticker;
            next();
        });

        bot.onIsTypingMessage((incoming, next) => {
            ++typeCounts['is-typing'];
            next();
        });

        bot.onDeliveryReceiptMessage((incoming, next) => {
            ++typeCounts['delivery-receipt'];
            next();
        });

        bot.onReadReceiptMessage((incoming, next) => {
            ++typeCounts['read-receipt'];
            next();
        });

        bot.onFriendPickerMessage((incoming, next) => {
            ++typeCounts['friend-picker'];
            next();
        });

        bot.use((incoming, next) => {
            ++messageCount;

            if (messageCount === messages.length) {
                Object.keys(typeCounts).forEach((key) => {
                    assert.equal(typeCounts[key], 2);
                });

                done();
            }

            next();
        });

        request(bot.incoming())
            .post(bot.incomingPath)
            .send({
                messages: messages
            })
            .expect(200)
            .end(() => {});
    });
});

describe('Outgoing broadcast messages', () => {
    beforeEach(setupNock);
    afterEach(tearDownNock);

    it('throws without a recipient', () => {
        assert.throws(() => {
            let bot = new Bot({
                username: BOT_USERNAME,
                apiKey: BOT_API_KEY,
                skipSignatureCheck: true
            });

            bot.broadcast({ body: 'Whoops no recipient', type: 'text' });
        });
    });

    it('throws for invalid usernames', () => {
        assert.throws(() => {
            let bot = new Bot({
                username: BOT_USERNAME,
                apiKey: BOT_API_KEY,
                skipSignatureCheck: true
            });

            bot.broadcast({ body: 'remvst was here too', type: 'text' }, ['valid', 'invalid here']);
        });
    });

    it('are sent properly', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        messageChecker = (err, body) => {
            assert.deepEqual(body, {
                messages: [
                    { body: 'Test', type: 'text', to: 'testuser1' }
                ]
            });
            done();
        };

        bot.broadcast({
            type: 'text',
            body: 'Test'
        }, 'testuser1');
    });

    it('are sent in batches', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        let users = [];
        for (let i = 0; i < 51; i++) {
            users.push('testuser' + i);
        }

        messageChecker = (err, body) => {
            assert.equal(body.messages.length, 100);

            messageChecker = (err, body) => {
                assert.equal(body.messages.length, 2);
                done();
            };
        };

        bot.broadcast([{
            'type': 'text',
            'body': 'somebody'
        }, {
            'type': 'text',
            'body': 'some other body'
        }], users);
    });
});

describe('Outgoing messages', () => {
    beforeEach(setupNock);
    afterEach(tearDownNock);

    it('throws without a recipient', () => {
        assert.throws(() => {
            let bot = new Bot({
                username: BOT_USERNAME,
                apiKey: BOT_API_KEY,
                skipSignatureCheck: true
            });

            bot.send({ body: 'Whoops no recipient', type: 'text' });
        });
    });

    it('throws if username is invalid', () => {
        assert.throws(() => {
            let bot = new Bot({
                username: BOT_USERNAME,
                apiKey: BOT_API_KEY,
                skipSignatureCheck: true
            });

            bot.send({ body: 'remi was here', type: 'text' }, 'r');
        });
    });

    it('are sent properly', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        messageChecker = (err, body) => {
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

    it('are serialized from the message object', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        messageChecker = (err, body) => {
            assert.deepEqual(body, {
                messages: [
                    { body: 'Test', type: 'text', to: 'testuser1' }
                ]
            });
            done();
        };

        bot.send(Bot.Message.text('Test'), 'testuser1');
    });

    it('are batched together', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        messageChecker = (err, body) => {
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

        messageChecker = (err, body) => {
            assert.deepEqual(body, {
                messages: [
                    { body: 'Test 1', type: 'text', to: 'testuser1' },
                    { body: 'Test 4', type: 'text', to: 'testuser1' }
                ]
            });

            messageChecker = (err, body) => {
                assert.deepEqual(body, {
                    messages: [
                        { body: 'Test 2', type: 'text', to: 'chris' }
                    ]
                });

                messageChecker = (err, body) => {
                    assert.deepEqual(body, {
                        messages: [
                            { body: 'Test 3', type: 'text', to: 'ted' }
                        ]
                    });
                    done();
                };
            };
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

        messageChecker = (err, body) => {
            assert.deepEqual(body, {
                messages: [
                    { body: 'Test 1', type: 'text', to: 'testuser1' },
                    { body: 'Test 2', type: 'text', to: 'testuser1' }
                ]
            });

            messageChecker = (err, body) => {
                assert.deepEqual(body, {
                    messages: [
                        { body: 'Test 3', type: 'text', to: 'testuser1' },
                        { body: 'Test 4', type: 'text', to: 'testuser1' }
                    ]
                });

                messageChecker = (err, body) => {
                    assert.deepEqual(body, {
                        messages: [
                            { body: 'Test 5', type: 'text', to: 'testuser1' }
                        ]
                    });

                    messageChecker = (err, body) => {
                        assert.deepEqual(body, {
                            messages: [
                                { body: 'Test 1', type: 'text', to: 'chris' },
                                { body: 'Test 2', type: 'text', to: 'chris' }
                            ]
                        });
                        done();
                    };
                };
            };
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

describe('Message routing', () => {
    beforeEach(setupNock);
    afterEach(tearDownNock);

    it('replies to message', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
            incomingPath: '/incoming'
        });

        bot.use(incoming => {
            incoming.reply('Complete');
        });

        messageChecker = (err, body) => {
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

    it('ignores message but responds to request', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
            incomingPath: '/incoming'
        });

        bot.use(incoming => {
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

    it('does not break calling next too many times', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true,
            incomingPath: '/incoming'
        });

        bot.use((incoming, next) => {
            next();
            next();
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

describe('Reply handling', () => {
    beforeEach(setupNock);
    afterEach(tearDownNock);

    it('can start typing', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        bot.use(incoming => {
            incoming.startTyping();
        });

        messageChecker = (err, body) => {
            let message = Bot.Message.fromJSON(body.messages[0]);

            assert.ok(message.isIsTypingMessage());
            assert.ok(message.isTyping);

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
    it('can stop typing', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        bot.use(incoming => {
            incoming.stopTyping();
        });

        messageChecker = (err, body) => {
            let message = Bot.Message.fromJSON(body.messages[0]);

            assert.ok(message.isIsTypingMessage());
            assert.ifError(message.isTyping);

            done();
        };

        request(bot.incoming())
            .post('/incoming')
            .send({
                messages: [{
                    body: 'Test',
                    type: 'text',
                    from: 'testuser1',
                    chatId: '3652a09b4be84006ac56-5d8b31464078'
                }]
            })
            .expect(200)
            .end(() => {});
    });
    it('mark a message read', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        bot.use(incoming => {
            incoming.markRead();
        });

        messageChecker = (err, body) => {
            let message = Bot.Message.fromJSON(body.messages[0]);

            assert.ok(message.isReadReceiptMessage());
            assert.deepEqual(message.messageIds, ['3652a09b-4be8-4006-ac56-5d8b31464078']);

            done();
        };

        request(bot.incoming())
            .post('/incoming')
            .send({
                messages: [{
                    id: '3652a09b-4be8-4006-ac56-5d8b31464078',
                    body: 'Test',
                    type: 'text',
                    from: 'testuser1'
                }]
            })
            .expect(200)
            .end(() => {});
    });
    it('can process outgoing messages', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        bot.use(incoming => {
            incoming.reply('Hi');
        });

        bot.outgoing((outgoing, next) => {
            outgoing.body += 'foo';
            next();
        });

        bot.outgoing((outgoing, next) => {
            outgoing.body += 'bar';
            next();
        });

        messageChecker = (err, body) => {
            let message = Bot.Message.fromJSON(body.messages[0]);
            assert.equal(message.body, 'Hifoobar');

            done();
        };

        request(bot.incoming())
            .post('/incoming')
            .send({
                messages: [{
                    id: '3652a09b-4be8-4006-ac56-5d8b31464078',
                    body: 'Test',
                    type: 'text',
                    from: 'testuser1'
                }]
            })
            .expect(200)
            .end(() => {});
    });
    it('can process multiple outgoing messages', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        bot.use((incoming, next) => {
            incoming.reply('Hi');
            incoming.reply('There');
            next();
        });

        bot.outgoing((outgoing, next) => {
            outgoing.body += 'foo';
            next();
        });

        bot.outgoing((outgoing, next) => {
            outgoing.body += 'bar';
            next();
        });

        messageChecker = (err, body) => {
            assert.equal(body.messages[0].body, 'Hifoobar');
            assert.equal(body.messages[1].body, 'Therefoobar');
            done();
        };

        request(bot.incoming())
            .post('/incoming')
            .send({
                messages: [{
                    body: 'Testfoobar',
                    type: 'text',
                    from: 'testuser1'
                }]
            })
            .expect(200)
            .end(() => {});
    });
});
