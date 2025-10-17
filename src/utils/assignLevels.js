const { Client } = require("discord.js");
const config = require('../config.json');
const db = require('./db');

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
  console.log('🔍 Checking level roles...');

  const guild = client.guilds.cache.first();
  if (!guild) return;

  const rolesMap = config.rolesByLevel || {};
  const members = await guild.members.fetch();

  const roleLevels = Object.keys(rolesMap).map(lvl => parseInt(lvl)).sort((a, b) => b - a);

  db.all('SELECT userId, level FROM xp', async (err, rows) => {
    if (err) return console.error('❌ DB Error (auto roles):', err);

    for (const row of rows) {
      const member = members.get(row.userId);
      if (!member) continue;

      let roleId = null;
      for (const lvl of roleLevels) {
        if (row.level >= lvl) {
          roleId = rolesMap[lvl.toString()];
          break;
        }
      }

      console.log(`[DEBUG] ${row.userId} (level ${row.level}) -> role ID ${roleId}`);

      if (!roleId) continue;

      if (!member.roles.cache.has(roleId)) {
        try {
          await member.roles.add(roleId);
          console.log(`✅ ${member.user.tag} received level ${row.level} role.`);
        } catch (err) {
          console.error(`❌ Error giving role to ${member.user.tag}:`, err.message);
        }
      }
    }
  });
}
