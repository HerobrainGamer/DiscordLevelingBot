const { Client, Interaction, MessageFlags } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  /**
   * 
   * @param {Interaction} interaction 
   * @param {Client} client 
   * @returns
   */
  async execute (interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: [
          MessageFlags.Ephemeral
        ]
      })
    }
  }
}
