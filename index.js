//Declare Library
const Discord = require('discord.js');
//const dotenv = require('dotenv');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { Player } = require('discord-player');

const LOAD_SPLASH = process.argv[2] === 'load';


//config
const config = require('./config.json');
const CLIENT_ID = config.id;
const GUILD_ID = config.guild_id;

//Client
const client = new Discord.Client({
    intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildVoiceStates
	],
});

client.slashCommands = new Discord.Collection();

client.Player = new Player(client, {
    ytdlOptions: { 
        quality: 'highestaudio', 
        highWaterMark: 1 << 25
    },
});

//Slash Commands
const commands = [];
const SlashFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'));

for (let file of SlashFiles) {
    const slashcmd = require(`./slash/${file}`);
    client.slashCommands.set(slashcmd.data.name, slashcmd);
    if (LOAD_SPLASH) commands.push(slashcmd.data.toJSON());
}

if(LOAD_SPLASH) {
    const rest = new REST({ version: '9' }).setToken(config.token); 
    for (let index = 0; index < GUILD_ID.length; index++) {
        rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID[index]), { body: commands })
        .then(() => {
            console.log('Successfully registered application commands.');
            process.exit(0);
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
    }
}
else {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });
    client.on('interactionCreate', (interaction) => {
        async function handleCommand() {
            if(!interaction.isCommand()) return;

            const slashcmd = client.slashCommands.get(interaction.commandName);
            if(!slashcmd) interaction.reply("Command not found");

            await interaction.deferReply();
            await slashcmd.run({ client, interaction });
        }
        handleCommand();
    });

}
client.login(config.token);