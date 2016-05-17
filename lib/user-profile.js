'use strict';

/**
 *  @class UserProfile
 *  See https://dev.kik.com/#/docs/messaging#user-profiles
 */
class UserProfile {

    constructor(username, data) {
        this._state = {
            username: username,
            data: data
        };
    }

    /**
     *  @return {string}
     */
    get displayName() {
        return `${this.firstName} ${this.lastName}`;
    }

    /**
     *  @return {string}
     */
    get username() {
        return this._state.username;
    }

    /**
     *  @return {string}
     */
    get firstName() {
        return this._state.data.firstName;
    }

    /**
     *  @return {string}
     */
    get lastName() {
        return this._state.data.lastName;
    }

    /**
     *  @return {string}
     */
    get profilePicUrl() {
        return this._state.data.profilePicUrl;
    }

    /**
     *  @return {number}
     */
    get profilePicLastModified() {
        return this._state.data.profilePicLastModified;
    }

    /**
     *  Constructs a JSON payload ready to be stringified.
     *  @return {object}
     */
    toJSON() {
        return this._state.data;
    }
}

module.exports = UserProfile;
