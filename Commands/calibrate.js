const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const currentTicketCountSchema = require('../Models/extraTicketCount');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calibrate')
        .setDescription("calibrate numbers"),
    async execute(interaction) {

        const currentTicketCountSchemaDoc = await new currentTicketCountSchema({ key: "extra", currentTicketCount: 0 });
        await currentTicketCountSchemaDoc.save();

        return interaction.reply({ ephemeral: true, content: "✅" });
        

    },
};