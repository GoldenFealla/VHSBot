import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js'

import config from '#root/config.json' assert { type: "json" };

const data = new SlashCommandBuilder()
    .setName('current')
    .setDescription('Display the info of current song');

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

    let bar = queue.node.createProgressBar({
        queue: false,
        length: 20,
    });

    const currentTrack = queue.currentTrack;

    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle('🌸🌸🌸 Current Playing 🌸🌸🌸')
        .setDescription(`Current Playing [${currentTrack.title}](${currentTrack.url})\n\n` + bar)

    await interaction.editReply({ embeds: [embed]});
}

export default {
    data,
    run
}