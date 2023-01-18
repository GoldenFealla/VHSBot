const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song or playlist')
        .addSubcommand((subcommand) => 
            subcommand.setName('song')
                .setDescription('Play a single song from url')
                .addStringOption((option) => option.setName('url').setDescription('Song URL').setRequired(true))
        )
        .addSubcommand((subcommand) => 
            subcommand.setName('playlist')
                .setDescription('Load a playlist from url')
                .addStringOption((option) => option.setName('url').setDescription('Playlist URL').setRequired(true))
        )
        .addSubcommand((subcommand) => 
            subcommand.setName('search')
                .setDescription('Search song from keywords')
                .addStringOption((option) => option.setName('searchterms').setDescription('the song keywords').setRequired(true))
        ),
    run: async ({ client, interaction }) => {
        if(!interaction.member.voice.channel) 
            return interaction.editReply('You must be in a voice channel to use this command!');  
            
        const queue = await client.Player.createQueue(interaction.guild);
        if(!queue.connection) await queue.connect(interaction.member.voice.channel);

        let embed = new EmbedBuilder();

        if(interaction.options.getSubcommand() === 'song') {
            let url = interaction.options.getString('url');
            const result = await client.Player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if(result.tracks.length === 0)
                return interaction.editReply('No results!');

            const song = result.tracks[0];
            await queue.addTrack(song);

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue!`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})

        } else if (interaction.options.getSubcommand() === 'playlist') {
            let url = interaction.options.getString('url');
            const result = await client.Player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            
            if(result.tracks.length === 0)
                return interaction.editReply('No results!');

            const playlist = result.playlist;
            await queue.addTracks(result.tracks);

            embed
                .setDescription(`Added playlist **[${playlist.title}](${playlist.url})** to the queue!`)
                .setThumbnail(playlist.thumbnail)

        } else if (interaction.options.getSubcommand() === 'search') {
            let url = interaction.options.getString('searchterms');
            const result = await client.Player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if(result.tracks.length === 0)
                return interaction.editReply('No results!');

            const song = result.tracks[0];
            await queue.addTracks(song);

            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue!`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
        } 

        if(!queue.playing) await queue.play();
        await interaction.editReply({ embeds: [embed] });
    }
}
