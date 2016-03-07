[![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

## Getting Started

- Install with [npm](https://npmjs.org): `npm install kik-node`

## Features

## More information

Here are other resources for using Kik node:

- [stackoverflow.com][so] is a great place to get answers about Less.

## How To

### Echo Bot

```javascript
'use strict';

let util = require('util');
let http = require('http');
let Bot  = require('kik-node');

// configure the bot API endpoint, details for your bot
let bot = new Bot({
    username: 'echo.bot',
    apiKey: '7b939d69-e840-4d22-aab8-4188c2198f8a'
});

bot.onTextMessage((message) => {
    message.reply(Bot.Message.text(msg.body));
});

// set up your server and start listening
let server = http
    .createServer(bot.incoming())
    .listen(process.env.PORT || 8080);
```

### Sending a message to a specific user

```javascript
// To one user:
bot.send('user1', Bot.Message.text('some text'));
bot.send('user1', 'some text'); // shorthand for text messages

// To multiple users
bot.send(['user1', 'user2'], 'some text');
```

### Greeting a user by name

```javascript
bot.onTextMessage((message) => {
    bot.getUserProfile(message.from)
        .then((user) => {
            message.reply(`Hey ${user.firstName}!`);
        });
});
```

## [License](LICENSE)

[travis-image]: https://travis-ci.org/kikinteractive/kik-node.svg?branch=master
[travis-url]: https://travis-ci.org/kikinteractive/kik-node

[coveralls-image]: https://coveralls.io/repos/kikinteractive/kik-node/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/kikinteractive/kik-node?branch=master

[npm-image]: https://img.shields.io/npm/v/kik-node.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/kik-node

## API Documentation

<a name="Bot"></a>
## Bot
<a name="new_Bot_new"></a>
### new Bot()

| Param | Type | Description |
| --- | --- | --- |
| options.username | <code>String</code> |  |
| options.apiKey | <code>String</code> |  |
| [options.incomingPath] | <code>String</code> | Set true to enable polling or set options |

