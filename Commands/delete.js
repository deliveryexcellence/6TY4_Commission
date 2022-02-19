const { SlashCommandBuilder } = require('@discordjs/builders');
const extraTicketSchema = require('../Models/extraTicketSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete a ticket!'),
    async execute(interaction) {

        const sleep = delay => new Promise(res => setTimeout(res, delay));

        if (interaction.channel.parentId !== "944610245773246515") return interaction.reply({ ephemeral: true, content: "You can't use this command here." });

        await extraTicketSchema.findOneAndDelete({ channelId: interaction.channel.id });

        await interaction.reply("This ticket will be deleted in 5 seconds.");

        await sleep(5000);

        return interaction.channel.delete();

    },
};