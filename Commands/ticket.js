const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const extraTicketSchema = require('../Models/extraTicketSchema');
const extraTicketCountSchema = require('../Models/extraTicketCount');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Open a ticket!')
        .addSubcommand(subcommand => subcommand.setName("user_report").setDescription("Open this ticket to report a user."))
        .addSubcommand(subcommand => subcommand.setName("bug_report").setDescription("Open this ticket to report a bug."))
        .addSubcommand(subcommand => subcommand.setName("exploit_report").setDescription("Open this ticket to report an exploit."))
        .addSubcommand(subcommand => subcommand.setName("support").setDescription("Open this ticket to get support from staff.")),
    async execute(interaction) {

        const subcommand = interaction.options.getSubcommand(true);

        let ticketType = '';
        let channelName = '';
        let proofOrScreenshot = '';
        let proofOrScreenshotOffical = '';

        if (subcommand === "user_report") {
            ticketType = 'User Report';
            channelName = 'user-report';
            proofOrScreenshot = 'proof';
            proofOrScreenshotOffical = 'Proof';

        }

        if (subcommand === "bug_report") {
            ticketType = 'Bug Report';
            channelName = 'bug-report';
            proofOrScreenshot = 'screenshots';
            proofOrScreenshotOffical = 'Screenshots';
        }

        if (subcommand === "exploit_report") {
            ticketType = 'Exploit Report';
            channelName = 'exploit-report';
            proofOrScreenshot = 'proof';
            proofOrScreenshotOffical = 'Proof';
        }

        if (subcommand === "support") {
            ticketType = 'Support';
            channelName = 'support';
            proofOrScreenshot = 'screenshots';
            proofOrScreenshotOffical = 'Screenshots';
        }

        const embed1 = new MessageEmbed()
            .setTitle(`Create a ticket - ${ticketType} [1/2]`)
            .setDescription(`Chosen Ticket Type: **${ticketType}**\n\n> *Please explain your issue in as much detail as possible.*`)
            .setColor("GREEN")
            .setFooter({ text: "This prompt will end in 3 minutes. Type 'cancel' to cancel at any time." })

        const embed2 = new MessageEmbed()
            .setTitle(`Create a ticket - ${ticketType} [2/2]`)
            .setDescription(`\n\n> *If you have any ${proofOrScreenshot} (Max. 1 File), attach it now.*\n\nIf you have no proof, type \`none\``)
            .setColor("GREEN")
            .setFooter({ text: "This prompt will end in 3 minutes. Type 'cancel' to cancel at any time." })



        // main code

        //fetch current ticket number //

        const fetchCurrentCountFromDatabase = await extraTicketCountSchema.findOne({ key: "extra" });
        const currentTicketCount = fetchCurrentCountFromDatabase.currentTicketCount;

        const newTicketCount = currentTicketCount + 1;
        await extraTicketCountSchema.findOneAndUpdate({ key: "extra" }, { currentTicketCount: newTicketCount });

        await interaction.reply({ ephemeral: true, content: "This will continue in your DMs." });
        const dm = await interaction.user.send({ embeds: [embed1] });

        const filter = m => m.author.id !== "944276695249215561";

        dm.channel.awaitMessages({ filter, time: 3 * 60000, errors: ['time'], max: 1 })
            .then(async (collected1) => {

                if (collected1.first().attachments.size > 0) {
                    return dm.channel.send("Files are not permitted in this section. Cancelled prompt.");
                }

                if (collected1.first().content.toLowerCase() === "cancel") {
                    return dm.channel.send(`Cancelled prompt.`);
                }

                await dm.channel.send({ embeds: [embed2] });
                dm.channel.awaitMessages({ filter, time: 3 * 60000, errors: ['time'], max: 1 })
                    .then(async (collected2) => {

                        if (collected2.first().content.toLowerCase() === "cancel") {
                            return dm.channel.send(`Cancelled prompt.`);
                        }

                        if (collected2.first().content.toLowerCase() === "none") {

                            const ticketEmbed = new MessageEmbed()
                                .setTitle(`Ticket - ${interaction.user.tag}`)
                                .addFields(
                                    { name: "Type", value: `${ticketType}`, inline: false },
                                    { name: "Issue", value: `${collected1.first().content}`, inline: false },
                                    { name: `${proofOrScreenshotOffical}`, value: `None`, inline: false }
                                )
                                .setColor("GREEN")

                            const ticketChannel = await interaction.guild.channels.cache.get("944610245773246515").createChannel(`${channelName}-${currentTicketCount}`, {
                                type: "GUILD_TEXT",
                                permissionOverwrites: [
                                    {
                                        id: interaction.user.id,
                                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "EMBED_LINKS", "USE_APPLICATION_COMMANDS"],
                                        deny: ["CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS"]
                                    },
                                    {
                                        id: "944646449260548196",
                                        allow: [["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "EMBED_LINKS", "USE_APPLICATION_COMMANDS", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS"]]
                                    },
                                    {
                                        id: interaction.guild.id,
                                        deny: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                                    },
                                ],
                            });
                            const extraTicketSchemaDoc = await new extraTicketSchema({ userId: interaction.user.id, channelId: ticketChannel.id, ticketCount: currentTicketCount, modId: "Not Claimed" });
                            await extraTicketSchemaDoc.save();
                            await dm.channel.send(`Created ticket -> ${ticketChannel}`);
                            return ticketChannel.send({ embeds: [ticketEmbed] });

                        }

                        if (collected2.first().attachments.size > 0) {

                            collected2.first().attachments.forEach(async (attachment) => {
                                attachment = `${attachment.url}`;

                                const ticketEmbed = new MessageEmbed()
                                    .setTitle(`Ticket - ${interaction.user.tag}`)
                                    .addFields(
                                        { name: "Type", value: `${ticketType}`, inline: false },
                                        { name: "Issue", value: `${collected1.first().content}`, inline: false },
                                        { name: `${proofOrScreenshotOffical}`, value: `**[Link](${attachment})**`, inline: false }
                                    )
                                    .setColor("GREEN")

                                const ticketChannel = await interaction.guild.channels.cache.get("944610245773246515").createChannel(`open-${currentTicketCount}`, {
                                    type: "GUILD_TEXT",
                                    permissionOverwrites: [
                                        {
                                            id: interaction.user.id,
                                            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "EMBED_LINKS", "USE_APPLICATION_COMMANDS"],
                                            deny: ["CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS"]
                                        },
                                        {
                                            id: "944646449260548196",
                                            allow: [["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ATTACH_FILES", "EMBED_LINKS", "USE_APPLICATION_COMMANDS", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS"]]
                                        },
                                        {
                                            id: interaction.guild.id,
                                            deny: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                                        },
                                    ],
                                });
                                const extraTicketSchemaDoc = await new extraTicketSchema({ userId: interaction.user.id, channelId: ticketChannel.id, ticketCount: currentTicketCount, modId: "Not Claimed" });
                                await extraTicketSchemaDoc.save();
                                await dm.channel.send(`Created ticket -> ${ticketChannel}`);
                                return ticketChannel.send({ embeds: [ticketEmbed] });
                            })
                            return;

                        }

                        if (!collected2.first().attachments.size > 0 && collected2.first().content.toLowerCase() !== "cancel" && collected2.first().content.toLowerCase() !== "none") {

                            return dm.channel.send("Message was not a file nor `none`. Cancelled prompt.");

                        }

                    }).catch(console.error);
                /*.catch(() => {

                    return dm.channel.send("Cancelled prompt due to no reponse in 3 minutes.");

                })*/

            }).catch(() => {

                return dm.channel.send("Cancelled prompt due to no reponse in 3 minutes.");

            })




    },
};