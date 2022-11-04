let moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
exports.run = {
   usage: ['topuserlocal', 'topuser'],
   async: async (m, {
      client,
      command,
      participants
   }) => {
      if (command == 'topuserlocal') {
         if (!m.isGroup) return client.reply(m.chat, global.status.group, m)
         let member = participants.map(u => u.id)
         let kontol = {}
         for (i = 0; i < member.length; i++) {
            if (typeof global.db.users[member[i]] != "undefined") {
               kontol[member[i]] = {
                  hit: global.db.users[member[i]].hit,
                  lastseen: global.db.users[member[i]].lastseen
               }
            }
         }
         let hit = Object.entries(kontol).sort((a, b) => b[1].hit - a[1].hit)
         let getUser = hit.map(v => v[0])
         let show = Math.min(10, hit.length)
         let teks = `❏  *T O P - U S E R S*\n\n`
         teks += hit.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + '\n	›  *pakai bot* :  ' + Func.formatNumber(data.hit) + '\n	›  *Terakhir dilihat* : ' + moment(data.lastseen).format('DD/MM/YY HH:mm:ss')).join`\n`
         teks += `\n\n${global.db.setting.footer}`
         client.reply(m.chat, teks, m)
      } else if (command == 'topuser') {
         let hit = Object.entries(global.db.users).sort((a, b) => b[1].hit - a[1].hit)
         let getUser = hit.map(v => v[0])
         let show = Math.min(10, hit.length)
         let teks = `❏  *T O P - U S E R S*\n\n`
         teks += hit.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + '\n	›  *pakai bot* :  ' + Func.formatNumber(data.hit) + '\n	›  *Terakhir dilihat* : ' + moment(data.lastseen).format('DD/MM/YY HH:mm:ss')).join`\n`
         teks += `\n\n${global.db.setting.footer}`
         client.reply(m.chat, teks, m)
      }
   },
   error: false
}