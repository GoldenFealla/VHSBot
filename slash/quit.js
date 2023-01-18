const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quit')
        .setDescription('Stop the music and leave the voice channel'),
    run: async ({ client, interaction }) => {
        const queue = client.Player.getQueue(interaction.guildId);

        if(!queue) return await interaction.editReply('There are no songs in queue');

        queue.destroy();

        await interaction.editReply('Stopped the music and left the voice channel!');
    }
}