'use strict';

let nock = require('nock');
let request = require('supertest');
let assert = require('assert');
let Bot = require('../index.js');

const BOT_USERNAME = 'testbot';
const BOT_API_KEY = '2042cd8e-638c-4183-aef4-d4bef6f0198';

describe('Bot construction', () => {
    it('throws for a missing API key', () => {
        assert.throws(() => {
            let bot = new Bot({
                username: BOT_USERNAME
            });
        });
    });

    it('throws for an invalid API key', () => {
        assert.throws(() => {
            let bot = new Bot({
                username: BOT_USERNAME,
                apiKey: '123123123y'
            });
        });
    });

    it('throws for a missing username', () => {
        assert.throws(() => {
            let bot = new Bot({
                apiKey: BOT_API_KEY
            });
        });
    });

    it('throws for an invalid username', () => {
        assert.throws(() => {
            let bot = new Bot({
                username: 'abc-123',
                apiKey: BOT_API_KEY
            });
        });
    });
});
