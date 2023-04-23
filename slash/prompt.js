const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prompt')
        .setDescription('Ask chatgpt anything')
        .addStringOption(option => option.setName('prompt').setDescription('The prompt to ask chatgpt').setRequired(true))
    ,
    run: async ({ client, interaction }) => {
        const prompt = interaction.options.getString('prompt');
        const maxCharacters = 1024;

        if (prompt.length > maxCharacters) {
            interaction.reply(`Prompt must be less than ${maxCharacters} characters.`);
            return;
        }

        const completion = await client.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        let content = completion.data.choices[0].message.content;

        if (content.length > 2000) {
            let atc = new AttachmentBuilder()
                .setFile(Buffer.from(`User: ${prompt}\n\n` + content))
                .setName('Definitely Virus.txt');
            await interaction.editReply({ files: [atc] })
        } else {
            await interaction.editReply(`User: ${prompt}\n\n` + content);
        }
    }
}
