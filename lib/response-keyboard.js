'use strict';

const util = require('util');

const Keyboard = require('./keyboard');
const Response = require('./response');

class ResponseKeyboard extends Keyboard {

    constructor(responses, hidden, to) {
        super('suggested', hidden, to);
        this.responses = [];

        if (responses) {
            responses.forEach(response => {
                this.addResponse(response);
            });
        }
    }

    addResponse(response) {
        if (util.isString(response)) {
            response = Response.text(response);
        }

        this.responses.push(response);

        return this;
    }

    toJSON() {
        const json = super.toJSON();
        json.responses = this.responses.slice(0); // make a copy for safety
        return json;
    }

}

module.exports = ResponseKeyboard;
