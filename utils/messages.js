const moment = require('moment');

function formatMessage(username, text, date) {
    return {
        username,
        text,
        time: moment().format(date)
    }
}

module.exports = formatMessage;