[![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

## Getting Started

- Install with [`npm install @kikinteractive/kik`](npm-url)

## Contributing

This project adheres to the Contributor Covenant [code of conduct](code-of-conduct-url). By participating, you are expected to uphold this code. Please report unacceptable behavior to bots@kik.com.

## Getting Help

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

## License

The Kik bot library is released under the terms of the MIT license. See [License](LICENSE.md) for more information or see https://opensource.org/licenses/MIT.

[travis-image]: https://travis-ci.com/kikinteractive/kik-node.svg?token=iHkQJ3F1VxtmX1aAG1ky&branch=master
[travis-url]: https://travis-ci.com/kikinteractive/kik-node

[coveralls-image]: https://coveralls.io/repos/github/kikinteractive/kik-node/badge.svg?branch=master&t=4MPOax
[coveralls-url]: https://coveralls.io/github/kikinteractive/kik-node?branch=master

[npm-image]: https://img.shields.io/npm/v/@kikinteractive/kik.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/@kikinteractive/kik

[stackoverflow-url]: http://stackoverflow.com/questions/tagged/kik

[code-of-conduct-url]: CODE_OF_CONDUCT.md

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
    * [.broadcast(messages, recipients)](#Bot+broadcast)
    * [.send(messages, recipient, [chatId])](#Bot+send)
    * [.incoming()](#Bot+incoming)

<a name="new_Bot_new"></a>
### new Bot()

| Param | Type | Description |
| --- | --- | --- |
| options.username | <code>string</code> |  |
| options.apiKey | <code>string</code> |  |
| [options.incomingPath] | <code>string</code> | Set true to enable polling or set options |
| [options.automaticReadReceipts] | <code>boolean</code> |  |
| [options.receiveReadReceipts] | <code>boolean</code> |  |
| [options.receiveDeliveryReceipts] | <code>boolean</code> |  |
| [options.receiveIsTyping] | <code>boolean</code> |  |
| [options.inlineEnabled] | <code>boolean</code> |  |

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
bot.onTextMessage((incoming, next) => {
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
bot.onTextMessage(/^hi|hello|bonjour$/i, (incoming, next) => {
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

| Param | Type | Description |
| --- | --- | --- |
| [options.data] | <code>string</code> &#124; <code>object</code> | The data to be sent back to this bot after                                        the user scans |
| [options.width] | <code>number</code> | Width of the Kik code in the PNG image |
| [options.height] | <code>number</code> | Height of the Kik code in the PNG image |
| [options.size] | <code>number</code> | Helper for the width and height in the PNG image |
| [options.color] | <code>number</code> | The color which the user will see after scanning.                                  See {KikCode.Colors} |

<a name="Bot+getUserProfile"></a>
### bot.getUserProfile() ⇒ <code>[promise.&lt;UserProfile&gt;](#UserProfile)</code>
**Kind**: instance method of <code>[Bot](#Bot)</code>  
<a name="Bot+broadcast"></a>
### bot.broadcast(messages, recipients)
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| messages | <code>array</code> | 
| recipients | <code>array</code> | 

<a name="Bot+send"></a>
### bot.send(messages, recipient, [chatId])
**Kind**: instance method of <code>[Bot](#Bot)</code>  

| Param | Type |
| --- | --- |
| messages | <code>array</code> | 
| recipient | <code>string</code> | 
| [chatId] | <code>string</code> | 

<a name="Bot+incoming"></a>
### bot.incoming()
Handles the incoming requests for messages and for the bot.json
 manifest.

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
    * [.ignore()](#IncomingMessage+ignore)

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
<a name="IncomingMessage+ignore"></a>
### incomingMessage.ignore()
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
        * [.loop](#Message+loop) ⇒ <code>boolean</code>
        * [.muted](#Message+muted) ⇒ <code>boolean</code>
        * [.autoplay](#Message+autoplay) ⇒ <code>boolean</code>
        * [.noSave](#Message+noSave) ⇒ <code>boolean</code>
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
        * [.addTextResponse(text)](#Message+addTextResponse) ⇒ <code>[Message](#Message)</code>
        * [.addResponseKeyboard(suggestions, [isHidden], [user])](#Message+addResponseKeyboard) ⇒ <code>[Message](#Message)</code>
        * [.setKikJsData(kikJsData)](#Message+setKikJsData) ⇒ <code>[Message](#Message)</code>
        * [.setPicUrl(picUrl)](#Message+setPicUrl) ⇒ <code>[Message](#Message)</code>
        * [.setNoForward(noForward)](#Message+setNoForward) ⇒ <code>[Message](#Message)</code>
        * [.setIsTyping(isTyping)](#Message+setIsTyping) ⇒ <code>[Message](#Message)</code>
        * [.setMessageIds(messageIds)](#Message+setMessageIds) ⇒ <code>[Message](#Message)</code>
        * [.setBody(body)](#Message+setBody) ⇒ <code>[Message](#Message)</code>
        * [.setText(text)](#Message+setText) ⇒ <code>[Message](#Message)</code>
        * [.setTitle(title)](#Message+setTitle) ⇒ <code>[Message](#Message)</code>
        * [.setUrl(url)](#Message+setUrl) ⇒ <code>[Message](#Message)</code>
        * [.setVideoUrl(videoUrl)](#Message+setVideoUrl) ⇒ <code>[Message](#Message)</code>
        * [.setDelay(delay)](#Message+setDelay) ⇒ <code>[Message](#Message)</code>
        * [.setTypeTime(typeTime)](#Message+setTypeTime) ⇒ <code>[Message](#Message)</code>
        * [.setAttributionName(attributionName)](#Message+setAttributionName) ⇒ <code>[Message](#Message)</code>
        * [.setAttributionIcon(attributionIcon)](#Message+setAttributionIcon) ⇒ <code>[Message](#Message)</code>
        * [.setLoop(loop)](#Message+setLoop) ⇒ <code>[Message](#Message)</code>
        * [.setMuted(muted)](#Message+setMuted) ⇒ <code>[Message](#Message)</code>
        * [.setAutoplay(autoplay)](#Message+setAutoplay) ⇒ <code>[Message](#Message)</code>
        * [.setNoSave(noSave)](#Message+setNoSave) ⇒ <code>[Message](#Message)</code>
    * _static_
        * [.text()](#Message.text) ⇒ <code>[Message](#Message)</code>
        * [.link()](#Message.link) ⇒ <code>[Message](#Message)</code>
        * [.picture()](#Message.picture) ⇒ <code>[Message](#Message)</code>
        * [.video()](#Message.video) ⇒ <code>[Message](#Message)</code>
        * [.isTyping()](#Message.isTyping) ⇒ <code>[Message](#Message)</code>
        * [.readReceipt()](#Message.readReceipt) ⇒ <code>[Message](#Message)</code>

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
<a name="Message+loop"></a>
### message.loop ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#loop

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+muted"></a>
### message.muted ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#muted

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+autoplay"></a>
### message.autoplay ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#autoplay

**Kind**: instance property of <code>[Message](#Message)</code>  
<a name="Message+noSave"></a>
### message.noSave ⇒ <code>boolean</code>
See https://bots.kik.com/docs/messages#noSave

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
<a name="Message+addTextResponse"></a>
### message.addTextResponse(text) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type |
| --- | --- |
| text | <code>string</code> | 

<a name="Message+addResponseKeyboard"></a>
### message.addResponseKeyboard(suggestions, [isHidden], [user]) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type |
| --- | --- |
| suggestions | <code>array</code> | 
| [isHidden] | <code>boolean</code> | 
| [user] | <code>string</code> | 

<a name="Message+setKikJsData"></a>
### message.setKikJsData(kikJsData) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| kikJsData | <code>string</code> | Description-y bits |

<a name="Message+setPicUrl"></a>
### message.setPicUrl(picUrl) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| picUrl | <code>string</code> | Description-y bits |

<a name="Message+setNoForward"></a>
### message.setNoForward(noForward) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| noForward | <code>string</code> | Description-y bits |

<a name="Message+setIsTyping"></a>
### message.setIsTyping(isTyping) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| isTyping | <code>string</code> | Description-y bits |

<a name="Message+setMessageIds"></a>
### message.setMessageIds(messageIds) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| messageIds | <code>array</code> | Description-y bits |

<a name="Message+setBody"></a>
### message.setBody(body) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>string</code> | Description-y bits |

<a name="Message+setText"></a>
### message.setText(text) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | Description-y bits |

<a name="Message+setTitle"></a>
### message.setTitle(title) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | Description-y bits |

<a name="Message+setUrl"></a>
### message.setUrl(url) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | Description-y bits |

<a name="Message+setVideoUrl"></a>
### message.setVideoUrl(videoUrl) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| videoUrl | <code>string</code> | Description-y bits |

<a name="Message+setDelay"></a>
### message.setDelay(delay) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| delay | <code>string</code> | Description-y bits |

<a name="Message+setTypeTime"></a>
### message.setTypeTime(typeTime) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| typeTime | <code>string</code> | Description-y bits |

<a name="Message+setAttributionName"></a>
### message.setAttributionName(attributionName) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| attributionName | <code>string</code> | Description-y bits |

<a name="Message+setAttributionIcon"></a>
### message.setAttributionIcon(attributionIcon) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| attributionIcon | <code>string</code> | Description-y bits |

<a name="Message+setLoop"></a>
### message.setLoop(loop) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| loop | <code>boolean</code> | Description |

<a name="Message+setMuted"></a>
### message.setMuted(muted) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| muted | <code>boolean</code> | Description |

<a name="Message+setAutoplay"></a>
### message.setAutoplay(autoplay) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| autoplay | <code>boolean</code> | Description |

<a name="Message+setNoSave"></a>
### message.setNoSave(noSave) ⇒ <code>[Message](#Message)</code>
**Kind**: instance method of <code>[Message](#Message)</code>  

| Param | Type | Description |
| --- | --- | --- |
| noSave | <code>boolean</code> | Description |

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
<a name="Message.readReceipt"></a>
### Message.readReceipt() ⇒ <code>[Message](#Message)</code>
See https://bots.kik.com/docs/messages#receipts

**Kind**: static method of <code>[Message](#Message)</code>  

<a name="KikCode"></a>
## KikCode
**Kind**: global class  
<a name="KikCode.Colors"></a>
### KikCode.Colors : <code>enum</code>
KikCode.Colors

**Kind**: static enum property of <code>[KikCode](#KikCode)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| KikBlue | <code>number</code> | <code>0</code> | #42B4E6 |
| Turquoise | <code>number</code> | <code>1</code> | #42DFD8 |
| Mint | <code>number</code> | <code>2</code> | #24D7A7 |
| Forest | <code>number</code> | <code>3</code> | #25912B |
| KikGreen | <code>number</code> | <code>4</code> | #87D300 |
| Sunshine | <code>number</code> | <code>5</code> | #F8CB1C |
| OrangeCreamsicle | <code>number</code> | <code>6</code> | #FC971B |
| BloodOrange | <code>number</code> | <code>7</code> | #F9703A |
| CandyAppleRed | <code>number</code> | <code>8</code> | #F7373C |
| Salmon | <code>number</code> | <code>9</code> | #F88585 |
| Coral | <code>number</code> | <code>10</code> | #F767C3 |
| Cranberry | <code>number</code> | <code>11</code> | #940D65 |
| Lavender | <code>number</code> | <code>12</code> | #CB94FF |
| RoyalPurple | <code>number</code> | <code>13</code> | #8737F8 |
| Marine | <code>number</code> | <code>14</code> | #353CD4 |
| Steel | <code>number</code> | <code>15</code> | #5D7687 |


