const { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, Client, MessageFlags } = require('discord.js');
const db = require('../../utils/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xp-reset')
    .setDescription('Reset a user\'s XP.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addUserOption(option => 
      option.setName('user')  
        .setDescription('The user to reset.')
        .setRequired(true)
    ),
  /**
   * 
   * @param {CommandInteraction} interaction 
   * @param {Client} client 
   */
  async execute(interaction, client) {
    const user = interaction.options.getUser('user');

    db.run('UPDATE xp SET xp = 0, totalXP = 0, level = 0 WHERE userId = ?', [user.id], async () => {
      const config = require('../../config.json');
      const rolesMap = config.rolesByLevel || {};

      const guild = interaction.guild;
      const member = await guild.members.fetch(user.id).catch(() => null);

      if (member) {
        for (const [level, roleId] of Object.entries(rolesMap)) {
          if (member.roles.cache.has(roleId)) {
            try {
              await member.roles.remove(roleId);
              console.log(`✅ Removed level ${level} role from ${user.tag}`);
            } catch (err) {
              console.error(`❌ Error removing role from ${user.tag}:`, err.message);
            }
          }
        }
      }

      interaction.reply({
        content: `🔄 ${user.tag}'s XP has been reset.`,
        flags: [
          MessageFlags.Ephemeral
        ]
      });
    });
  }
}