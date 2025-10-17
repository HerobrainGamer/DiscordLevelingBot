const { addXP } = require('../utils/xpSystem');
const db = require('../utils/db');
const { Message } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  /**
   * 
   * @param {Message} message 
   * @returns 
   */
  async execute(message) {
    if (message.author.bot) return;

    addXP(db, message.author.id, 10, message.client, message.guild?.id, message);

    setTimeout(() => {
      db.get(`SELECT * FROM xp WHERE userId = ?`, [message.author.id], (err, row) => {
        let sentMessages = row.messages + 1;

        db.run('UPDATE xp SET messages = ? WHERE userId = ?', [sentMessages, message.author.id]);
      });
    }, 2000);
  }
};
