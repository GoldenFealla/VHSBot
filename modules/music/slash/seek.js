import { SlashCommandBuilder } from '@discordjs/builders';

const data = new SlashCommandBuilder()
    .setName('seek')
    .setDescription('seek to a specific time in the song')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('second')
            .setDescription('Play a song or playlist from url')
            .addNumberOption((option) => option.setName('second').setDescription('jump to specific time in the song').setRequired(true))
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('milisecond')
            .setDescription('Play a song or playlist from url')
            .addNumberOption((option) => option.setName('milisecond').setDescription('jump to specific time in the song').setRequired(true))
    )

/**
 * 
 * @param {object} obj
 * @param {import('../../../core/client').Server} obj.server
 * @param {import('discord.js').CommandInteraction} obj.interaction
 * @returns 
 */
const run = async ({ client, interaction }) => {
    const queue = client.player.queues.get(interaction.guildId);

    if (!queue) return await interaction.editReply('There are no songs in queue');

    const currentTrack = queue.currentTrack;

    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle('🌸🌸🌸 Seek 🌸🌸🌸')

    if (interaction.options.getSubcommand() === 'second') {
        const second = interaction.options.getNumber('second');
        queue.node.seek(second * 1000);
        embed = embed.setDescription(`Seeked ${currentTrack.title}! at second ${second}`);
    } else {
        const milisecond = interaction.options.getNumber('milisecond');
        queue.node.seek(milisecond);
        embed = embed.setDescription(`Seeked ${currentTrack.title}! at milisecond ${milisecond}`);
    }

    await interaction.editReply({ embeds: [embed] });
}

export default {
    data,
    run
}