'use strict';

class Response {

    static text(body) {
        return {
            type: 'text',
            body: '' + body
        };
    }

    static friendPicker(body, min, max, preselected) {
        const response = {
            type: 'friend-picker'
        };
        if (body) {
            response.body = '' + body;
        }

        if (!isNaN(min)) {
            response.min = min;
        }

        if (!isNaN(max)) {
            response.max = max;
        }

        if (preselected) {
            response.preselected = preselected;
        }

        return response;
    }

}

module.exports = Response;
