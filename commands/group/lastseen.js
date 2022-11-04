let moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
exports.run = {
   usage: ['lastseen', 'seen'],
   async: async (m, {
      client,
      participants
   }) => {
      try {
         let member = participants.filter(u => u.admin == null).map(u => u.id)
         let day = 86400000 * 7,
            now = new Date() * 1
         let sider = []
         member.map(v => typeof global.db.groups[m.chat].member[v] == 'undefined' ? sider.push(v) : '')
         let lastseen = Object.entries(global.db.groups[m.chat].member).slice(0, 20).sort((a, b) => b[1].lastseen - a[1].lastseen)
         let teks = `❏  *W H A T S A P P*\n\n`
         // teks += `“There are *${lastseen.length}* members of the ${await (await client.groupMetadata(m.chat)).subject} group who have been inactive for more than 1 week.”\n\n`
         teks += lastseen.map(([v, x]) => '	◦  @' + v.replace(/@.+/, '') + '\n	     *Terakhir Dilihat* : ' + moment(x.lastseen).format('DD/MM/YY HH:mm:ss')).join('\n')
         teks += `\n\n${global.db.setting.footer}`
         client.fakeStory(m.chat, teks, global.db.setting.header)
      } catch (e) {
         client.reply(m.chat, require('util').format(e), m)
      }
   },
   error: false,
   group: true
}