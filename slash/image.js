const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('prompt an image')
        .addStringOption(option => option.setName('prompt').setDescription('The prompt to ask chatgpt').setRequired(true))
    ,
    run: async ({ client, interaction }) => {
        const prompt = interaction.options.getString('prompt');
        const maxCharacters = 1024;

        if (prompt.length > maxCharacters) {
            interaction.reply(`Prompt must be less than ${maxCharacters} characters.`);
            return;
        }

        const image = await client.openai.createImage({
            prompt: `${prompt}`,
            n: 1,
            size: "1024x1024",
        });

        let content = image.data.data[0].url;
        await interaction.editReply(content);
    }
}