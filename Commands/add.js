const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add a user to the ticket!')
        .addUserOption(option => option.setRequired(true).setName("user").setDescription("User to add.")),
    async execute(interaction) {

        if (interaction.channel.parentId !== "944610245773246515") return interaction.reply({ ephemeral: true, content: "You can't use this command here." });

        const userToAdd = interaction.options.getUser("user");

        await interaction.channel.edit({
            permissionOverwrites: [
                {
                    id: userToAdd.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "EMBED_LINKS"],
                    deny: ["USE_APPLICATION_COMMANDS", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS"]
                },
            ],
        });

        const addedEmbed = new MessageEmbed()
            .setDescription(`Successfully added ${userToAdd} to this ticket.`)
            .setColor("GREEN")

        
        return interaction.reply({ content: `${userToAdd}`, embeds: [addedEmbed] });

    },
};