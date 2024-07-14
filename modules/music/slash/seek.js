import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";

import config from "#root/config.json" assert { type: "json" };
import { useMainPlayer } from "discord-player";

const data = new SlashCommandBuilder()
  .setName("seek")
  .setDescription("seek to a specific time in the song")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("second")
      .setDescription("seek to a specific time in the song in seconds")
      .addNumberOption((option) =>
        option
          .setName("second")
          .setDescription("jump to specific time in the song")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("milisecond")
      .setDescription("seek to a specific time in the song in miliseconds")
      .addNumberOption((option) =>
        option
          .setName("milisecond")
          .setDescription("jump to specific time in the song")
          .setRequired(true)
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

  const currentTrack = queue.currentTrack;

  const embed = new EmbedBuilder().setColor(config.color).setTitle("🌸🌸🌸 Seek 🌸🌸🌸");

  if (interaction.options.getSubcommand() === "second") {
    const second = interaction.options.getNumber("second");
    await queue.node.seek(second);
    embed.setDescription(
      `Seeked [${currentTrack.title}](${currentTrack.url})! at second ${second}`
    );
  } else {
    const milisecond = interaction.options.getNumber("milisecond");
    await queue.node.seek(milisecond / 1000);
    embed.setDescription(
      `Seeked [${currentTrack.title}](${currentTrack.url})! at milisecond ${milisecond}`
    );
  }

  await interaction.editReply({ embeds: [embed] });
};

export default {
  data,
  run,
};
