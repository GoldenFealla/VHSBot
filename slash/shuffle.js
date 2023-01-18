const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue'),
    run: async ({ client, interaction }) => {
        const queue = client.Player.getQueue(interaction.guildId);

        if(!queue) return await interaction.editReply('There are no songs in queue');

        queue.shuffle();

        await interaction.editReply(`The queue of ${queue.tracks.length} songs has been shuffled!`);
    }
}