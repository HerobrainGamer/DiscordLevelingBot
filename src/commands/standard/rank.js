const { SlashCommandBuilder, CommandInteraction, Client, MessageFlags, EmbedBuilder } = require('discord.js');
const db = require('../../utils/db');
const { getNeededXP } = require('../../utils/xpSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('View a member\'s current level and XP')
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
    //const userId = interaction.user.id;

    db.get(`SELECT * FROM xp WHERE userId = ?`, [user.id], (err, row) => {
      if (!row) {
        return interaction.reply({
          content: 'No Data Found.',
          flags: [
            MessageFlags.Ephemeral
          ]
        });
      }

      const needed = getNeededXP(row.level);
      const progressPercent = Math.floor((row.xp / needed) * 100);

      const embed = new EmbedBuilder()
        .setColor(0x1E90FF)
        .setTitle(`🏅 ${user.displayName}'s Rank`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: '📈 Level', value: `${row.level}`, inline: true },
          { name: '🔋 Current XP', value: `${row.xp} / ${needed} XP`, inline: true },
          { name: '📊 Progress', value: `${progressPercent}%`, inline: true }
        )
        .setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

        interaction.reply({ embeds: [embed] });
    })
  }
}