const moment = require('moment');

function formatMessage(username, text) {
    let isAdmin = username == null;
    return {
        username,
        isAdmin,
        text,
        time: moment().format('HH:mm')
    };
}

module.exports = formatMessage;