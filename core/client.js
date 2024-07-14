import Discord from "discord.js";
import { REST } from "@discordjs/rest";

import { Player } from "discord-player";
import { YoutubeiExtractor, createYoutubeiStream } from "discord-player-youtubei";

import dotenv from "dotenv";
const env = dotenv.config().parsed;

const { CLIENT_ID, ADMIN_ID, DISCORD_TOKEN, MAIN_GUILD_ID } = env;

/**
 * @exports Server
 * @typedef {object} Server
 * @property {Discord.Client<boolean>} client
 * @property {Discord.Collection<string, VHSSlashCommand>} slashCommands
 * @property {Array<any>} slashCommandDatas
 *
 * @property {(module: import('../modules/index.js').VHSModule) => void} loadModule
 * @property {() => void} loadSlashCommands
 * @property {() => void} resetSlashCommands
 * @property {() => void} start
 */

export const initializeServer = async () => {
  /** @type {Server} */
  const server = {
    client: null,
    slashCommands: null,
    slashCommandDatas: [],
  };

  const client = new Discord.Client({
    intents: [
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildMessages,
      Discord.GatewayIntentBits.GuildVoiceStates,
    ],
  });

  const handleOnReady = () => {
    console.log(`Logged in as ${client.user.tag}!`);
  };

  /**
   * @param {Discord.Interaction<Discord.CacheType>} interaction
   * @returns
   */
  const handleOnInteractionCreate = async (interaction) => {
    if (!interaction.isCommand()) {
      interaction.reply("This is not a command");
    }

    const command = server.slashCommands.get(interaction.commandName);

    if (!command) {
      interaction.reply("Command not found");
      return;
    }

    await interaction.deferReply();

    try {
      await command.run({ server, interaction });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: `
                        There was an error while executing this command!
                        Error:
                        \`\`\`
                        ${error.message}
                        \`\`\`
                    `,
        ephemeral: true,
      });
    }
  };

  /**
   * @param {Error} error
   */
  const handleOnError = (error) => {
    console.error(error);
  };

  client.on("ready", handleOnReady);
  client.on("interactionCreate", handleOnInteractionCreate);
  client.on("error", handleOnError);

  const player = new Player(client);

  //Temporarily using youtubei extractor
  await player.extractors.register(YoutubeiExtractor, {});

  await player.extractors.loadDefault();

  server.slashCommands = new Discord.Collection();
  server.client = client;

  server.loadModule = (module) => {
    module.slashes.forEach((slash) => {
      server.slashCommands.set(slash.data.name, slash);
      server.slashCommandDatas.push(slash.data.toJSON());
    });
  };

  server.loadSlashCommands = () => {
    const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

    rest
      .put(Discord.Routes.applicationCommands(CLIENT_ID), { body: server.slashCommandDatas })
      .then((r) => {
        console.log("Successfully registered application commands.");
        process.exit(0);
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  };

  server.resetSlashCommands = () => {
    const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

    rest
      .put(Discord.Routes.applicationCommands(CLIENT_ID), { body: [] })
      .then(() => {
        console.log("Successfully reset application commands.");
        process.exit(0);
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  };

  server.start = () => {
    console.log(`Starting client...`);
    client.login(DISCORD_TOKEN);
  };

  return server;
};
