'use strict';

let util = require('util');
let extend = util._extend;

class Message {

    constructor(type)
    {
        this.type = type;
        this.responses = [];
        this.tracking = {};
        this.typeTime = 0;
    }

    static text(text)
    {
        let msg = new Message('text');

        msg.body = text;

        return msg;
    }

    static link(link)
    {
        let msg = new Message('link');

        msg.url = link;

        return msg;
    }

    static picture(picUrl)
    {
        let msg = new Message('picture');

        msg.picUrl = picUrl;

        return msg;
    }

    static video(videoUrl)
    {
        let msg = new Message('video');

        msg.videoUrl = videoUrl;

        return msg;
    }

    delay(delay)
    {
        this.delay = delay;
        return this;
    }

    contentTitle(contentTitle)
    {
        this.contentTitle = contentTitle;
        return this;
    }

    contentText(contentText)
    {
        this.contentText = contentText;
        return this;
    }

    isBig(isBig)
    {
        this.isBig = isBig;
        return this;
    }

    loop(loop)
    {
        this.loop = loop;
        return this;
    }

    url(url)
    {
        this.url = url;
        return this;
    }

    picUrl(picUrl)
    {
        this.picUrl = picUrl;
        return this;
    }

    muted(muted)
    {
        this.muted = muted;
        return this;
    }

    autoPlay(autoPlay)
    {
        this.autoPlay = autoPlay;
        return this;
    }

    appName(appName)
    {
        this.appName = appName;
        return this;
    }

    appIconUrl(iconUrl)
    {
        this.iconUrl = iconUrl;
        return this;
    }

    addResponse(text)
    {
        for (let i = 0; i < arguments.length; ++i) {
            let text = arguments[i];

            if (util.isArray(text)) {
                this.responses = this.responses.concat(text);
            }
            else {
                this.responses.push(text);
            }
        }
        return this;
    }

    addTrackingInfo(key, value)
    {
        if (!key || !value) {
            return this;
        }

        this.tracking[key] = value;

        return this;
    }

    toJSON()
    {
        let json;

        if (this.type === 'text') {
            json = {
                type: 'text',
                body: this.body
            };
        }
        else {
            if (this.type === 'picture') {
                json = {
                    type: 'picture',
                    picUrl: this.picUrl,
                    attribution: {
                        name: this.appName,
                        iconUrl: this.iconUrl,
                    }
                };
            }
            if (this.type === 'link') {
                json = {
                    type: 'link',
                    attribution: {
                        name: this.appName,
                        iconUrl: this.iconUrl
                    },
                    url: this.url
                };
            }
            else if (this.type === 'video') {
                json = {
                    type: 'video',
                    videoUrl: this.videoUrl,
                    attribution: {
                        name: this.appName,
                        iconUrl: this.iconUrl,
                    }
                };

                if (!util.isUndefined(this.loop)) {
                    json.loop = this.loop;
                }

                if (!util.isUndefined(this.muted)) {
                    json.muted = this.muted;
                }

                if (!util.isUndefined(this.autoPlay)) {
                    json.autoplay = this.autoPlay;
                }
            }

            if (util.isString(this.picUrl)) {
                json.picUrl = this.picUrl;
            }

            if (util.isString(this.contentTitle)) {
                json.title = this.contentTitle;
            }

            if (util.isString(this.contentText)) {
                json.text = this.contentText;
            }
        }

        json.typeTime = 0;
        json.delay = 0;

        if (this.responses.length !== 0) {
            json.suggestedResponses = this.responses;
        }

        return json;
    }

    static fromJSON(json)
    {
    	let msg = new Message(json.type);

        Object.keys(json).forEach((key) => {
            msg[key] = json[key];
        });

        return msg;
    }
}

module.exports = Message;
