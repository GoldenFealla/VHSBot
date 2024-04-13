import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';

import config from '#root/config.json' assert { type: "json" };

const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Display the current song of queue')
    .addIntegerOption((option) => option.setName('page').setDescription('Page number of the queue'))

/**
 * 
 * @param {object} obj
 * @param {import('../../../core/client').Server} obj.server
 * @param {import('discord.js').CommandInteraction} obj.interaction
 * @returns 
 */
const run = async ({ server, interaction }) => {
    const queue = server.player.queues.get(interaction.guildId);

    if (!queue || !queue.isPlaying()) {
        return await interaction.editReply('There are no songs in queue');
    }

    const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
    const page = (interaction.options.getInteger('page') || 1) - 1;

    if (page > totalPages) {
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`Invalid page number. There are only ${totalPages} pages`)
            ]
        });
    }

    const embed = new EmbedBuilder()
        .setColor(config.color)

    const currentTrack = queue.currentTrack;

    embed.setTitle(`🌸🌸🌸 Queue 🌸🌸🌸`)
    embed.addFields(
        {
            name: `Current Song`,
            value: `${currentTrack.title} -- from <@${currentTrack.requestedBy.id}>`,
            inline: false
        }
    )

    queue.tracks.store.slice(page * 10, (page + 1) * 10).forEach((track, index) => {
        embed.addFields(
            {
                name: `${index + 1}. ${track.title}`,
                value: `Requested by <@${track.requestedBy.id}>`,
                inline: false
            }
        )
    })

    embed.setFooter({ text: `Page ${page + 1} of ${totalPages}` })
    embed.setThumbnail(currentTrack.thumbnail)


    await interaction.editReply({ embeds: [embed] });
}

export default {
    data,
    run
}
