'use strict';

class UserProfile {

    constructor(username, data)
    {
        this.username = username;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.profilePicUrl = data.profilePicUrl;
        this.profilePicLastModified = data.profilePicLastModified;
    }

    get displayName()
    {
        return `${this.firstName} ${this.lastName}`;
    }
}

module.exports = UserProfile;
