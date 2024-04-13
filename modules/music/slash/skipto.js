import { SlashCommandBuilder } from '@discordjs/builders';

import config from '#root/config.json' assert { type: "json" };

const data = new SlashCommandBuilder()
    .setName('skipto')
    .setDescription('Skip to certain song in the queue')
    .addNumberOption(option => option.setName('number').setDescription('The track to skip to').setMinValue(1).setRequired(true));

/**
 * 
 * @param {object} obj
 * @param {import('../../../core/client').Server} obj.server
 * @param {import('discord.js').CommandInteraction} obj.interaction
 * @returns 
 */
const run = async ({ server, interaction }) => {
    const queue = server.player.queues.get(interaction.guildId);

    if (!queue) return await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setColor(config.color)
                .setDescription('There are no songs in queue')
        ]
    });

    const trackNumber = interaction.options.getNumber('number');

    if (trackNumber > queue.tracks.length)
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.color)
                    .setDescription(`There are only ${queue.tracks.length} songs in queue`)
            ]
        });

    queue.node.skipTo(trackNumber - 1);

    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setColor(config.color)
                .setTitle('🌸🌸🌸 Skipped 🌸🌸🌸')
                .setDescription(`Skipped to track number ${trackNumber}`)
        ]
    });
}

export default {
    data,
    run
}