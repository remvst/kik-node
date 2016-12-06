'use strict';

const Const = require('./const.js');

class Keyboard {

    constructor(type, hidden, to) {
        if (to && !to.match(Const.USERNAME_REGEX)) {
            throw new Error(`"${to}" is not a valid username`);
        }

        this.hidden = hidden;
        this.type = type;
        this.to = to;
    }

    toJSON() {
        const json = {
            'type': this.type,
            'hidden': Boolean(this.hidden)
        };
        if (this.to) {
            json.to = this.to;
        }

        return json;
    }

}

module.exports = Keyboard;
