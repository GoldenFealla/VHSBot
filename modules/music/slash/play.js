import { SlashCommandBuilder } from '@discordjs/builders'
import { EmbedBuilder } from 'discord.js'

import { Playlist, QueryType, Track } from 'discord-player'

import { getSeconds, getMinutes, getHours } from '#helpers/time.js'
import config from '#root/config.json' assert { type: "json" };

const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or playlist')
    .addSubcommand((subcommand) =>
        subcommand.setName('song')
            .setDescription('Play a song or playlist from url')
            .addStringOption((option) => option.setName('url').setDescription('Song URL').setRequired(true))
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('search')
            .setDescription('Search song from keywords')
            .addStringOption((option) => option.setName('searchterms').setDescription('the song keywords').setRequired(true))
    )

/**
 * @param {Track} track 
 * @returns 
 */
const createEmbedBySingleTrack = (track) => {
    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle(`🌸🌸🌸 Added song to queue 🌸🌸🌸`)
        .setDescription(`Added **[${track.title}](${track.url})** to the queue!\nRequested by <@${track.requestedBy.id}>`)
        .setImage(track.thumbnail)
        .setFooter({ text: `Duration: ${track.duration}` })

    return embed;
}

/**
 * @param {Playlist} playlist 
 * @returns 
 */
const createEmbedByPlaylist = (playlist) => {
    const embed = new EmbedBuilder()

    const duration = Math.floor(playlist.estimatedDuration / 1000);
    
    const hours = getHours(duration);
    const minutes = getMinutes(duration);
    const seconds = getSeconds(duration);

    embed
        .setColor(config.color)
        .setTitle(`🌸🌸🌸 Added playlist to queue 🌸🌸🌸`)
        .setDescription(`Added **[${playlist.tracks.length} songs](${playlist.url})** from **[${playlist.title}](${playlist.url})** to the queue!`)
        .setImage(playlist.thumbnail)
        .setFooter({ text: `Duration:  ${hours}:${minutes}:${seconds}` })

    return embed;
}

/**
 * @param {object} obj 
 * @param {import('discord.js').Interaction} obj.interaction
 * @param {import('../../../core/client').Server} obj.server
 * @returns 
 */
const playByURL = async ({server, interaction}) => {
    const url = interaction.options.getString('url');

    const { track, searchResult } = await server.player.play(interaction.member.voice.channel, url,
        {
            nodeOptions: {
                metadata: interaction,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 120000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 120000
            }
        }
    );

    if (!searchResult.playlist) {
        track.requestedBy = interaction.user

        const embed = createEmbedBySingleTrack(track);

        await interaction.editReply({ embeds: [embed] });
    }
    else {
        const playlist = searchResult.playlist;
        playlist.tracks.forEach((trk) => { trk.requestedBy = interaction.user })

        const embed = createEmbedByPlaylist(playlist);

        await interaction.editReply({ embeds: [embed] });
    }
}

/**
 * @param {object} obj 
 * @param {import('discord.js').Interaction} obj.interaction
 * @param {import('../../../core/client').Server} obj.server
 * @returns 
 */
const playBySearch = async ({ server, interaction }) => {
    let url = interaction.options.getString('searchterms');
    
    const result = await server.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO
    })

    if (result.tracks.length === 0)
        return interaction.editReply('No results!');

    const embed = createEmbedBySingleTrack(result.tracks[0]);

    await interaction.editReply({ embeds: [embed] });
}

/**
 * @param {object} obj 
 * @param {import('discord.js').Interaction} obj.interaction
 * @param {import('../../../core/client').Server} obj.server
 * @returns 
 */
const run = async ({ server, interaction }) => {
    const channel = interaction.member.voice.channel;
    if (!channel)
        return interaction.editReply('You must be in a voice channel to use this command!');

    if (interaction.options.getSubcommand() === 'song') {
        await playByURL({ server, interaction });
    } else if (interaction.options.getSubcommand() === 'search') {
        await playBySearch({ server, interaction });
    }
}

export default {
    data,
    run
}
