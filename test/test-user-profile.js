'use strict';

let nock = require('nock');
let request = require('supertest');
let assert = require('assert');
let Bot = require('../index.js');

const BOT_USERNAME = 'testbot';
const BOT_API_KEY = '2042cd8e-638c-4183-aef4-d4bef6f01981';

describe('Get user profile info', () => {
    it('fetches', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        let engine = nock('https://api.kik.com')
            .get('/api/v1/user/testuser1')
            .reply(200, {
                firstName: 'Gwendolyn',
                lastName: 'Ferguson',
                profilePicUrl: 'https://randomuser.me/api/portraits/women/21.jpg',
                profilePicLastModified: 1458959883
            });

        bot.getUserProfile('testuser1')
            .then((profile) => {
                assert.equal(profile.username,
                    'testuser1');
                assert.equal(profile.displayName,
                    'Gwendolyn Ferguson');
                assert.equal(profile.firstName,
                    'Gwendolyn');
                assert.equal(profile.lastName,
                    'Ferguson');
                assert.equal(profile.profilePicUrl,
                    'https://randomuser.me/api/portraits/women/21.jpg');
                assert.equal(profile.profilePicLastModified,
                    1458959883);

                done();
            }, (err) => {
                assert.fail(err);
            });
    });

    it('fetches multiple at the same time', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        let engine = nock('https://api.kik.com')
            .get('/api/v1/user/testuser1')
            .reply(200, {
                firstName: 'Test',
                lastName: 'Guy',
            })
            .get('/api/v1/user/testuser2')
            .reply(200, {
                firstName: 'Test2',
                lastName: 'Guy',
            });

        bot.getUserProfile(['testuser1', 'testuser2'])
            .then((profiles) => {
                const profile1 = profiles[0];
                const profile2 = profiles[1];

                assert.equal(profile1.username, 'testuser1');
                assert.equal(profile1.displayName, 'Test Guy');
                assert.equal(profile1.firstName, 'Test');
                assert.equal(profile1.lastName, 'Guy');

                assert.equal(profile2.username, 'testuser2');
                assert.equal(profile2.displayName, 'Test2 Guy');
                assert.equal(profile2.firstName, 'Test2');
                assert.equal(profile2.lastName, 'Guy');

                done();
            }, (err) => {
                assert.fail(err);
            });
    });

    it('fails when user does not exist', (done) => {
        let bot = new Bot({
            username: BOT_USERNAME,
            apiKey: BOT_API_KEY,
            skipSignatureCheck: true
        });

        let engine = nock('https://api.kik.com')
            .get('/api/v1/user/testuser12')
            .reply(404);

        bot.getUserProfile('testuser12')
            .then((profile) => {
                assert.fail('Profile should not exist');
            }, (err) => {
                done();
            });
    });
});
