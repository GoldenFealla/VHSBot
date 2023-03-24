const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('current')
        .setDescription('Display the info of current song'),
    run: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guildId);

        if (!queue) return await interaction.editReply('There are no songs in queue');

        let bar = queue.node.createProgressBar({
            queue: false,
            length: 20,
        });

        const currentTrack = queue.currentTrack;

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Current Playing [${currentTrack.title}](${currentTrack.url})\n\n` + bar)
            ]
        });
    }
}