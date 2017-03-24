'use strict';

let assert = require('assert');
let Bot = require('../index.js');

describe('Message construction', () => {
    it('of basic text message', () => {
        const message = Bot.Message.text('body');
        const expected = {
            type: 'text',
            body: 'body'
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses', () => {
        const message = Bot.Message.text('body')
            .addTextResponse('A')
            .addTextResponse('B')
            .addTextResponse('C');
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                responses: [
                    { type: 'text', body: 'A' },
                    { type: 'text', body: 'B' },
                    { type: 'text', body: 'C' }
                ],
                hidden: false
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses with multi-add', () => {
        const message = Bot.Message.text('body')
            .addTextResponse('A', 'B', 'C');
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                responses: [
                    { type: 'text', body: 'A' },
                    { type: 'text', body: 'B' },
                    { type: 'text', body: 'C' }
                ],
                hidden: false
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses by keyboard methods strings', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(['A', 'B', 'C'], true, 'sometestguy');
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                to: 'sometestguy',
                hidden: true,
                responses: [
                    { type: 'text', body: 'A' },
                    { type: 'text', body: 'B' },
                    { type: 'text', body: 'C' }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses by keyboard methods with one message strings', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard('A', true, 'sometestguy');
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                to: 'sometestguy',
                hidden: true,
                responses: [
                    { type: 'text', body: 'A' }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses by keyboard methods without target user strings', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(['A', 'B', 'C'], true);
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                hidden: true,
                responses: [
                    { type: 'text', body: 'A' },
                    { type: 'text', body: 'B' },
                    { type: 'text', body: 'C' }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses by keyboard methods with duplicate users strings', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(['A', 'B', 'C'], true, 'sometestguy')
            .addResponseKeyboard(['D', 'E', 'F'], true, 'sometestguy');
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                to: 'sometestguy',
                hidden: true,
                responses: [
                    { type: 'text', body: 'A' },
                    { type: 'text', body: 'B' },
                    { type: 'text', body: 'C' },
                    { type: 'text', body: 'D' },
                    { type: 'text', body: 'E' },
                    { type: 'text', body: 'F' }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses by keyboard methods with duplicate users strings', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(['A', 'B', 'C'], true, 'sometestguy')
            .addResponseKeyboard(['G', 'H', 'I'], true, 'sometestguy2')
            .addResponseKeyboard(['D', 'E', 'F'], true, 'sometestguy');
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                to: 'sometestguy',
                hidden: true,
                responses: [
                    { type: 'text', body: 'A' },
                    { type: 'text', body: 'B' },
                    { type: 'text', body: 'C' },
                    { type: 'text', body: 'D' },
                    { type: 'text', body: 'E' },
                    { type: 'text', body: 'F' }
                ]
            }, {
                type: 'suggested',
                to: 'sometestguy2',
                hidden: true,
                responses: [
                    { type: 'text', body: 'G' },
                    { type: 'text', body: 'H' },
                    { type: 'text', body: 'I' }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses by keyboard methods without hidden strings', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(['A', 'B', 'C']);
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                responses: [
                    { type: 'text', body: 'A' },
                    { type: 'text', body: 'B' },
                    { type: 'text', body: 'C' }
                ],
                hidden: false
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses by keyboard methods', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(
                [Bot.Response.text('A'), Bot.Response.text('B'), Bot.Response.text('C')],
                true, 'sometestguy');
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                to: 'sometestguy',
                hidden: true,
                responses: [
                    { type: 'text', body: 'A' },
                    { type: 'text', body: 'B' },
                    { type: 'text', body: 'C' }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses by keyboard methods with one message', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(
                Bot.Response.text('A'), true, 'sometestguy');
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                to: 'sometestguy',
                hidden: true,
                responses: [
                    { type: 'text', body: 'A' }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses by keyboard methods without target user', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(
                [Bot.Response.text('A'), Bot.Response.text('B'), Bot.Response.text('C')], true);
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                hidden: true,
                responses: [
                    { type: 'text', body: 'A' },
                    { type: 'text', body: 'B' },
                    { type: 'text', body: 'C' }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses by keyboard methods with duplicate users', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(
                [Bot.Response.text('A'), Bot.Response.text('B'), Bot.Response.text('C')],
                true, 'sometestguy')
            .addResponseKeyboard(
                [Bot.Response.text('D'), Bot.Response.text('E'), Bot.Response.text('F')],
                true, 'sometestguy');

        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                to: 'sometestguy',
                hidden: true,
                responses: [
                    { type: 'text', body: 'A' },
                    { type: 'text', body: 'B' },
                    { type: 'text', body: 'C' },
                    { type: 'text', body: 'D' },
                    { type: 'text', body: 'E' },
                    { type: 'text', body: 'F' }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses by keyboard methods with duplicate users', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(
                [Bot.Response.text('A'), Bot.Response.text('B'), Bot.Response.text('C')],
                true, 'sometestguy')
            .addResponseKeyboard(
                [Bot.Response.text('G'), Bot.Response.text('H'), Bot.Response.text('I')],
                true, 'sometestguy2')
            .addResponseKeyboard(
                [Bot.Response.text('D'), Bot.Response.text('E'), Bot.Response.text('F')],
                true, 'sometestguy');
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                to: 'sometestguy',
                hidden: true,
                responses: [
                    { type: 'text', body: 'A' },
                    { type: 'text', body: 'B' },
                    { type: 'text', body: 'C' },
                    { type: 'text', body: 'D' },
                    { type: 'text', body: 'E' },
                    { type: 'text', body: 'F' }
                ]
            }, {
                type: 'suggested',
                to: 'sometestguy2',
                hidden: true,
                responses: [
                    { type: 'text', body: 'G' },
                    { type: 'text', body: 'H' },
                    { type: 'text', body: 'I' }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with suggested responses by keyboard methods without hidden', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(
                [Bot.Response.text('A'), Bot.Response.text('B'), Bot.Response.text('C')]);
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                responses: [
                    { type: 'text', body: 'A' },
                    { type: 'text', body: 'B' },
                    { type: 'text', body: 'C' }
                ],
                hidden: false
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with friend picker suggested response keyboard', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(
                Bot.Response.friendPicker('A', 4, 5, ['foo']), true, 'sometestguy');
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                to: 'sometestguy',
                hidden: true,
                responses: [
                    {
                        type: 'friend-picker',
                        body: 'A',
                        min: 4,
                        max: 5,
                        preselected: ['foo']
                    }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with multiple types of suggested responses in keyboard', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(
                [Bot.Response.friendPicker('A', 4, 5, ['foo']), Bot.Response.text('B')],
                true, 'sometestguy');
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                to: 'sometestguy',
                hidden: true,
                responses: [
                    {
                        type: 'friend-picker',
                        body: 'A',
                        min: 4,
                        max: 5,
                        preselected: ['foo']
                    },
                    { type: 'text', body: 'B' }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with friend picker suggested response missing optional parameters', () => {
        const message = Bot.Message.text('body')
            .addResponseKeyboard(
                [Bot.Response.friendPicker()], true, 'sometestguy');
        const expected = {
            type: 'text',
            body: 'body',
            keyboards: [{
                type: 'suggested',
                to: 'sometestguy',
                hidden: true,
                responses: [
                    {
                        type: 'friend-picker'
                    }
                ]
            }]
        };

        assert.deepEqual(message.toJSON(), expected);
    });

    it('with a mention', () => {
        const message = Bot.Message.text('body')
            .setMention('someotherbot');
        const expected = {
            type: 'text',
            body: 'body',
            mention: 'someotherbot'
        };
        assert.deepEqual(message.toJSON(), expected);
    });

    it('of is typing', () => {
        const message = Bot.Message.isTyping(true);
        const expected = {
            type: 'is-typing',
            isTyping: true
        };

        assert.equal(message.type, expected.type);
        assert.equal(message.isTyping, expected.isTyping);

        assert.ok(message.isIsTypingMessage());

        assert.deepEqual(message.toJSON(), expected);
    });

    it('of read receipt', () => {
        const message = Bot.Message.readReceipt(['6d8d060c-3ae4-46fc-bb18-6e7ba3182c0f']);
        const expected = {
            type: 'read-receipt',
            messageIds: ['6d8d060c-3ae4-46fc-bb18-6e7ba3182c0f']
        };

        assert.ok(message.isReadReceiptMessage());

        assert.deepEqual(message.toJSON(), expected);
    });

    it('of everything on a picture', () => {
        const message = Bot.Message.picture('http://i.imgur.com/8QP4ZFt.jpg')
            .setNoForward(true)
            .setDelay(0)
            .setTypeTime(12)
            .setAttributionName('Imgur')
            .setAttributionIcon('http://s.imgur.com/images/favicon-96x96.png');
        const expected = {
            type: 'picture',
            picUrl: 'http://i.imgur.com/8QP4ZFt.jpg',
            noForward: true,
            attribution: {
                name: 'Imgur',
                iconUrl: 'http://s.imgur.com/images/favicon-96x96.png'
            },
            typeTime: 12,
            delay: 0
        };

        assert.equal(message.type, expected.type);
        assert.equal(message.picUrl, expected.picUrl);
        assert.equal(message.attributionName, expected.attribution.name);
        assert.equal(message.attributionIcon, expected.attribution.iconUrl);
        assert.equal(message.typeTime, expected.typeTime);
        assert.equal(message.noForward, expected.noForward);
        assert.equal(message.delay, expected.delay);

        assert.ok(message.isPictureMessage());

        assert.deepEqual(message.toJSON(), expected);
    });

    it('of everything on a video', () => {
        const message = Bot.Message.video('http://i.imgur.com/XAFz40E.mp4')
            .setLoop(true)
            .setMuted(true)
            .setAutoplay(true)
            .setNoSave(true)
            .setAttributionName('Imgur')
            .setAttributionIcon('http://s.imgur.com/images/favicon-96x96.png');
        const expected = {
            type: 'video',
            videoUrl: 'http://i.imgur.com/XAFz40E.mp4',
            attribution: {
                name: 'Imgur',
                iconUrl: 'http://s.imgur.com/images/favicon-96x96.png'
            },
            loop: true,
            muted: true,
            autoplay: true,
            noSave: true
        };

        assert.equal(message.type, expected.type);
        assert.equal(message.videoUrl, expected.videoUrl);
        assert.equal(message.loop, expected.loop);
        assert.equal(message.muted, expected.muted);
        assert.equal(message.autoplay, expected.autoplay);
        assert.equal(message.noSave, expected.noSave);
        assert.equal(message.attributionName, expected.attribution.name);
        assert.equal(message.attributionIcon, expected.attribution.iconUrl);

        assert.ok(message.isVideoMessage());

        assert.deepEqual(message.toJSON(), expected);
    });

    it('of everything on a link', () => {
        const message = Bot.Message.link('http://imgur.com/8QP4ZFt')
            .setPicUrl('http://i.imgur.com/8QP4ZFt.jpg')
            .setTitle('Cute Dog')
            .setText('Elvis')
            .setKikJsData({ abc: 123 })
            .setAttributionName('Imgur')
            .setAttributionIcon('http://s.imgur.com/images/favicon-96x96.png');
        const expected = {
            type: 'link',
            attribution: {
                name: 'Imgur',
                iconUrl: 'http://s.imgur.com/images/favicon-96x96.png'
            },
            kikJsData: { abc: 123 },
            title: 'Cute Dog',
            text: 'Elvis',
            url: 'http://imgur.com/8QP4ZFt',
            picUrl: 'http://i.imgur.com/8QP4ZFt.jpg'
        };

        assert.equal(message.type, expected.type);
        assert.deepEqual(message.kikJsData, expected.kikJsData);
        assert.equal(message.title, expected.title);
        assert.equal(message.text, expected.text);
        assert.equal(message.url, expected.url);
        assert.equal(message.picUrl, expected.picUrl);
        assert.equal(message.attributionName, expected.attribution.name);
        assert.equal(message.attributionIcon, expected.attribution.iconUrl);

        assert.ok(message.isLinkMessage());

        assert.deepEqual(message.toJSON(), expected);
    });

});

describe('Message parsing', () => {
    it('handles stickers', () => {
        const message = Bot.Message.fromJSON({
            'type': 'sticker',
            'id': '6d8d060c-3ae4-46fc-bb18-6e7ba3182c0f',
            'timestamp': 123821943124,
            'from': 'atestuser',
            'stickerPackId': 'memes',
            'stickerUrl': 'http://cards-sticker-dev.herokuapp.com/stickers/memes/okay.png',
            'readReceiptRequested': true
        });

        assert.ok(message.isStickerMessage());

        assert.equal(message.stickerPackId, 'memes');
        assert.equal(message.stickerUrl,
            'http://cards-sticker-dev.herokuapp.com/stickers/memes/okay.png');
        assert.equal(message.id, '6d8d060c-3ae4-46fc-bb18-6e7ba3182c0f');
        assert.equal(message.readReceiptRequested, true);
        assert.equal(message.timestamp, 123821943124);
    });

    it('handles scan data', () => {
        const message = Bot.Message.fromJSON({
            'type': 'scan-data',
            'from': 'atestuser',
            'id': '6d8d060c-3ae4-46fc-bb18-6e7ba3182c0f',
            'timestamp': 1399303478832,
            'data': '{"store_id": "2538"}'
        });

        assert.ok(message.isScanDataMessage());

        assert.equal(message.scanData, '{"store_id": "2538"}');
    });

    it('handles friend picker messages', () => {
        const message = Bot.Message.fromJSON({
            'type': 'friend-picker',
            'from': 'atestuser',
            'id': '6d8d060c-3ae4-46fc-bb18-6e7ba3182c0f',
            'timestamp': 1399303478832,
            'picked': ['some', 'one']
        });

        assert.ok(message.isFriendPickerMessage());

        assert.deepEqual(message.picked, ['some', 'one']);
    });

    it('handles participants', () => {
        const message = Bot.Message.fromJSON({
            'type': 'text',
            'from': 'atestuser',
            'id': '6d8d060c-3ae4-46fc-bb18-6e7ba3182c0f',
            'timestamp': 1399303478832,
            'participants': ['sometestguy', 'sometestguy2'],
            'body': 'Test'
        });

        assert.ok(message.isTextMessage());

        assert.deepEqual(message.participants, ['sometestguy', 'sometestguy2']);
    });

    it('handles chatType', () => {
        const message = Bot.Message.fromJSON({
            'type': 'text',
            'from': 'atestuser',
            'id': '6d8d060c-3ae4-46fc-bb18-6e7ba3182c0f',
            'timestamp': 1399303478832,
            'chatType': 'public',
            'body': 'Test'
        });

        assert.ok(message.isTextMessage());

        assert.equal(message.chatType, 'public');
    });

    it('handles mentions', () => {
        const message = Bot.Message.fromJSON({
            'type': 'text',
            'from': 'atestuser',
            'id': '6d8d060c-3ae4-46fc-bb18-6e7ba3182c0f',
            'timestamp': 1399303478832,
            'mention': 'yourbot',
            'body': 'Test'
        });

        assert.ok(message.isTextMessage());
        assert.ok(message.isMention());
        assert.equal(message.mention, 'yourbot');
    });

    it('handles delivery receipts', () => {
        const message = Bot.Message.fromJSON({
            'type': 'delivery-receipt',
            'from': 'atestuser',
            'id': '9a8764cb-3ae4-46fc-bb18-9871decfa11a',
            'messageIds': [
                '859537ca-3ae4-46fc-bb18-6e7ba3182c0f', '6d8d060c-3ae4-46fc-bb18-6e7ba3182c0f'
            ],
            'timestamp': 1399303478832,
            'readReceiptRequested': false
        });

        assert.ok(message.isDeliveryReceiptMessage());

        assert.deepEqual(message.messageIds, [
            '859537ca-3ae4-46fc-bb18-6e7ba3182c0f', '6d8d060c-3ae4-46fc-bb18-6e7ba3182c0f'
        ]);
    });
});
