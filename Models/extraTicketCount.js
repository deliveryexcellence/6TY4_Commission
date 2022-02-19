const { Schema, model } = require('mongoose');

const extraTicketCount =  Schema({
    key: String,
    currentTicketCount: Number,
});

module.exports = model('extraTicketCount', extraTicketCount);