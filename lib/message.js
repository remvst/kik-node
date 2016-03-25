'use strict';

const util = require('util');

class Message {
    constructor(type) {
        this._state = {
            type: type
        };
    }

    static text(text) {
        return new Message('text').setBody(text);
    }

    static link(link) {
        return new Message('link').setUrl(link);
    }

    static picture(picUrl) {
        return new Message('picture').setPicUrl(picUrl);
    }

    static video(videoUrl) {
        return new Message('video').setVideoUrl(videoUrl);
    }

    static isTyping(typing) {
        return new Message('is-typing').setIsTyping(typing);
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
        } else {
            if (state.type === 'picture') {
                json = {
                    type: 'picture',
                    picUrl: '' + state.picUrl,
                    attribution: {
                        name: '' + state.appName,
                        iconUrl: '' + state.iconUrl,
                    }
                };
            } else if (state.type === 'link') {
                json = {
                    type: 'link',
                    attribution: {
                        name: '' + state.appName,
                        iconUrl: '' + state.iconUrl
                    },
                    url: '' + state.url
                };
            } else if (state.type === 'video') {
                json = {
                    type: 'video',
                    videoUrl: '' + state.videoUrl,
                    attribution: {
                        name: '' + state.appName,
                        iconUrl: '' + state.iconUrl,
                    },
                };

                if (!util.isUndefined(state.loop)) {
                    json.loop = !!state.loop;
                }

                if (!util.isUndefined(state.muted)) {
                    json.muted = !!state.muted;
                }

                if (!util.isUndefined(state.autoPlay)) {
                    json.autoplay = !!state.autoPlay;
                }
            }

            if (util.isString(state.picUrl)) {
                json.picUrl = '' + state.picUrl;
            }

            if (util.isString(state.contentTitle)) {
                json.title = '' + state.contentTitle;
            }

            if (util.isString(state.contentText)) {
                json.text = '' + state.contentText;
            }
        }

        if (!util.isUndefined(state.typeTime)) {
            json.typeTime = +state.typeTime;
        }

        if (!util.isUndefined(state.delay)) {
            json.delay = +state.delay;
        }

        if (state.responses.length !== 0) {
            json.suggestedResponses = state.responses;
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

    addResponse(text) {
        this.responses = this.responses || [];
        
        for (let i = 0; i < arguments.length; ++i) {
            let text = arguments[i];

            if (util.isArray(text)) {
                this.responses = this.responses.concat(text);
            } else {
                this.responses.push(text);
            }
        }

        return this;
    }

    /**
     *  @method from
     */
    get from() {
        return this._state.from;
    }

    /**
     *  @method id
     */
    get id() {
        return this._state.id;
    }

    /**
     *  @method chatId
     */
    get chatId() {
        return this._state.chatId;
    }

    /**
     *  @method messageIds
     */
    get messageIds() {
        return this._state.messageIds;
    }

    /**
     *  @method readReceiptRequested
     */
    get readReceiptRequested() {
        return this._state.readReceiptRequested;
    }

    /**
     *  @method stickerPackId
     */
    get stickerPackId() {
        return this._state.stickerPackId;
    }

    /**
     *  @method stickerUrl
     */
    get stickerUrl() {
        return this._state.stickerUrl;
    }

    /**
     *  @method timestamp
     */
    get timestamp() {
        return this._state.timestamp;
    }

    /**
     *  @method to
     */
    get to() {
        return this._state.to;
    }

    /**
     *  @method type
     */
    get type() {
        return this._state.type;
    }

    /**
     *  @method kikJsData
     */
    get kikJsData() {
        return this._state.kikJsData;
    }

    /**
     *  @method picUrl
     */
    get picUrl() {
        return this._state.picUrl;
    }

    /**
     *  @method noForward
     */
    get noForward() {
        return this._state.noForward;
    }

    /**
     *  @method isTyping
     */
    get isTyping() {
        return this._state.isTyping;
    }

    /**
     *  @method body
     */
    get body() {
        return this._state.body;
    }

    /**
     *  @method text
     */
    get text() {
        return this._state.text;
    }

    /**
     *  @method title
     */
    get title() {
        return this._state.title;
    }

    /**
     *  @method url
     */
    get url() {
        return this._state.url;
    }

    /**
     *  @method videoUrl
     */
    get videoUrl() {
        return this._state.videoUrl;
    }

    /**
     *  @method delay
     */
    get delay() {
        return this._state.delay;
    }

    /**
     *  @method typeTime
     */
    get typeTime() {
        return this._state.typeTime;
    }

    /**
     *  @method setKikJsData
     */
    setKikJsData(kikJsData) {
        this._state.kikJsData = kikJsData;
        return this;
    }

    /**
     *  @method setPicUrl
     */
    setPicUrl(picUrl) {
        this._state.picUrl = picUrl;
        return this;
    }

    /**
     *  @method setNoForward
     */
    setNoForward(noForward) {
        this._state.noForward = noForward;
        return this;
    }

    /**
     *  @method setIsTyping
     */
    setIsTyping(isTyping) {
        this._state.isTyping = isTyping;
        return this;
    }

    /**
     *  @method setBody
     */
    setBody(body) {
        this._state.body = body;
        return this;
    }

    /**
     *  @method setText
     */
    setText(text) {
        this._state.text = text;
        return this;
    }

    /**
     *  @method setTitle
     */
    setTitle(title) {
        this._state.title = title;
        return this;
    }

    /**
     *  @method setUrl
     */
    setUrl(url) {
        this._state.url = url;
        return this;
    }

    /**
     *  @method setVideoUrl
     */
    setVideoUrl(videoUrl) {
        this._state.videoUrl = videoUrl;
        return this;
    }

    /**
     *  @method setDelay
     */
    setDelay(delay) {
        this._state.delay = delay;
        return this;
    }

    /**
     *  @method setTypeTime
     */
    setTypeTime(typeTime) {
        this._state.typeTime = typeTime;
        return this;
    }
}

module.exports = Message;
