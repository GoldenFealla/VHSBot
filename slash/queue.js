const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the current song of queue')
        .addIntegerOption((option) => option.setName('page').setDescription('Page number of the queue'))
    ,
    run:
        async ({ client, interaction }) => {
            const queue = client.player.queues.get(interaction.guildId);

            if (!queue || !queue.isPlaying()) {
                return await interaction.editReply('There are no songs in queue');
            }

            const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
            const page = (interaction.options.getInteger('page') || 1) - 1;

            if (page > totalPages) {
                return await interaction.editReply(`Page number must be less than ${totalPages}`);
            }

            const queueString = queue.tracks.store.slice(page * 10, (page + 1) * 10).map((track, index) => {
                return `\n${index + 1}. \`[${track.duration}]\` **[${track.title}](${track.url})** -- from <@${track.requestedBy.id}>`;
            });

            const currentTrack = queue.currentTrack;

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**Current Song\n**` +
                            (currentTrack ? `\`[${currentTrack.duration}]\` ${currentTrack.title} -- from <@${currentTrack.requestedBy.id}>` : 'No song is currently playing') + `\n\n**Queue\n**${queueString}`
                        )
                        .setFooter({ text: `Page ${page + 1} of ${totalPages}` })
                        .setThumbnail(currentTrack.thumbnail)
                ]
            });
        }
}