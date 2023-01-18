const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('loop the music!!')
        .addStringOption((option) => option.setName('mode').setDescription('Loop mode').setRequired(true)
        .addChoices(
            {name: 'Off', value: 'off'},
            {name: 'Track', value: 'track'},
            {name: 'Queue', value: 'queue'},
            {name: 'Autoplay', value: 'autoplay'}
        )
        ),
    run: async ({ client, interaction }) => {
        const queue = client.Player.getQueue(interaction.guildId);

        if(!queue) return await interaction.editReply('There are no songs in queue');

        const mode = interaction.options.getString('mode');

        if(mode === 'off') {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            await interaction.editReply('Loop mode is now off');
        }
        if(mode === 'track') {
            queue.setRepeatMode(QueueRepeatMode.TRACK);
            await interaction.editReply('Loop mode is now track');
        }
        if(mode === 'queue') {
            queue.setRepeatMode(QueueRepeatMode.QUEUE);
            await interaction.editReply('Loop mode is now queue');
        }
        if(mode === 'autoplay') {
            queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            await interaction.editReply('Loop mode is now autoplay');
        }
    }
}