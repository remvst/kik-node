'use strict';

const assert = require('assert');
const Bot = require('../index.js');

describe('response keyboard', () => {
    it('can be initialized with default values', () => {
        let kb = new Bot.ResponseKeyboard();

        assert.deepEqual(kb.toJSON(), {
            'type': 'suggested',
            'responses': [],
            'hidden': false
        });
    });

    it('can be initialized with the hidden parameter set to false', () => {
        let kb = new Bot.ResponseKeyboard(null, false);

        assert.deepEqual(kb.toJSON(), {
            'type': 'suggested',
            'responses': [],
            'hidden': false
        });
    });

    it('can be initialized with the hidden parameter set to true', () => {
        let kb = new Bot.ResponseKeyboard(null, true);

        assert.deepEqual(kb.toJSON(), {
            'type': 'suggested',
            'responses': [],
            'hidden': true
        });
    });

    it('can be initialized with a username', () => {
        let kb = new Bot.ResponseKeyboard(null, null, 'remvst');

        assert.deepEqual(kb.toJSON(), {
            'type': 'suggested',
            'responses': [],
            'hidden': false,
            'to': 'remvst'
        });
    });

    it('can be initialized with responses', () => {
        let kb = new Bot.ResponseKeyboard(['1', '2'], null, 'remvst');

        assert.deepEqual(kb.toJSON(), {
            'type': 'suggested',
            'responses': [{
                'type': 'text',
                'body': '1'
            }, {
                'type': 'text',
                'body': '2'
            }],
            'hidden': false,
            'to': 'remvst'
        });
    });

    it('cannot be created with an invalid username', () => {
        assert.throws(() => {
            new Bot.ResponseKeyboard(['1', '2'], null, 'r');
        });
    });

    it('can get new responses after being created', () => {
        let kb = new Bot.ResponseKeyboard();
        kb.addResponse('1');
        kb.addResponse('2');

        assert.deepEqual(kb.toJSON(), {
            'type': 'suggested',
            'responses': [{
                'type': 'text',
                'body': '1'
            }, {
                'type': 'text',
                'body': '2'
            }],
            'hidden': false
        });
    });

    it('can use fully fledged response objects', () => {
        let kb = new Bot.ResponseKeyboard();
        kb.addResponse(Bot.Response.text('1'));
        kb.addResponse(Bot.Response.friendPicker('2'));

        assert.deepEqual(kb.toJSON(), {
            'type': 'suggested',
            'responses': [{
                'type': 'text',
                'body': '1'
            }, {
                'type': 'friend-picker',
                'body': '2'
            }],
            'hidden': false
        });
    });
});
