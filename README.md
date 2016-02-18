## Example: Echo Bot

```javascript
'use strict';

let util = require('util');
let http = require('http');
let Bot  = require('node-kik-bot');

// configure the bot API endpoint, details for your bot
let echoTheBot = new Bot({
    username: 'echo.bot',
    apiToken: '7b939d69-e840-4d22-aab8-4188c2198f8a'
});

echoTheBot.textMessage((msg, bot, next) => {
    bot.reply(msg, msg.body);
    next();
});

// set up your server and start listening
let server = http
    .createServer(echoTheBot.incoming())
    .listen(process.env.PORT || 8080);
```

## Example: sending a message to a specific user
```javascript
// To one user:
bot.send('user1', Bot.Message.text('some text'));
bot.send('user1', 'some text'); // shorthand for text messages

// To multiple users
bot.send(['user1', 'user2'], 'some text');
```
