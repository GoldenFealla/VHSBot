import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import { QueueRepeatMode, useMainPlayer } from "discord-player";

import config from "#root/config.json" assert { type: "json" };

const data = new SlashCommandBuilder()
  .setName("loop")
  .setDescription("loop the music!!")
  .addStringOption((option) =>
    option
      .setName("mode")
      .setDescription("Loop mode")
      .setRequired(true)
      .addChoices(
        { name: "Off", value: "off" },
        { name: "Track", value: "track" },
        { name: "Queue", value: "queue" },
        { name: "Autoplay", value: "autoplay" }
      )
  );

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

  const mode = interaction.options.getString("mode");

  let message = "";

  switch (mode) {
    case "off":
      queue.setRepeatMode(QueueRepeatMode.OFF);
      message = "Loop mode is now **OFF**";
      break;
    case "track":
      queue.setRepeatMode(QueueRepeatMode.TRACK);
      message = "Loop mode is now **TRACK**";
      break;
    case "queue":
      queue.setRepeatMode(QueueRepeatMode.QUEUE);
      message = "Loop mode is now **QUEUE**";
      break;
    case "autoplay":
      queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
      message = "Loop mode is now **AUTOPLAY**";
      break;
    default:
      message = "Invalid loop mode";
      break;
  }

  const embed = new EmbedBuilder()
    .setColor(config.color)
    .setTitle("🌸🌸🌸 Loop 🌸🌸🌸")
    .setDescription(message);

  await interaction.editReply({ embeds: [embed] });
};

export default {
  data,
  run,
};
