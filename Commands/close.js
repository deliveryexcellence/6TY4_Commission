const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const extraTicketSchema = require('../Models/extraTicketSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Remove a user from the ticket!'),
    async execute(interaction) {

        if (interaction.channel.parentId !== "944610245773246515") return interaction.reply({ ephemeral: true, content: "You can't use this command here." });

        const fetchTicketFromDatabase = await  extraTicketSchema.findOne({ channelId: interaction.channel.id });
        const ticketCreatorId = fetchTicketFromDatabase.userId;

        const modId = fetchTicketFromDatabase.modId;
        console.log(modId);
        const staffRole = interaction.guild.roles.cache.find(r => r.id === "944646449260548196");

        await interaction.channel.edit({
            lockPermissions: false,
            permissionOverwrites: [
                {
                    id: ticketCreatorId,
                    allow: ["VIEW_CHANNEL"],
                    deny: ["SEND_MESSAGES", "USE_APPLICATION_COMMANDS", "CREATE_PUBLIC_THREADS"]
                },
                {
                    id: staffRole,
                    allow: ["VIEW_CHANNEL"],
                    deny: ["SEND_MESSAGES", "USE_APPLICATION_COMMANDS", "CREATE_PUBLIC_THREADS"]
                },
                {
                    id: modId,
                    allow: ["SEND_MESSAGES", "USE_APPLICATION_COMMANDS", "CREATE_PUBLIC_THREADS"]
                },
            ],
        });

        await interaction.channel.setName(`closed-${fetchTicketFromDatabase.ticketCount}`);

        const removedEmbed = new MessageEmbed()
            .setDescription(`Successfully closed the ticket.`)
            .setColor("GREEN")

        
        return interaction.reply({ embeds: [removedEmbed] });

    },
};