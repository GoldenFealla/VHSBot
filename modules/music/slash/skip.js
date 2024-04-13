import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';

import config from '#root/config.json' assert { type: "json" };

const data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song');

/**
 * 
 * @param {object} obj
 * @param {import('../../../core/client').Server} obj.server
 * @param {import('discord.js').CommandInteraction} obj.interaction
 * @returns 
 */
const run = async ({ server, interaction }) => {
    const queue = server.player.queues.get(interaction.guildId);

    if (!queue) return await interaction.editReply('There are no songs in queue');

    const currentTrack = queue.currentTrack;
    queue.node.skip();

    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle('🌸🌸🌸 Skipped 🌸🌸🌸')
        .setDescription(`Skipped [${currentTrack.title}](${currentTrack.url})`)
        .setThumbnail(currentTrack.thumbnail);

    await interaction.editReply({ embeds: [embed] });
}

export default {
    data,
    run
}