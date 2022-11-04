exports.run = {
   usage: ['addvip', 'delvip'],
   async: async (m, {
      client,
      text,
      command
   }) => {
      let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@` [1]) : text
      if (!text && !m.quoted) return client.reply(m.chat, Func.texted('bold', `Mention or Reply chat target.`), m)
      if (isNaN(number)) return client.reply(m.chat, Func.texted('bold', `Invalid number.`), m)
      if (number.length > 15) return client.reply(m.chat, Func.texted('bold', `Invalid format.`), m)
      try {
         if (text) {
            var user = number + '@s.whatsapp.net'
         } else if (m.quoted.sender) {
            var user = m.quoted.sender
         } else if (m.mentionedJid) {
            var user = number + '@s.whatsapp.net'
         }
      } catch (e) {} finally {
         let access = global.db.users
         if (typeof access[user] == 'undefined') return client.reply(m.chat, Func.texted('bold', `Can't find user data.`), m)
         if (command == 'addvip') {
            if (access[user].vip) return client.reply(m.chat, Func.texted('bold', `Target is already VIP`), m)
            access[user].vip = true
            let vip = 0
            for (let jid in access) {
               if (access[jid].vip) vip++
            }
            client.reply(m.chat, `❏  *V I P*\n\n*“Successfully to put @${user.split`@`[0]} in the VIP list.”*\n\n*Total : ${vip}*`, m)
         } else if (command == 'delvip') {
            if (!access[user].vip) return client.reply(m.chat, Func.texted('bold', `Target is not VIP`), m)
            access[user].vip = false
            let vip = 0
            for (let jid in access) {
               if (access[jid].vip) vip++
            }
            client.reply(m.chat, `❏  *V I P*\n\n*“Now @${user.split`@`[0]} not included in the VIP List.”*\n\n*Total : ${vip}*`, m)
         }
      }
   },
   owner: true,
   cache: true,
   location: __filename
}