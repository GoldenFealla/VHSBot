import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';

import config from '#root/config.json' assert { type: "json" };

const data = new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the music');

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

    if (queue.node.isPlaying())
        return await interaction.editReply("Music is already played!");

    queue.node.resume();
    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setColor(config.color)
                .setTitle('🌸🌸🌸 Resumed 🌸🌸🌸')
                .setDescription("Music has been resumed! Use \`/pause\` to pause the music!")
        ]
    });
}

export default {
    data,
    run
}