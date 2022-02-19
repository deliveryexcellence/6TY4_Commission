const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const extraTicketSchema = require('../Models/extraTicketSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDescription('Claim a ticket!'),
    async execute(interaction) {


        if (interaction.channel.parentId !== "944610245773246515") return interaction.reply({ ephemeral: true, content: "You can't use this command here." });

        
        const fetchTicketFromDatabase = await extraTicketSchema.findOne({ channelId: interaction.channel.id });

        await extraTicketSchema.findOneAndUpdate({ channelId: interaction.channel.id }, { modId: interaction.user.id });

        await interaction.channel.setName(`claimed-${fetchTicketFromDatabase.ticketCount}`);

        const claimedEmbed = new MessageEmbed()
            .setTitle("Ticket Claimed!")
            .setDescription(`This ticket has been claimed by: ${interaction.user}`)
            .setColor("GREEN")

        await interaction.reply({ ephemeral: true, content: "Successfully claimed ticket!"})

        return interaction.channel.send({ embeds: [claimedEmbed] });
    },
};