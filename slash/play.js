const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
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
        ),
    run: async ({ client, interaction }) => {
        const channel = interaction.member.voice.channel;
        if (!channel)
            return interaction.editReply('You must be in a voice channel to use this command!');

        // const queue = client.player.createQueue(interaction.guild)
        // if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        let embed = new EmbedBuilder();

        if (interaction.options.getSubcommand() === 'song') {
            let url = interaction.options.getString('url');

            const { track, searchResult } = await client.player.play(channel, url,
                {
                    nodeOptions: {
                        metadata: interaction,
                        leaveOnEmptyCooldown: 120000,
                    }
                }
            );

            if (!searchResult.playlist) {
                track.requestedBy = interaction.user

                embed
                    .setDescription(`Added **[${track.title}](${track.url})** to the queue!`)
                    .setThumbnail(track.thumbnail)
                    .setFooter({ text: `Duration: ${track.duration}` })
            }
            else {
                const playlist = searchResult.playlist;
                playlist.tracks.forEach((trk) => { trk.requestedBy = interaction.user })

                const duration = Math.floor(playlist.estimatedDuration / 1000);
                const [hours, minutes, seconds] = [
                    Math.floor(duration / 3600).toString().padStart(2, '0'),
                    Math.floor(duration % 3600 / 60).toString().padStart(2, '0'),
                    Math.floor(duration % 60).toString().padStart(2, '0')
                ]

                embed
                    .setDescription(`Added **[${playlist.tracks.length} songs](${playlist.url})** from **[${playlist.title}](${playlist.url})** to the queue!`)
                    .setThumbnail(track.thumbnail)
                    .setFooter({ text: `Duration:  ${hours}:${minutes}:${seconds}` })
            }

        } else if (interaction.options.getSubcommand() === 'search') {
            let url = interaction.options.getString('searchterms');
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply('No results!');

            const song = result.tracks[0];
            await queue.addTracks(song);

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue!`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })
        }

        await interaction.editReply({ embeds: [embed] });
    }
}
