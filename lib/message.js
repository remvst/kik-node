'use strict';

const util = require('util');

/**
 * @class Message
 * This is a test
 */
class Message {
    constructor(type) {
        this._state = {
            type: type
        };
    }

    /**
     *  See https://bots.kik.com/docs/messages#text
     *  @return {Message}
     */
    static text(text) {
        return new Message('text').setBody(text);
    }

    /**
     *  See https://bots.kik.com/docs/messages#link
     *  @return {Message}
     */
    static link(link) {
        return new Message('link').setUrl(link);
    }

    /**
     *  See https://bots.kik.com/docs/messages#picture
     *  @return {Message}
     */
    static picture(picUrl) {
        return new Message('picture').setPicUrl(picUrl);
    }

    /**
     *  See https://bots.kik.com/docs/messages#video
     *  @return {Message}
     */
    static video(videoUrl) {
        return new Message('video').setVideoUrl(videoUrl);
    }

    /**
     *  See https://bots.kik.com/docs/messages#isTyping
     *  @return {Message}
     */
    static isTyping(typing) {
        return new Message('is-typing').setIsTyping(typing);
    }

    /**
     *  See https://bots.kik.com/docs/messages#receipts
     *  @return {Message}
     */
    static readReceipt(messageIds) {
        return new Message('read-receipt').setMessageIds(messageIds);
    }

    /**
     *  See https://bots.kik.com/docs/messages#text
     *  @return {boolean}
     */
    isTextMessage() {
        return this.type === 'text';
    }

    /**
     *  See https://bots.kik.com/docs/messages#link
     *  @return {boolean}
     */
    isLinkMessage() {
        return this.type === 'link';
    }

    /**
     *  See https://bots.kik.com/docs/messages#picture
     *  @return {boolean}
     */
    isPictureMessage() {
        return this.type === 'picture';
    }

    /**
     *  See https://bots.kik.com/docs/messages#video
     *  @return {boolean}
     */
    isVideoMessage() {
        return this.type === 'video';
    }

    /**
     *  See https://bots.kik.com/docs/messages#start-chatting
     *  @return {boolean}
     */
    isStartChattingMessage() {
        return this.type === 'start-chatting';
    }

    /**
     *  See https://bots.kik.com/docs/messages#scan-data
     *  @return {boolean}
     */
    isScanDataMessage() {
        return this.type === 'scan-data';
    }

    /**
     *  See https://bots.kik.com/docs/messages#sticker
     *  @return {boolean}
     */
    isStickerMessage() {
        return this.type === 'sticker';
    }

    /**
     *  See https://bots.kik.com/docs/messages#is-typing
     *  @return {boolean}
     */
    isIsTypingMessage() {
        return this.type === 'is-typing';
    }

    /**
     *  See https://bots.kik.com/docs/messages#delivery-receipt
     *  @return {boolean}
     */
    isDeliveryReceiptMessage() {
        return this.type === 'delivery-receipt';
    }

    /**
     *  See https://bots.kik.com/docs/messages#read-receipt
     *  @return {boolean}
     */
    isReadReceiptMessage() {
        return this.type === 'read-receipt';
    }

    /**
     *  See https://bots.kik.com/docs/messages#mentions
     *  @return {boolean}
     */
    isMention() {
        return !!this.mention;
    }

