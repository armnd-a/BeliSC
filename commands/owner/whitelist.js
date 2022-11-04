exports.run = {
   usage: ['mark', 'unmark'],
   async: async (m, {
      client,
      text,
      command,
      participants
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
         let userF = global.db.users
         if (typeof userF[user] == 'undefined') return client.reply(m.chat, Func.texted('bold', `Can't find user data.`), m)
         if (command == 'mark') {
            if (userF[user].whitelist) return client.reply(m.chat, Func.texted('bold', `Target already in white list.`), m)
            userF[user].whitelist = true
            let whitelist = 0
            for (let jid in userF) {
               if (userF[jid].whitelist) whitelist++
            }
            client.reply(m.chat, `❏  *W H I T E L I S T*\n\n*“Successfully to put @${user.split`@`[0]} in the white list.”*\n\n*Total : ${whitelist}*`, m)
         } else if (command == 'unmark') {
            if (!userF[user].whitelist) return client.reply(m.chat, Func.texted('bold', `Target not white list.`), m)
            userF[user].whitelist = false
            let whitelist = 0
            for (let jid in userF) {
               if (userF[jid].whitelist) whitelist++
            }
            client.reply(m.chat, `❏  *U N W H I T E L I S T*\n\n*“Now @${user.split`@`[0]} not included in the white list.”*\n\n*Total : ${whitelist}*`, m)
         }
      }
   },
   god: true,
   cache: true,
   location: __filename
}