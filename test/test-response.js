'use strict';

const assert = require('assert');
const Bot = require('../index.js');

describe('responses', () => {
    describe('text', () => {
        it('can be generated with a string', () => {
            const response = Bot.Response.text('yolo');

            assert.deepEqual(response, {
                'type': 'text',
                'body': 'yolo'
            });
        });

        it('can be generated with a number', () => {
            const response = Bot.Response.text(123);

            assert.deepEqual(response, {
                'type': 'text',
                'body': '123'
            });
            assert.equal(response.body.length, 3);
        });
    });

    describe('friend picker', () => {
        it('can be initialized with no parameters', () => {
            const response = Bot.Response.friendPicker();

            assert.deepEqual(response, {
                'type': 'friend-picker'
            });
        });

        it('can be initialized with a string', () => {
            const response = Bot.Response.friendPicker('yolo');

            assert.deepEqual(response, {
                'type': 'friend-picker',
                'body': 'yolo'
            });
        });

        it('can be initialized with a min value', () => {
            const response = Bot.Response.friendPicker('yolo', 3);

            assert.deepEqual(response, {
                'type': 'friend-picker',
                'body': 'yolo',
                'min': 3
            });
        });

        it('can be initialized with min and max value', () => {
            const response = Bot.Response.friendPicker('yolo', 3, 5);

            assert.deepEqual(response, {
                'type': 'friend-picker',
                'body': 'yolo',
                'min': 3,
                'max': 5
            });
        });

        it('can be initialized with min and max value and preselected users', () => {
            const response = Bot.Response.friendPicker('yolo', 3, 5, ['remi', 'was', 'here']);

            assert.deepEqual(response, {
                'type': 'friend-picker',
                'body': 'yolo',
                'min': 3,
                'max': 5,
                'preselected': ['remi', 'was', 'here']
            });
        });

        it('can be initialized with just preselected users', () => {
            const response = Bot.Response.friendPicker('yolo', null, null, ['remi', 'was', 'here']);

            assert.deepEqual(response, {
                'type': 'friend-picker',
                'body': 'yolo',
                'preselected': ['remi', 'was', 'here']
            });
        });
    });

    describe('picture', () => {
        it('can be initialized with just a picture URL', () => {
            const response = Bot.Response.picture('yolo');

            assert.deepEqual(response, {
                'type': 'picture',
                'picUrl': 'yolo',
                'metadata': {}
            });
        });

        it('can be initialized with a picture URL and metadata', () => {
            const response = Bot.Response.picture('remi', { 'was': 'here' });

            assert.deepEqual(response, {
                'type': 'picture',
                'picUrl': 'remi',
                'metadata': {
                    'was': 'here'
                }
            });
        });
    });
});
