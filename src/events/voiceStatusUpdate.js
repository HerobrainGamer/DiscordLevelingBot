const { addXP } = require('../utils/xpSystem');
const db = require('../utils/db');
const { VoiceState } = require('discord.js');

const voiceIntervals = new Map();

module.exports = {
  name: 'voiceStateUpdate',
  /**
   * 
   * @param {VoiceState} oldState 
   * @param {VoiceState} newState 
   */
  async execute(oldState, newState) {
    const member = newState.member;

    if (member.user.bot) return;

    const isJoining = !oldState.channelId && newState.channelId;
    const isLeaving = oldState.channelId && !newState.channelId;

    if (isJoining && !voiceIntervals.has(member.id)) {
      const interval = setInterval(() => {
        addXP(db, member.id, 5, member.client, member.guild.id, null);

        db.get(`SELECT * FROM xp WHERE userId = ?`, [member.id], (err, row) => {
          let voiceCallTime = row.voiceTime + 30;

          db.run('UPDATE xp SET voiceTime = ? WHERE userId = ?', [voiceCallTime, member.id]);
        });
      }, 30_000);

      voiceIntervals.set(member.id, interval);
    }

    if(isLeaving && voiceIntervals.has(member.id)) {
      clearInterval(voiceIntervals.get(member.id));
      voiceIntervals.delete(member.id);
    }
  }
};
