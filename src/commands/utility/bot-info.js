const { SlashCommandBuilder, CommandInteraction, Client, EmbedBuilder, version: djsVersion, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const os = require('os');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bot-info')
    .setDescription("Shows bot information"),
  /**
   * 
   * @param {CommandInteraction} interaction 
   * @param {Client} client 
   */
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle(`🤖 Bot Information (v${config.version})`)
      .setColor(0x420666)
      .addFields(
        { name: '👤 Creator', value: `<@!148647640081367041>`, inline: true },
        { name: '🖥️ System', value: `${os.type()} ${os.arch()}`, inline: true },
        { name: '📦 discord.js', value: `v${djsVersion}`, inline: true }
      )
      .setFooter({ text: `Requested by ${interaction.user.displayName}`,iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();
    
    const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('GitHub')
          .setStyle(ButtonStyle.Link)
          .setURL('https://github.com/HerobrainGamer/DiscordLevelingBot')
          .setEmoji('📂'),
        new ButtonBuilder()
          .setLabel('Support')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.gg/mFgAj5UvFS')
          .setEmoji('📄')
      );

    await interaction.reply({ embeds: [embed], components: [button] });
  }
}