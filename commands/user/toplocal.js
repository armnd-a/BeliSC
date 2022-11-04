exports.run = {
   usage: ['toplocal'],
   async: async (m, {
      client,
      participants
   }) => {
      let member = participants.map(u => u.id)
      let kontol = {}
      for (i = 0; i < member.length; i++) {
         if (typeof global.db.users[member[i]] != 'undefined' && member[i] != client.user.id.split(':')[0] + '@s.whatsapp.net') {
            kontol[member[i]] = {
               point: global.db.users[member[i]].point,
               limit: global.db.users[member[i]].limit
            }
         }
      }
      let point = Object.entries(kontol).sort((a, b) => b[1].point - a[1].point)
      let limit = Object.entries(kontol).sort((a, b) => b[1].limit - a[1].limit)
      let rankPoint = point.map(v => v[0])
      let rankLimit = limit.map(v => v[0])
      let isPoint = Math.min(10, point.length)
      let isLimit = Math.min(10, limit.length)
      let teks = `❏  *T O P - L O C A L*\n\n`
      teks += `Uang Anda di peringkat *${rankPoint.indexOf(m.sender) + 1}* dari *${member.length}* anggota ${await (await client.groupMetadata(m.chat)).subject}\n\n`
      teks += point.slice(0, isPoint).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + '\n    *Uang  :  Rp.' + Func.h2k(data.point) + '*').join`\n`
      teks += `\n\n`
      teks += `Limit Anda di peringkat *${rankLimit.indexOf(m.sender) + 1}* dari *${member.length}* anggota ${await (await client.groupMetadata(m.chat)).subject}\n\n`
      teks += limit.slice(0, isLimit).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + '\n    *Limit  :  ' + Func.formatNumber(data.limit) + '*').join`\n`
      teks += `\n\n${global.db.setting.footer}`
      client.reply(m.chat, teks, m)
   },
   error: false,
   group: true
}