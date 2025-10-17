const { SlashCommandBuilder, CommandInteraction, Client, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows the list of available commands.'),
  /**
   * 
   * @param {CommandInteraction} interaction 
   * @param {Client} client 
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("📖 Avaiable Commands.")
      .addFields(
        {
          name: '-x- Standard Commands -x-',
          value: [
            `\`/rank\` - Shows your level`,
            `\`/stats\` - Shows members stats`,
            `\`/leaderboard\` - Top users ranking`
          ].join('\n')
        },
        {
          name: '-x- Admin Commands -x-',
          value: [
            `\`/xp-add\` - Add XP to a user (Manage Server Needed)`,
            `\`/xp-remove\` - Remove XP from a user (Manage Server Needed)`,
            `\`/xp-reset\` - Reset a user (Manage Server Needed)`,
            `\`/xp-reset-all\` - Reset everything (Adminstrator Needed)`
          ].join('\n')
        },
        {
          name: '-x- Utility Commands -x-',
          value: [
            `\`/help\` - This command`,
            `\`/bot-info\` - Bot information`
          ].join('\n')
        }
      )
      .setColor("Blue");

    interaction.reply({
      embeds: [embed],
      flags: [
        MessageFlags.Ephemeral
      ]
    });
  }
}