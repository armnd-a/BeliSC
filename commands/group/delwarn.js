exports.run = {
   usage: ['delwarn'],
   async: async (m, {
      client,
      isOwner
   }) => {
      try {
         if (isOwner) {
            let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@` [1]) : text
            if (!text && !m.quoted) return client.reply(m.chat, Func.texted('bold', `Mention atau reply chat target.`), m)
            if (isNaN(number)) return client.reply(m.chat, Func.texted('bold', `Nomor tidak valid.`), m)
            if (number.length > 15) return client.reply(m.chat, Func.texted('bold', `Format tidak valid.`), m)
            try {
               if (text) {
                  var user = number + '@s.whatsapp.net'
               } else if (m.quoted.sender) {
                  var user = m.quoted.sender
               } else if (m.mentionedJid) {
                  var user = number + '@s.whatsapp.net'
               }
            } catch (e) {} finally {
               let member = global.db.users[user]
               if (!member) return client.reply(m.chat, Func.texted('bold', `Target tidak ada di dalam database.`), m)
               if (member.warning == 0) return client.reply(m.chat, Func.texted('bold', `Target suci.`), m)
               member.warning = 0
               return client.reply(m.chat, `Point peringatan @${user.replace(/@.+/,'')} berhasil di hapus.`, m)
            }
         } else {
            let user = global.db.users[m.sender]
            let forPoint = ((50 / 100) * user.point).toFixed(0)
            let forLimit = ((50 / 100) * user.limit).toFixed(0)
            if (user.warning == 0) return client.reply(m.chat, Func.texted('bold', `Kamu tidak memiliki point peringatan.`), m)
            if (user.point < forPoint || user.limit < forLimit) return client.reply(m.chat, Func.texted('bold', `Aset yang kamu miliki tidak cukup untuk menghapus point peringatan.`), m)
            user.point -= forPoint
            user.limit -= forLimit
            user.warning -= 1
            let teks = '- ' + Func.h2k(Func.formatNumber(forPoint)) + ' Point (-50%)\n'
            teks += '- ' + Func.formatNumber(forLimit) + ' Limit (-50%)\n'
            teks += '*Berhasil menghapus 1 point peringatan.*'
            return client.reply(m.chat, teks, m)
         }
      } catch (e) {
         client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   group: true
}