    toJSON() {
        let json;
        const state = this._state;

        if (state.type === 'text') {
            json = {
                type: 'text',
                body: '' + state.body
            };
        } else if (state.type === 'is-typing') {
            json = {
                type: 'is-typing',
                isTyping: !!state.isTyping
            };
        } else if (state.type === 'read-receipt') {
            json = {
                type: 'read-receipt',
                messageIds: state.messageIds
            };
        } else {
            if (state.type === 'picture') {
                json = {
                    type: 'picture',
                    picUrl: '' + state.picUrl
                };

                if (!util.isUndefined(state.attribution)) {
                    json.attribution = {
                        name: '' + state.attribution.name,
                        iconUrl: '' + state.attribution.iconUrl
                    };
                }
            } else if (state.type === 'link') {
                json = {
                    type: 'link',
                    url: '' + state.url
                };

                if (!util.isUndefined(state.attribution)) {
                    json.attribution = {
                        name: '' + state.attribution.name,
                        iconUrl: '' + state.attribution.iconUrl
                    };
                }
            } else if (state.type === 'video') {
                json = {
                    type: 'video',
                    videoUrl: '' + state.videoUrl,
                };

                if (!util.isUndefined(state.attribution)) {
                    json.attribution = {
                        name: '' + state.attribution.name,
                        iconUrl: '' + state.attribution.iconUrl
                    };
                }

                if (!util.isUndefined(state.loop)) {
                    json.loop = !!state.loop;
                }

                if (!util.isUndefined(state.muted)) {
                    json.muted = !!state.muted;
                }

                if (!util.isUndefined(state.autoplay)) {
                    json.autoplay = !!state.autoplay;
                }
            }

            if (util.isString(state.picUrl)) {
                json.picUrl = '' + state.picUrl;
            }

            if (util.isString(state.title)) {
                json.title = '' + state.title;
            }

            if (util.isString(state.text)) {
                json.text = '' + state.text;
            }

            if (!util.isUndefined(state.noSave)) {
                json.noSave = !!state.noSave;
            }

            if (!util.isUndefined(state.kikJsData)) {
                json.kikJsData = state.kikJsData;
            }

            if (!util.isUndefined(state.noForward)) {
                json.noForward = !!state.noForward;
            }
        }

        if (!util.isUndefined(state.typeTime)) {
            json.typeTime = +state.typeTime;
        }

        if (!util.isUndefined(state.delay)) {
            json.delay = +state.delay;
        }

        if (state.keyboards && state.keyboards.length !== 0) {
            json.keyboards = state.keyboards;
        }

        return json;
    }

    parse(json) {
        Object.keys(json).forEach((key) => {
            this._state[key] = json[key];
        });

        return this;
    }

    static fromJSON(json) {
        let msg = new Message(json.type);

        return msg.parse(json);
    }

    /**
     *  @param {string} text
     *  @return {Message}
     */
    addTextResponse(text) {
        let keyboards = this._state.keyboards || [];
        let responses = [];
        let updateExistingKeyboard = false;

        // add to an existing keyboard if all properties match
        keyboards.forEach((keyboard) => {
            if (util.isUndefined(keyboard.to)
             && util.isUndefined(keyboard.hidden)) {
                responses = keyboard.responses;
                updateExistingKeyboard = true;
            }
        });

        for (let i = 0; i < arguments.length; ++i) {
            responses.push({ type: 'text', body: '' + arguments[i] });
        }

        if (!updateExistingKeyboard) {
            keyboards.push({
                type: 'suggested',
                responses: responses
            });
        }

        this._state.keyboards = keyboards;

        return this;
    }

    /**
     *  @param {array} suggestions
     *  @param {boolean} [isHidden]
     *  @param {string} [user]
     *  @return {Message}
     */
    addResponseKeyboard(suggestions, isHidden, user) {
        let keyboards = this._state.keyboards || [];
        let responses = [];
        let updateExistingKeyboard = false;

        if (!util.isArray(suggestions)) {
            suggestions = [suggestions];
        }

        // add to an existing keyboard if all properties match
        keyboards.forEach((keyboard) => {
            if (keyboard.to === user
             && keyboard.hidden === isHidden) {
                responses = keyboard.responses;
                updateExistingKeyboard = true;
            }
        });

        suggestions.forEach((text) => {
            responses.push({ type: 'text', body: '' + text });
        });

        if (!updateExistingKeyboard) {
            let keyboard = {
                type: 'suggested',
                responses: responses
            };

            if (!util.isUndefined(isHidden)) {
                keyboard.hidden = !!isHidden;
            }

            if (!util.isUndefined(user)) {
                keyboard.to = '' + user;
            }

            keyboards.push(keyboard);
        }

        this._state.keyboards = keyboards;

        return this;
    }

