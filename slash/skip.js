const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    run: async ({ client, interaction }) => {
        const queue = client.Player.getQueue(interaction.guildId);

        if(!queue) return await interaction.editReply('There are no songs in queue');

        const currentTrack = queue.current;

        queue.skip();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`Skipped [${currentTrack.title}](${currentTrack.url})`)
                .setThumbnail(currentTrack.thumbnail)
            ]
        });
    }
}