const { CommandInteraction, Client, SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const db = require('../../utils/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View a member\'s statistics')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Target user')
        .setRequired(false)
    ),
  /**
   * 
   * @param {CommandInteraction} interaction 
   * @param {Client} client 
   */
  async execute(interaction, client) {
    const user = interaction.options.getUser('user') || interaction.user;

    db.get('SELECT * FROM xp WHERE userId = ?', [user.id], (err, row) => {
      if (!row) {
        return interaction.reply({
          content: 'No Data Found.',
          flags: [
            MessageFlags.Ephemeral
          ]
        });
      }

      const hours = Math.floor((row.voiceTime || 0) / 3600);
      const minutes = Math.floor(((row.voiceTime || 0) % 3600) / 60);

      const embed = new EmbedBuilder()
        .setTitle(`📊 ${user.displayName}'s Statistics`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setColor(0xf59e42)
        .addFields(
          { name: "🎮 Level", value: `${row.level}`, inline: true },
          { name: "⚡ Total XP", value: `${row.totalXP}`, inline: true },
          { name: "💬 Messages", value: `${row.messages || 0}`, inline: true },
          { name: "🔊 Voice Time", value: `${hours}h ${minutes}m`, inline: true }
        )
        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    });
  }
}