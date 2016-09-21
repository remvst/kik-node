'use strict';

class Keyboard {

    constructor(type, hidden, to){
        this.hidden = hidden;
        this.type = type;
        this.to = to;
    }

    toJSON(){
        const json = {
            'type': this.type
        };
        if (this.to){
            json.to = this.to;
        }
        if (this.hidden !== undefined){
            json.hidden = Boolean(this.hidden);
        }
        return json;
    }

}

module.exports = Keyboard;
