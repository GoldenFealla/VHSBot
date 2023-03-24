const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the music'),
    run: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guildId);

        if (!queue) return await interaction.editReply('There are no songs in queue');

        if (queue.node.isPaused())
            return await interaction.editReply("Music is already paused!");

        queue.node.pause();
        await interaction.editReply("Music has been paused! Use \`/resume\` to resume the music!");
    }
}