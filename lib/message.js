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
     *  See https://dev.kik.com/#/docs/messaging#text
     *  @return {Message}
     */
    static text(text) {
        return new Message('text').setBody(text);
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#link
     *  @return {Message}
     */
    static link(link) {
        return new Message('link').setUrl(link);
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#picture
     *  @return {Message}
     */
    static picture(picUrl) {
        return new Message('picture').setPicUrl(picUrl);
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#video
     *  @return {Message}
     */
    static video(videoUrl) {
        return new Message('video').setVideoUrl(videoUrl);
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#is-typing
     *  @return {Message}
     */
    static isTyping(typing) {
        return new Message('is-typing').setIsTyping(typing);
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#receipts
     *  @return {Message}
     */
    static readReceipt(messageIds) {
        return new Message('read-receipt').setMessageIds(messageIds);
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#text
     *  @return {boolean}
     */
    isTextMessage() {
        return this.type === 'text';
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#link
     *  @return {boolean}
     */
    isLinkMessage() {
        return this.type === 'link';
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#picture
     *  @return {boolean}
     */
    isPictureMessage() {
        return this.type === 'picture';
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#video
     *  @return {boolean}
     */
    isVideoMessage() {
        return this.type === 'video';
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#start-chatting
     *  @return {boolean}
     */
    isStartChattingMessage() {
        return this.type === 'start-chatting';
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#scan-data
     *  @return {boolean}
     */
    isScanDataMessage() {
        return this.type === 'scan-data';
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#sticker
     *  @return {boolean}
     */
    isStickerMessage() {
        return this.type === 'sticker';
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#is-typing
     *  @return {boolean}
     */
    isIsTypingMessage() {
        return this.type === 'is-typing';
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#receipts
     *  @return {boolean}
     */
    isDeliveryReceiptMessage() {
        return this.type === 'delivery-receipt';
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#receipts
     *  @return {boolean}
     */
    isReadReceiptMessage() {
        return this.type === 'read-receipt';
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#mentions
     *  @return {boolean}
     */
    isMention() {
        return !!this.mention;
    }

    /**
     *  Constructs a JSON payload ready to be sent to the
     *  bot messaging API
     *  @return {object}
     */
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

    /**
     *  Constructs a new {Message} object from a JSON-encoded payload
     *  See https://dev.kik.com/#/docs
     *  @param {object} json
     *  @return {Message}
     */
    static fromJSON(json) {
        let msg = new Message(json.type);

        return msg.parse(json);
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#keyboards
     *  @param {string} text
     *  @return {Message}
     */
    addTextResponse(text) {
        if (util.isArray(text)) {
            text.forEach((response) => {
                this.addTextResponse(response);
            });

            return this;
        }

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

        for (let i = 0, l = arguments.length; i < l; ++i) {
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
     *  See https://dev.kik.com/#/docs/messaging#keyboards
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
     *  See https://dev.kik.com/#/docs/messaging#receiving-messages
     *  @return {string}
     */
    get from() {
        return this._state.from;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#receiving-messages
     *  @return {string}
     */
    get id() {
        return this._state.id;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#receiving-messages
     *  @return {string}
     */
    get chatId() {
        return this._state.chatId;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#receipts
     *  @return {array}
     */
    get messageIds() {
        return this._state.messageIds;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#receipts
     *  @return {boolean}
     */
    get readReceiptRequested() {
        return this._state.readReceiptRequested;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#sticker
     *  @return {string}
     */
    get stickerPackId() {
        return this._state.stickerPackId;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#kik-codes-api
     *  @return {string}
     */
    get scanData() {
        return this._state.data;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#sticker
     *  @return {string}
     */
    get stickerUrl() {
        return this._state.stickerUrl;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#common-fields
     *  @return {number}
     */
    get timestamp() {
        return this._state.timestamp;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#message-formats
     *  @return {string}
     */
    get type() {
        return this._state.type;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#link
     *  @return {object}
     */
    get kikJsData() {
        return this._state.kikJsData;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#link
     *  @return {string}
     */
    get picUrl() {
        return this._state.picUrl;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#link
     *  @return {boolean}
     */
    get noForward() {
        return this._state.noForward;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#is-typing
     *  @return {boolean}
     */
    get isTyping() {
        return this._state.isTyping;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#text
     *  @return {string}
     */
    get body() {
        return this._state.body;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#link
     *  @return {string}
     */
    get text() {
        return this._state.text;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#link
     *  @return {string}
     */
    get title() {
        return this._state.title;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#link
     *  @return {string}
     */
    get url() {
        return this._state.url;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#video
     *  @return {string}
     */
    get videoUrl() {
        return this._state.videoUrl;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#common-fields
     *  @return {number}
     */
    get delay() {
        return this._state.delay;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#text
     *  @return {number}
     */
    get typeTime() {
        return this._state.typeTime;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#attribution
     *  @return {string}
     */
    get attributionName() {
        return this._state.attribution ? this._state.attribution.name : undefined;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#attribution
     *  @return {string}
     */
    get attributionIcon() {
        return this._state.attribution ? this._state.attribution.iconUrl : undefined;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#video
     *  @return {boolean}
     */
    get loop() {
        return this._state.loop;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#video
     *  @return {boolean}
     */
    get muted() {
        return this._state.muted;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#video
     *  @return {boolean}
     */
    get autoplay() {
        return this._state.autoplay;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#video
     *  @return {boolean}
     */
    get noSave() {
        return this._state.noSave;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#participants
     *  @return {array}
     */
    get participants() {
        return this._state.participants;
    }

    /**
     *  See https://dev.kik.com/#/docs/messaging#mention
     *  @return {string}
     */
    get mention() {
        return this._state.mention;
    }

    /**
     *  @param {object} kikJsData
     *  @return {Message}
     */
    setKikJsData(kikJsData) {
        this._state.kikJsData = kikJsData;
        return this;
    }

    /**
     *  @param {string} picUrl
     *  @return {Message}
     */
    setPicUrl(picUrl) {
        this._state.picUrl = picUrl;
        return this;
    }

    /**
     *  @param {boolean} noForward
     *  @return {Message}
     */
    setNoForward(noForward) {
        this._state.noForward = noForward;
        return this;
    }

    /**
     *  @param {boolean} isTyping
     *  @return {Message}
     */
    setIsTyping(isTyping) {
        this._state.isTyping = isTyping;
        return this;
    }

    /**
     *  @param {array} messageIds
     *  @return {Message}
     */
    setMessageIds(messageIds) {
        this._state.messageIds = messageIds;
        return this;
    }

    /**
     *  @param {string} body
     *  @return {Message}
     */
    setBody(body) {
        this._state.body = body;
        return this;
    }

    /**
     *  @param {string} text
     *  @return {Message}
     */
    setText(text) {
        this._state.text = text;
        return this;
    }

    /**
     *  @param {string} title
     *  @return {Message}
     */
    setTitle(title) {
        this._state.title = title;
        return this;
    }

    /**
     *  @param {string} url
     *  @return {Message}
     */
    setUrl(url) {
        this._state.url = url;
        return this;
    }

    /**
     *  @param {string} videoUrl
     *  @return {Message}
     */
    setVideoUrl(videoUrl) {
        this._state.videoUrl = videoUrl;
        return this;
    }

    /**
     *  @param {number} delay
     *  @return {Message}
     */
    setDelay(delay) {
        this._state.delay = delay;
        return this;
    }

    /**
     *  @param {number} typeTime
     *  @return {Message}
     */
    setTypeTime(typeTime) {
        this._state.typeTime = typeTime;
        return this;
    }

    /**
     *  @param {string} attributionName
     *  @return {Message}
     */
    setAttributionName(attributionName) {
        this._state.attribution = this._state.attribution || {};
        this._state.attribution.name = attributionName;

        return this;
    }

    /**
     *  @param {string} attributionIcon
     *  @return {Message}
     */
    setAttributionIcon(attributionIcon) {
        this._state.attribution = this._state.attribution || {};
        this._state.attribution.iconUrl = attributionIcon;

        return this;
    }

    /**
     *  @param {boolean} loop
     *  @return {Message}
     */
    setLoop(loop) {
        this._state.loop = loop;
        return this;
    }

    /**
     *  @param {boolean} muted
     *  @return {Message}
     */
    setMuted(muted) {
        this._state.muted = muted;
        return this;
    }

    /**
     *  @param {boolean} autoplay
     *  @return {Message}
     */
    setAutoplay(autoplay) {
        this._state.autoplay = autoplay;
        return this;
    }

    /**
     *  @param {boolean} noSave
     *  @return {Message}
     */
    setNoSave(noSave) {
        this._state.noSave = noSave;
        return this;
    }
}

module.exports = Message;
