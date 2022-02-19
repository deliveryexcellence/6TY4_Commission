const { Schema, model } = require('mongoose');

const extraTicket =  Schema({
    userId: String,
    channelId: String,
    ticketCount: Number,
    modId: String,
});

module.exports = model('extraTicket', extraTicket);