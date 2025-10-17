const { SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, Client, MessageFlags } = require('discord.js');
const db = require('../../utils/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xp-reset-all')
    .setDescription('Reset a user\'s XP.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   * 
   * @param {CommandInteraction} interaction 
   * @param {Client} client 
   */
  async execute(interaction, client) {
    db.run('DELETE FROM xp', async () => {
      const config = require('../../config.json');
      const rolesMap = config.rolesByLevel || {};

      const guild = interaction.guild;
      const members = await guild.members.fetch();

      for (const [memberId, member] of members) {
        for (const [level, roleId] of Object.entries(rolesMap)) {
          if (member.roles.cache.has(roleId)) {
            try {
              await member.roles.remove(roleId);
              console.log(`✅ Removed level ${level} role from ${member.user.tag}`);
            } catch (e) {
              console.error(`❌ Error removing role from ${member.user.tag}:`, e.message);
            }
          }
        }
      }

      interaction.reply({
        content: `🚨 All XP has been reset.`,
        flags: [
          MessageFlags.Ephemeral
        ]
      });
    });
  }
}