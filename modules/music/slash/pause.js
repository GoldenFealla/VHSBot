import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

import config from "#root/config.json" assert { type: "json" };
import { useMainPlayer } from "discord-player";

const data = new SlashCommandBuilder().setName("pause").setDescription("Pause the music");

/**
 *
 * @param {object} obj
 * @param {import('../../../core/client').Server} obj.server
 * @param {import('discord.js').CommandInteraction} obj.interaction
 * @returns
 */
const run = async ({ interaction }) => {
  const player = useMainPlayer();
  const queue = player.queues.get(interaction.guildId);

  if (!queue) return await interaction.editReply("There are no songs in queue");

  if (queue.node.isPaused()) return await interaction.editReply("Music is already paused!");

  queue.node.pause();

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(config.color)
        .setTitle("🌸🌸🌸 Paused 🌸🌸🌸")
        .setDescription("Music has been paused! Use `/resume` to resume the music!"),
    ],
  });
};

export default {
  data,
  run,
};