    /**
     *  See https://bots.kik.com/docs/messages#from
     *  @return {string}
     */
    get from() {
        return this._state.from;
    }

    /**
     *  See https://bots.kik.com/docs/messages#id
     *  @return {string}
     */
    get id() {
        return this._state.id;
    }

    /**
     *  See https://bots.kik.com/docs/messages#chatId
     *  @return {string}
     */
    get chatId() {
        return this._state.chatId;
    }

    /**
     *  See https://bots.kik.com/docs/messages#messageIds
     *  @return {string}
     */
    get messageIds() {
        return this._state.messageIds;
    }

    /**
     *  See https://bots.kik.com/docs/messages#readReceiptRequested
     *  @return {string}
     */
    get readReceiptRequested() {
        return this._state.readReceiptRequested;
    }

    /**
     *  See https://bots.kik.com/docs/messages#stickerPackId
     *  @return {string}
     */
    get stickerPackId() {
        return this._state.stickerPackId;
    }

    /**
     *  See https://bots.kik.com/docs/messages#scan-data
     *  @return {string}
     */
    get scanData() {
        return this._state.data;
    }

    /**
     *  See https://bots.kik.com/docs/messages#stickerUrl
     *  @return {string}
     */
    get stickerUrl() {
        return this._state.stickerUrl;
    }

    /**
     *  See https://bots.kik.com/docs/messages#timestamp
     *  @return {string}
     */
    get timestamp() {
        return this._state.timestamp;
    }

    /**
     *  See https://bots.kik.com/docs/messages#type
     *  @return {string}
     */
    get type() {
        return this._state.type;
    }

    /**
     *  See https://bots.kik.com/docs/messages#kikJsData
     *  @return {string}
     */
    get kikJsData() {
        return this._state.kikJsData;
    }

    /**
     *  See https://bots.kik.com/docs/messages#picUrl
     *  @return {string}
     */
    get picUrl() {
        return this._state.picUrl;
    }

    /**
     *  See https://bots.kik.com/docs/messages#noForward
     *  @return {string}
     */
    get noForward() {
        return this._state.noForward;
    }

    /**
     *  See https://bots.kik.com/docs/messages#isTyping
     *  @return {string}
     */
    get isTyping() {
        return this._state.isTyping;
    }

    /**
     *  See https://bots.kik.com/docs/messages#body
     *  @return {string}
     */
    get body() {
        return this._state.body;
    }

    /**
     *  See https://bots.kik.com/docs/messages#text
     *  @return {string}
     */
    get text() {
        return this._state.text;
    }

    /**
     *  See https://bots.kik.com/docs/messages#title
     *  @return {string}
     */
    get title() {
        return this._state.title;
    }

    /**
     *  See https://bots.kik.com/docs/messages#url
     *  @return {string}
     */
    get url() {
        return this._state.url;
    }

    /**
     *  See https://bots.kik.com/docs/messages#videoUrl
     *  @return {string}
     */
    get videoUrl() {
        return this._state.videoUrl;
    }

    /**
     *  See https://bots.kik.com/docs/messages#delay
     *  @return {string}
     */
    get delay() {
        return this._state.delay;
    }

    /**
     *  See https://bots.kik.com/docs/messages#typeTime
     *  @return {string}
     */
    get typeTime() {
        return this._state.typeTime;
    }

    /**
     *  See https://bots.kik.com/docs/messages#attribution
     *  @return {string}
     */
    get attributionName() {
        return this._state.attribution ? this._state.attribution.name : undefined;
    }

    /**
     *  See https://bots.kik.com/docs/messages#attribution
     *  @return {string}
     */
    get attributionIcon() {
        return this._state.attribution ? this._state.attribution.iconUrl : undefined;
    }

    /**
     *  See https://bots.kik.com/docs/messages#loop
     *  @return {boolean}
     */
    get loop() {
        return this._state.loop;
    }

    /**
     *  See https://bots.kik.com/docs/messages#muted
     *  @return {boolean}
     */
    get muted() {
        return this._state.muted;
    }

