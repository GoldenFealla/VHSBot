const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skip to certain song in the queue')
        .addNumberOption(option => option.setName('number').setDescription('The track to skip to').setMinValue(1).setRequired(true)),
    run: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guildId);

        if (!queue) return await interaction.editReply('There are no songs in queue');

        const trackNumber = interaction.options.getNumber('number');

        if (trackNumber > queue.tracks.length)
            return await interaction.editReply(`There are only ${queue.tracks.length} songs in queue`);

        queue.node.skipTo(trackNumber - 1);

        await interaction.editReply(`Skipped to track number ${trackNumber}`);
    }
}