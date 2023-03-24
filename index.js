//Declare Library
const Discord = require('discord.js');

//const dotenv = require('dotenv');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { Player, Playlist } = require('discord-player');
const { OpenAIApi, Configuration } = require('openai')

const LOAD_SPLASH = process.argv[2] === 'load';

//config
const config = require('./config.json');
const CLIENT_ID = config.id;
const GUILD_ID = config.guild_id;

const openaiConfig = new Configuration({
    apiKey: config.openai_key
})


//Client
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildVoiceStates
    ],
});

client.slashCommands = new Discord.Collection();

client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    },
});

client.openai = new OpenAIApi(openaiConfig)

//Slash Commands
const commands = [];
const SlashFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'));

for (let file of SlashFiles) {
    const slashcmd = require(`./slash/${file}`);
    client.slashCommands.set(slashcmd.data.name, slashcmd);
    if (LOAD_SPLASH) commands.push(slashcmd.data.toJSON());
}

if (LOAD_SPLASH) {
    const rest = new REST({ version: '10' }).setToken(config.token);
    rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
        .then(() => {
            console.log('Successfully registered application commands.');
            process.exit(0);
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
else {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });
    client.on('interactionCreate', (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return;

            const slashcmd = client.slashCommands.get(interaction.commandName);
            if (!slashcmd) interaction.reply("Command not found");

            await interaction.deferReply();

            try {
                await slashcmd.run({ client, interaction });
            }
            catch (error) {
                console.error(error);
                await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
        handleCommand();
    });

}
client.login(config.token);