    /**
     *  See https://bots.kik.com/docs/messages#autoplay
     *  @return {boolean}
     */
    get autoplay() {
        return this._state.autoplay;
    }

    /**
     *  See https://bots.kik.com/docs/messages#noSave
     *  @return {boolean}
     */
    get noSave() {
        return this._state.noSave;
    }

    /**
     *  See https://bots.kik.com/docs/messages#participants
     *  @return {array}
     */
    get participants() {
        return this._state.participants;
    }

    /**
     *  See https://bots.kik.com/docs/messages#mention
     *  @return {string}
     */
    get mention() {
        return this._state.mention;
    }

    /**
     *  @param {string} kikJsData Description-y bits
     *  @return {Message}
     */
    setKikJsData(kikJsData) {
        this._state.kikJsData = kikJsData;
        return this;
    }

    /**
     *  @param {string} picUrl Description-y bits
     *  @return {Message}
     */
    setPicUrl(picUrl) {
        this._state.picUrl = picUrl;
        return this;
    }

    /**
     *  @param {string} noForward Description-y bits
     *  @return {Message}
     */
    setNoForward(noForward) {
        this._state.noForward = noForward;
        return this;
    }

    /**
     *  @param {string} isTyping Description-y bits
     *  @return {Message}
     */
    setIsTyping(isTyping) {
        this._state.isTyping = isTyping;
        return this;
    }

    /**
     *  @param {array} messageIds Description-y bits
     *  @return {Message}
     */
    setMessageIds(messageIds) {
        this._state.messageIds = messageIds;
        return this;
    }

    /**
     *  @param {string} body Description-y bits
     *  @return {Message}
     */
    setBody(body) {
        this._state.body = body;
        return this;
    }

    /**
     *  @param {string} text Description-y bits
     *  @return {Message}
     */
    setText(text) {
        this._state.text = text;
        return this;
    }

    /**
     *  @param {string} title Description-y bits
     *  @return {Message}
     */
    setTitle(title) {
        this._state.title = title;
        return this;
    }

    /**
     *  @param {string} url Description-y bits
     *  @return {Message}
     */
    setUrl(url) {
        this._state.url = url;
        return this;
    }

    /**
     *  @param {string} videoUrl Description-y bits
     *  @return {Message}
     */
    setVideoUrl(videoUrl) {
        this._state.videoUrl = videoUrl;
        return this;
    }

    /**
     *  @param {string} delay Description-y bits
     *  @return {Message}
     */
    setDelay(delay) {
        this._state.delay = delay;
        return this;
    }

    /**
     *  @param {string} typeTime Description-y bits
     *  @return {Message}
     */
    setTypeTime(typeTime) {
        this._state.typeTime = typeTime;
        return this;
    }

    /**
     *  @param {string} attributionName Description-y bits
     *  @return {Message}
     */
    setAttributionName(attributionName) {
        this._state.attribution = this._state.attribution || {};
        this._state.attribution.name = attributionName;

        return this;
    }

    /**
     *  @param {string} attributionIcon Description-y bits
     *  @return {Message}
     */
    setAttributionIcon(attributionIcon) {
        this._state.attribution = this._state.attribution || {};
        this._state.attribution.iconUrl = attributionIcon;

        return this;
    }

    /**
     *  @param {boolean} loop Description
     *  @return {Message}
     */
    setLoop(loop) {
        this._state.loop = loop;
        return this;
    }

    /**
     *  @param {boolean} muted Description
     *  @return {Message}
     */
    setMuted(muted) {
        this._state.muted = muted;
        return this;
    }

    /**
     *  @param {boolean} autoplay Description
     *  @return {Message}
     */
    setAutoplay(autoplay) {
        this._state.autoplay = autoplay;
        return this;
    }

    /**
     *  @param {boolean} noSave Description
     *  @return {Message}
     */
    setNoSave(noSave) {
        this._state.noSave = noSave;
        return this;
    }
}

module.exports = Message;
