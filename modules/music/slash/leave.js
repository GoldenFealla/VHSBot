import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js'

import config from '#root/config.json' assert { type: "json" };

const data = new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Stop the music and leave the voice channel');

/**
 * 
 * @param {object} obj
 * @param {import('../../../core/client').Server} obj.server
 * @param {import('discord.js').CommandInteraction} obj.interaction
 * @returns 
 */
const run = async ({ server, interaction }) => {
    const queue = server.player.queues.get(interaction.guildId);

    if (!queue.tracks) return await interaction.editReply('There are no songs in queue');

    queue.node.stop();

    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle('🌸🌸🌸 Stopped 🌸🌸🌸')
        .setDescription('Stopped the music and left the voice channel!');

    await interaction.editReply({ embeds: [embed] });
}

export default {
    data,
    run
}