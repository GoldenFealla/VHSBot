/**
 * @exports VHSSlashCommand
 * @typedef {object} VHSSlashCommand
 * @property {import("discord.js").SlashCommandSubcommandsOnlyBuilder} data
 * @property {(client: Discord.Client<boolean>, interaction: Discord.Interaction<Discord.CacheType>) => Promise<any>} run
 */

/**
 * @exports VHSModule
 * @typedef {object} VHSModule
 * @property {VHSSlashCommand[]} slashes
 */