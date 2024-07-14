import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

import config from "#root/config.json" assert { type: "json" };
import { useMainPlayer } from "discord-player";

const data = new SlashCommandBuilder().setName("shuffle").setDescription("Shuffle the queue");

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

  queue.tracks.shuffle();

  const embed = new EmbedBuilder()
    .setColor(config.color)
    .setTitle("🌸🌸🌸 Shuffled 🌸🌸🌸")
    .setDescription(`The queue of ${queue.tracks.length} songs has been shuffled!`);

  await interaction.editReply({ embeds: [embed] });
};

export default {
  data,
  run,
};
