const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the music'),
    run: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guildId);

        if (!queue) return await interaction.editReply('There are no songs in queue');

        if (queue.node.isPlaying())
            return await interaction.editReply("Music is already played!");

        queue.node.resume();
        await interaction.editReply("Music has been resumed! Use \`/pause\` to pause the music!");
    }
}