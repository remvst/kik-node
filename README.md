## Example: Echo Bot

```javascript
'use strict';

let util = require('util');
let http = require('http');
let Bot  = require('node-kik-bot');

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

## Example: Sending a message to a specific user

```javascript
// To one user:
bot.send('user1', Bot.Message.text('some text'));
bot.send('user1', 'some text'); // shorthand for text messages

// To multiple users
bot.send(['user1', 'user2'], 'some text');
```

## Example: Greeting a user by name

```javascript
bot.onTextMessage((message) => {
    bot.getUserProfile(message.from)
        .then((user) => {
            message.reply(`Hey ${user.firstName}!`);
        });
});
```

## API Documentation

<a name="Bot"></a>
## Bot
<a name="new_Bot_new"></a>
### new Bot()

| Param | Type | Description |
| --- | --- | --- |
| options.username | <code>String</code> |  |
| options.apiToken | <code>String</code> |  |
| [options.incomingPath] | <code>String</code> | Set true to enable polling or set options |

