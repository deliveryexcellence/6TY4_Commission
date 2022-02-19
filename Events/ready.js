const mongoose = require('mongoose');
const { Database } = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {

        console.log(`Ready! Logged in as ${client.user.tag}`);

		if (!Database) return;
        mongoose.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Client successfully connected to Database!")
        }).catch((err) => {
            console.log(err);
        });
	},
};