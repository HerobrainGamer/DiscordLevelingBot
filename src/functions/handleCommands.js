const fs = require('fs');
const { Client } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require('../config.json');

const clientId = config.clientId;
const guildId = config.guildId;
const guildMode = config.guildMode;

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
  client.handleCommands = async (commandFolders, path) => {
    client.commandArray = [];
    for (folder of commandFolders) {
      const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
      }
    }

    const rest = new REST({
      version: '10'
    }).setToken(config.token);

    (async () => {
      try {
        if (guildMode) {
          console.log('Started registering guild commands.');
          await rest.put(
            Routes.applicationGuildCommands(clientId, guildId), {
              body: client.commandArray
            });
          console.log('Successfully reloaded guild commands.');
        } else {
          console.log('Started registering application commands.');
          await rest.put(
            Routes.applicationCommands(clientId), {
              body: client.commandArray
            });
          console.log('Successfully reloaded application commands.');
        }
      } catch (error) {
        console.error(error);
      }
    }) ();
  }
}
