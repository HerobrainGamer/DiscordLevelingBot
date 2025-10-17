const { Client } = require('discord.js');
const assignLevelRoles = require('../utils/assignLevels');

module.exports = {
  name: 'clientReady',
  once: true,
  /**
   * 
   * @param {Client} client 
   */
  async execute (client) {
    console.log(`Bot started as ${client.user.tag}!`);

    client.user.setPresence({
      activities: [{ name: 'Server Messages', type: 3 }],
      status: 'dnd'
    });

    assignLevelRoles(client);
    setInterval(() => assignLevelRoles(client), 86400000);
  }
}
