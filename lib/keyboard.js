'use strict';

class Keyboard {

    constructor(type, hidden, to) {
        this.hidden = hidden;
        this.type = type;
        this.to = to;
    }

    toJSON() {
        const json = {
            'type': this.type,
            'hidden': Boolean(this.hidden)
        };
        if (this.to){
            json.to = this.to;
        }
        return json;
    }

}

module.exports = Keyboard;
