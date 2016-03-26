[![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

## Getting Started

- Install with [`npm install @kikinteractive/kik`](npm-url)

## Features

## More information

Here are other resources for using Kik node:

- [stackoverflow.com][stackoverflow-url] is a great place to get answers about building Kik chat bot.

## How To

### Echo Bot

```javascript
'use strict';

let util = require('util');
let http = require('http');
let Bot  = require('@kikinteractive/kik');

// configure the bot API endpoint, details for your bot
let bot = new Bot({
    username: 'echo.bot',
    apiKey: '7b939d69-e840-4d22-aab8-4188c2198f8a'
});

bot.onTextMessage((message) => {
    message.reply(message.body);
});

// set up your server and start listening
let server = http
    .createServer(bot.incoming())
    .listen(process.env.PORT || 8080);
```

### Sending a message to a specific user

```javascript
// To one user:
bot.send(Bot.Message.text('some text'), 'user1');
bot.send('some text', 'user1'); // shorthand for text messages

// To multiple users
bot.send('some text', ['user1', 'user2']);
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

## [License](LICENSE.md)

[travis-image]: https://travis-ci.org/kikinteractive/kik-node.svg?branch=master
[travis-url]: https://travis-ci.org/kikinteractive/kik-node

[coveralls-image]: https://coveralls.io/repos/kikinteractive/kik-node/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/kikinteractive/kik-node?branch=master

[npm-image]: https://img.shields.io/npm/v/@kikinteractive/kik.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/@kikinteractive/kik

[stackoverflow-url]: http://stackoverflow.com/questions/tagged/kik

## API Documentation

<a name="Bot"></a>
## Bot
Bot
 This is a test

**Kind**: global class  
**See**: https://bots.kik.com  

* [Bot](#Bot)
    * [new Bot()](#new_Bot_new)
    * [.use(handler)](#Bot+use)
    * [.onTextMessage([text], handler)](#Bot+onTextMessage)
    * [.onLinkMessage(handler)](#Bot+onLinkMessage)
    * [.onPictureMessage(handler)](#Bot+onPictureMessage)
    * [.onVideoMessage(handler)](#Bot+onVideoMessage)
    * [.onStartChattingMessage(handler)](#Bot+onStartChattingMessage)
    * [.onScanDataMessage(handler)](#Bot+onScanDataMessage)
    * [.onStickerMessage(handler)](#Bot+onStickerMessage)
    * [.onIsTypingMessage(handler)](#Bot+onIsTypingMessage)
    * [.onDeliveryReceiptMessage(handler)](#Bot+onDeliveryReceiptMessage)
    * [.onReadReceiptMessage(handler)](#Bot+onReadReceiptMessage)
    * [.getKikCodeUrl()](#Bot+getKikCodeUrl) ⇒ <code>promise.&lt;string&gt;</code>
    * [.getUserProfile()](#Bot+getUserProfile) ⇒ <code>[promise.&lt;UserProfile&gt;](#UserProfile)</code>

<a name="new_Bot_new"></a>
### new Bot()

| Param | Type | Description |
| --- | --- | --- |
| options.username | <code>String</code> |  |
| options.apiKey | <code>String</code> |  |
| [options.incomingPath] | <code>String</code> | Set true to enable polling or set options |

<a name="Bot+use"></a>
### bot.use(handler)
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| handler | <code>[MessageHandlerCallback](#MessageHandlerCallback)</code> | 

<a name="Bot+onTextMessage"></a>
### bot.onTextMessage([text], handler)
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| [text] | <code>string</code> &#124; <code>regexp</code> | 
| handler | <code>[MessageHandlerCallback](#MessageHandlerCallback)</code> | 

**Example**  
```js
bot.onTextMessage((incoming, bot) => {
     // reply handles the message and stops other handlers
     // from being called for this message
     incoming.reply(`Hi I'm ${bot.username}`);
 });
 
```
**Example**  
```js
bot.onTextMessage((incoming, bot, next) => {
     if (incoming.body !== 'Hi') {
         // we only handle welcoming, let someone else deal with this
         // message
         return next();
     }

     // say hello...
 });
 
```
**Example**  
```js
bot.onTextMessage(/^hi|hello|bonjour$/i, (incoming, bot, next) => {
     // say hello...
 });
```
<a name="Bot+onLinkMessage"></a>
### bot.onLinkMessage(handler)
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| handler | <code>[MessageHandlerCallback](#MessageHandlerCallback)</code> | 

<a name="Bot+onPictureMessage"></a>
### bot.onPictureMessage(handler)
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| handler | <code>[MessageHandlerCallback](#MessageHandlerCallback)</code> | 

<a name="Bot+onVideoMessage"></a>
### bot.onVideoMessage(handler)
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| handler | <code>[MessageHandlerCallback](#MessageHandlerCallback)</code> | 

<a name="Bot+onStartChattingMessage"></a>
### bot.onStartChattingMessage(handler)
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| handler | <code>[MessageHandlerCallback](#MessageHandlerCallback)</code> | 

<a name="Bot+onScanDataMessage"></a>
### bot.onScanDataMessage(handler)
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| handler | <code>[MessageHandlerCallback](#MessageHandlerCallback)</code> | 

<a name="Bot+onStickerMessage"></a>
### bot.onStickerMessage(handler)
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| handler | <code>[MessageHandlerCallback](#MessageHandlerCallback)</code> | 

<a name="Bot+onIsTypingMessage"></a>
### bot.onIsTypingMessage(handler)
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| handler | <code>[MessageHandlerCallback](#MessageHandlerCallback)</code> | 

<a name="Bot+onDeliveryReceiptMessage"></a>
### bot.onDeliveryReceiptMessage(handler)
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| handler | <code>[MessageHandlerCallback](#MessageHandlerCallback)</code> | 

<a name="Bot+onReadReceiptMessage"></a>
### bot.onReadReceiptMessage(handler)
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| handler | <code>[MessageHandlerCallback](#MessageHandlerCallback)</code> | 

<a name="Bot+getKikCodeUrl"></a>
### bot.getKikCodeUrl() ⇒ <code>promise.&lt;string&gt;</code>
Creates a Kik Code with the intended options and returns the
 URL of the Kik Code image. If the options specify a data Kik Code
 this will hit the Kik Code service and store that data for you.

**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| [options.data] | <code>string</code> &#124; <code>object</code> | 

<a name="Bot+getUserProfile"></a>
### bot.getUserProfile() ⇒ <code>[promise.&lt;UserProfile&gt;](#UserProfile)</code>
**Kind**: instance method of <code>[Bot](#Bot)</code>  

<a name="IncomingMessage"></a>
## IncomingMessage
IncomingMessage
 This is a test

**Kind**: global class  

* [IncomingMessage](#IncomingMessage)
    * [.reply(messages)](#IncomingMessage+reply) ⇒ <code>promise.&lt;object&gt;</code>
    * [.markRead()](#IncomingMessage+markRead) ⇒ <code>promise.&lt;object&gt;</code>
    * [.startTyping()](#IncomingMessage+startTyping) ⇒ <code>promise.&lt;object&gt;</code>
    * [.stopTyping()](#IncomingMessage+stopTyping) ⇒ <code>promise.&lt;object&gt;</code>

<a name="IncomingMessage+reply"></a>
### incomingMessage.reply(messages) ⇒ <code>promise.&lt;object&gt;</code>
**Kind**: instance method of <code>[IncomingMessage](#IncomingMessage)</code>  

| Param | Type |
| --- | --- |
| messages | <code>[Message](#Message)</code> &#124; <code>[array.&lt;Message&gt;](#Message)</code> | 

<a name="IncomingMessage+markRead"></a>
### incomingMessage.markRead() ⇒ <code>promise.&lt;object&gt;</code>
**Kind**: instance method of <code>[IncomingMessage](#IncomingMessage)</code>  
<a name="IncomingMessage+startTyping"></a>
### incomingMessage.startTyping() ⇒ <code>promise.&lt;object&gt;</code>
**Kind**: instance method of <code>[IncomingMessage](#IncomingMessage)</code>  
<a name="IncomingMessage+stopTyping"></a>
### incomingMessage.stopTyping() ⇒ <code>promise.&lt;object&gt;</code>
**Kind**: instance method of <code>[IncomingMessage](#IncomingMessage)</code>  


<a name="UserProfile"></a>
## UserProfile
**Kind**: global class  

* [UserProfile](#UserProfile)
    * [.displayName](#UserProfile+displayName) ⇒ <code>string</code>
    * [.username](#UserProfile+username) ⇒ <code>string</code>
    * [.firstName](#UserProfile+firstName) ⇒ <code>string</code>
    * [.lastName](#UserProfile+lastName) ⇒ <code>string</code>
    * [.profilePicUrl](#UserProfile+profilePicUrl) ⇒ <code>string</code>
    * [.profilePicLastModified](#UserProfile+profilePicLastModified) ⇒ <code>number</code>

<a name="UserProfile+displayName"></a>
### userProfile.displayName ⇒ <code>string</code>
**Kind**: instance property of <code>[UserProfile](#UserProfile)</code>  
<a name="UserProfile+username"></a>
### userProfile.username ⇒ <code>string</code>
**Kind**: instance property of <code>[UserProfile](#UserProfile)</code>  
<a name="UserProfile+firstName"></a>
### userProfile.firstName ⇒ <code>string</code>
**Kind**: instance property of <code>[UserProfile](#UserProfile)</code>  
<a name="UserProfile+lastName"></a>
### userProfile.lastName ⇒ <code>string</code>
**Kind**: instance property of <code>[UserProfile](#UserProfile)</code>  
<a name="UserProfile+profilePicUrl"></a>
### userProfile.profilePicUrl ⇒ <code>string</code>
**Kind**: instance property of <code>[UserProfile](#UserProfile)</code>  
<a name="UserProfile+profilePicLastModified"></a>
### userProfile.profilePicLastModified ⇒ <code>number</code>
**Kind**: instance property of <code>[UserProfile](#UserProfile)</code>  

<a name="Message"></a>
## Message
Message
This is a test

**Kind**: global class  

* [Message](#Message)
    * _instance_
        * [.from](#Message+from) ⇒ <code>string</code>
        * [.id](#Message+id) ⇒ <code>string</code>
        * [.chatId](#Message+chatId) ⇒ <code>string</code>
        * [.messageIds](#Message+messageIds) ⇒ <code>string</code>
        * [.readReceiptRequested](#Message+readReceiptRequested) ⇒ <code>string</code>
        * [.stickerPackId](#Message+stickerPackId) ⇒ <code>string</code>
        * [.scanData](#Message+scanData) ⇒ <code>string</code>
        * [.stickerUrl](#Message+stickerUrl) ⇒ <code>string</code>
        * [.timestamp](#Message+timestamp) ⇒ <code>string</code>
        * [.to](#Message+to) ⇒ <code>string</code>
        * [.type](#Message+type) ⇒ <code>string</code>
        * [.kikJsData](#Message+kikJsData) ⇒ <code>string</code>
        * [.picUrl](#Message+picUrl) ⇒ <code>string</code>
        * [.noForward](#Message+noForward) ⇒ <code>string</code>
        * [.isTyping](#Message+isTyping) ⇒ <code>string</code>
        * [.body](#Message+body) ⇒ <code>string</code>
        * [.text](#Message+text) ⇒ <code>string</code>
        * [.title](#Message+title) ⇒ <code>string</code>
        * [.url](#Message+url) ⇒ <code>string</code>
        * [.videoUrl](#Message+videoUrl) ⇒ <code>string</code>
        * [.delay](#Message+delay) ⇒ <code>string</code>
        * [.typeTime](#Message+typeTime) ⇒ <code>string</code>
        * [.attributionName](#Message+attributionName) ⇒ <code>string</code>
        * [.attributionIcon](#Message+attributionIcon) ⇒ <code>string</code>
        * [.isTextMessage()](#Message+isTextMessage) ⇒ <code>boolean</code>
        * [.isLinkMessage()](#Message+isLinkMessage) ⇒ <code>boolean</code>
        * [.isPictureMessage()](#Message+isPictureMessage) ⇒ <code>boolean</code>
        * [.isVideoMessage()](#Message+isVideoMessage) ⇒ <code>boolean</code>
        * [.isStartChattingMessage()](#Message+isStartChattingMessage) ⇒ <code>boolean</code>
        * [.isScanDataMessage()](#Message+isScanDataMessage) ⇒ <code>boolean</code>
        * [.isStickerMessage()](#Message+isStickerMessage) ⇒ <code>boolean</code>
        * [.isIsTypingMessage()](#Message+isIsTypingMessage) ⇒ <code>boolean</code>
        * [.isDeliveryReceiptMessage()](#Message+isDeliveryReceiptMessage) ⇒ <code>boolean</code>
        * [.isReadReceiptMessage()](#Message+isReadReceiptMessage) ⇒ <code>boolean</code>
        * [.setKikJsData(kikJsData)](#Message+setKikJsData) ⇒ <code>[Message](#Message)</code>
        * [.setPicUrl(picUrl)](#Message+setPicUrl) ⇒ <code>[Message](#Message)</code>
        * [.setNoForward(noForward)](#Message+setNoForward) ⇒ <code>[Message](#Message)</code>
        * [.setIsTyping(isTyping)](#Message+setIsTyping) ⇒ <code>[Message](#Message)</code>
        * [.setBody(body)](#Message+setBody) ⇒ <code>[Message](#Message)</code>
        * [.setText(text)](#Message+setText) ⇒ <code>[Message](#Message)</code>
        * [.setTitle(title)](#Message+setTitle) ⇒ <code>[Message](#Message)</code>
        * [.setUrl(url)](#Message+setUrl) ⇒ <code>[Message](#Message)</code>
        * [.setVideoUrl(videoUrl)](#Message+setVideoUrl) ⇒ <code>[Message](#Message)</code>
        * [.setDelay(delay)](#Message+setDelay) ⇒ <code>[Message](#Message)</code>
        * [.setTypeTime(typeTime)](#Message+setTypeTime) ⇒ <code>[Message](#Message)</code>
        * [.setAttributionName(attributionName)](#Message+setAttributionName) ⇒ <code>string</code>
        * [.setAttributionIcon(attributionIcon)](#Message+setAttributionIcon) ⇒ <code>string</code>
    * _static_
        * [.text()](#Message.text) ⇒ <code>[Message](#Message)</code>
        * [.link()](#Message.link) ⇒ <code>[Message](#Message)</code>
        * [.picture()](#Message.picture) ⇒ <code>[Message](#Message)</code>
        * [.video()](#Message.video) ⇒ <code>[Message](#Message)</code>
        * [.isTyping()](#Message.isTyping) ⇒ <code>[Message](#Message)</code>

<a name="Message+from"></a>
### message.from ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#from

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+id"></a>
### message.id ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#id

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+chatId"></a>
### message.chatId ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#chatId

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+messageIds"></a>
### message.messageIds ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#messageIds

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+readReceiptRequested"></a>
### message.readReceiptRequested ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#readReceiptRequested

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+stickerPackId"></a>
### message.stickerPackId ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#stickerPackId

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+scanData"></a>
### message.scanData ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#scan-data

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+stickerUrl"></a>
### message.stickerUrl ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#stickerUrl

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+timestamp"></a>
### message.timestamp ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#timestamp

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+to"></a>
### message.to ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#to

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+type"></a>
### message.type ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#type

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+kikJsData"></a>
### message.kikJsData ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#kikJsData

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+picUrl"></a>
### message.picUrl ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#picUrl

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+noForward"></a>
### message.noForward ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#noForward

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+isTyping"></a>
### message.isTyping ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#isTyping

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+body"></a>
### message.body ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#body

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+text"></a>
### message.text ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#text

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+title"></a>
### message.title ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#title

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+url"></a>
### message.url ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#url

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+videoUrl"></a>
### message.videoUrl ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#videoUrl

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+delay"></a>
### message.delay ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#delay

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+typeTime"></a>
### message.typeTime ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#typeTime

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+attributionName"></a>
### message.attributionName ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#attribution

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+attributionIcon"></a>
### message.attributionIcon ⇒ <code>string</code>
See https://bots.kik.com/docs/messages#attribution

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+isTextMessage"></a>
### message.isTextMessage() ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#text

**Kind**: instance method of <code>[Message](#Message)</code>  
<a name="Message+isLinkMessage"></a>
### message.isLinkMessage() ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#link

**Kind**: instance method of <code>[Message](#Message)</code>  
<a name="Message+isPictureMessage"></a>
### message.isPictureMessage() ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#picture

**Kind**: instance method of <code>[Message](#Message)</code>  
<a name="Message+isVideoMessage"></a>
### message.isVideoMessage() ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#video

**Kind**: instance method of <code>[Message](#Message)</code>  
<a name="Message+isStartChattingMessage"></a>
### message.isStartChattingMessage() ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#start-chatting

**Kind**: instance method of <code>[Message](#Message)</code>  
<a name="Message+isScanDataMessage"></a>
### message.isScanDataMessage() ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#scan-data

**Kind**: instance method of <code>[Message](#Message)</code>  
<a name="Message+isStickerMessage"></a>
### message.isStickerMessage() ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#sticker

**Kind**: instance method of <code>[Message](#Message)</code>  
<a name="Message+isIsTypingMessage"></a>
### message.isIsTypingMessage() ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#is-typing

**Kind**: instance method of <code>[Message](#Message)</code>  
<a name="Message+isDeliveryReceiptMessage"></a>
### message.isDeliveryReceiptMessage() ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#delivery-receipt

**Kind**: instance method of <code>[Message](#Message)</code>  
<a name="Message+isReadReceiptMessage"></a>
### message.isReadReceiptMessage() ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#read-receipt

**Kind**: instance method of <code>[Message](#Message)</code>  
<a name="Message+setKikJsData"></a>
### message.setKikJsData(kikJsData) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| kikJsData | <code>String</code> | Description-y bits |

<a name="Message+setPicUrl"></a>
### message.setPicUrl(picUrl) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| picUrl | <code>String</code> | Description-y bits |

<a name="Message+setNoForward"></a>
### message.setNoForward(noForward) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| noForward | <code>String</code> | Description-y bits |

<a name="Message+setIsTyping"></a>
### message.setIsTyping(isTyping) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| isTyping | <code>String</code> | Description-y bits |

<a name="Message+setBody"></a>
### message.setBody(body) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>String</code> | Description-y bits |

<a name="Message+setText"></a>
### message.setText(text) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | Description-y bits |

<a name="Message+setTitle"></a>
### message.setTitle(title) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>String</code> | Description-y bits |

<a name="Message+setUrl"></a>
### message.setUrl(url) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Description-y bits |

<a name="Message+setVideoUrl"></a>
### message.setVideoUrl(videoUrl) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| videoUrl | <code>String</code> | Description-y bits |

<a name="Message+setDelay"></a>
### message.setDelay(delay) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| delay | <code>String</code> | Description-y bits |

<a name="Message+setTypeTime"></a>
### message.setTypeTime(typeTime) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| typeTime | <code>String</code> | Description-y bits |

<a name="Message+setAttributionName"></a>
### message.setAttributionName(attributionName) ⇒ <code>string</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| attributionName | <code>String</code> | Description-y bits |

<a name="Message+setAttributionIcon"></a>
### message.setAttributionIcon(attributionIcon) ⇒ <code>string</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| attributionIcon | <code>String</code> | Description-y bits |

<a name="Message.text"></a>
### Message.text() ⇒ <code>[Message](#Message)</code>
See https://bots.kik.com/docs/messages#text

**Kind**: static method of <code>[Message](#Message)</code>  
<a name="Message.link"></a>
### Message.link() ⇒ <code>[Message](#Message)</code>
See https://bots.kik.com/docs/messages#link

**Kind**: static method of <code>[Message](#Message)</code>  
<a name="Message.picture"></a>
### Message.picture() ⇒ <code>[Message](#Message)</code>
See https://bots.kik.com/docs/messages#picture

**Kind**: static method of <code>[Message](#Message)</code>  
<a name="Message.video"></a>
### Message.video() ⇒ <code>[Message](#Message)</code>
See https://bots.kik.com/docs/messages#video

**Kind**: static method of <code>[Message](#Message)</code>  
<a name="Message.isTyping"></a>
### Message.isTyping() ⇒ <code>[Message](#Message)</code>
See https://bots.kik.com/docs/messages#isTyping

**Kind**: static method of <code>[Message](#Message)</code>  

