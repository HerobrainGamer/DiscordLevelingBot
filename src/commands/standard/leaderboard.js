const { SlashCommandBuilder, CommandInteraction, Client, MessageFlags, EmbedBuilder } = require('discord.js');
const db = require('../../utils/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Top users ranking.'),
  /**
   * 
   * @param {CommandInteraction} interaction 
   * @param {Client} client 
   */
  async execute(interaction, client) {
    db.all(`SELECT * FROM xp ORDER BY level DESC, xp DESC LIMIT 10`, [], (err, rows) => {
      if (!rows || rows.length === 0) {
        return interaction.reply({
          content: 'No leaderboard data yet.',
          flags: [
            MessageFlags.Ephemeral
          ]
        });
      }

      const leaderboard = rows.map((row, i) => {
        return `**${i + 1}.** <@${row.userId}> - Level ${row.level} (${row.totalXP} XP)`;
      }).join('\n');

      const embed = new EmbedBuilder()
        .setTitle("🏆 Leaderboard")
        .setDescription(leaderboard)
        .setColor(0xFFD700)
        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    });
  }
}