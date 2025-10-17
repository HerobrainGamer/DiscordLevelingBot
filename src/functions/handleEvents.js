const { Client } = require('discord.js');

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
  client.handleEvents = async (eventFiles, path) => {
    for (const file of eventFiles) {
      const event = require(`../events/${file}`);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  }
}
