exports.run = {
   usage: ['addprem', 'delprem'],
   async: async (m, {
      client,
      text,
      command,
      participants
   }) => {
      let [no, days] = text.split`,`
      let isDay = (typeof days !== 'undefined') ? days.trim() : 30 // < default 30 days
      let day = 86400000 * isDay
      let now = new Date() * 1
      let number = isNaN(no.trim()) ? (no.startsWith('+') ? no.replace(/[()+\s-]/g, '').trim() : (no).split`@` [1].trim()) : no.trim()
      if (isNaN(number)) return client.reply(m.chat, Func.texted('bold', `Invalid number.`), m)
      if (number.length > 15 || m.quoted) return client.reply(m.chat, global.status.wrong, m)
      try {
         if (no) {
            var user = number + '@s.whatsapp.net'
         } else if (m.quoted.sender) {
            var user = m.quoted.sender
         } else if (m.mentionedJid) {
            var user = number + '@s.whatsapp.net'
         }
      } catch {} finally {
         let userF = global.db.users
         if (typeof userF[user] == 'undefined') return client.reply(m.chat, Func.texted('bold', `Gagal upgrade premium.`), m)
         if (command == 'addprem') {
            if (isNaN(isDay)) return client.reply(m.chat, Func.texted('bold', `Total hari harus berupa angka.`), m)
            if (userF[user].premium) return client.reply(m.chat, Func.texted('bold', `Sebelumnya dia sudah premium kak.`), m)
            userF[user].premium = true
            userF[user].expired = now + day
            let premium = 0
            for (let jid in userF) {
               if (userF[jid].premium) premium++
            }
            client.reply(m.chat, `❏  *P R E M I U M*\n\n*“Berhasil memberikan akses premium kepada @${user.split`@`[0]} sekarang kamu premium selama ${isDay} hari”*\n\n*Total : ${premium} user premium*`, m)
         } else if (command == 'delprem') {
            if (!userF[user].premium) return client.reply(m.chat, `*Sebelumnya dia bukan user premium.*`, m)
            userF[user].premium = false
            userF[user].expired = 0
            let premium = 0
            for (let jid in userF) {
               if (userF[jid].premium) premium++
            }
            client.reply(m.chat, `❏  *D E L P R E M*\n\n*“@${user.split`@`[0]} maaf status premium kamu direset oleh owner.”*\n\n*Tersisa : ${premium} user premium*`, m)
         }
      }
   },
   owner: true,
   cache: true,
   location: __filename
}