const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a user from the ticket!')
        .addUserOption(option => option.setRequired(true).setName("user").setDescription("User to add.")),
    async execute(interaction) {

        if (interaction.channel.parentId !== "944610245773246515") return interaction.reply({ ephemeral: true, content: "You can't use this command here." });

        const userToRemove = interaction.options.getUser("user");

        await interaction.channel.edit({
            permissionOverwrites: [
                {
                    id: userToRemove.id,
                    deny: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                },
            ],
        });

        const removedEmbed = new MessageEmbed()
            .setDescription(`Successfully removed ${userToRemove} from this ticket.`)
            .setColor("RED")

        
        return interaction.reply({ embeds: [removedEmbed] });

    },
};