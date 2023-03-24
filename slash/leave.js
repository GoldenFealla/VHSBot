const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Stop the music and leave the voice channel'),
    run: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guildId);

        if (!queue.tracks) return await interaction.editReply('There are no songs in queue');

        queue.node.stop();

        await interaction.editReply('Stopped the music and left the voice channel!');
    }
}