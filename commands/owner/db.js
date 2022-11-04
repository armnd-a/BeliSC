exports.run = {
   usage: ['sql'],
   async: async (m, {
      client,
      args,
      isPrefix
   }) => {
      let day = 86400000 * 1,
         now = new Date() * 1
      let user = 0,
         chat = 0,
         limit = 0,
         group = 0
      if (args[0] == 'remove') {
         Object.entries(global.db.users).map(([v, x]) => {
            if (now - x.lastseen > day && !x.premium) {
               delete global.db.users[v]
               user += 1
            }
         })
         Object.entries(global.db.chats).map(([v, x]) => {
            if (now - x.lastseen > day && !x.premium) {
               delete global.db.chats[v]
               chat += 1
            }
         })
         Object.entries(global.db.groups).map(async ([v, x]) => {
            if (now - x.activity > day && !x.stay && x.expired == 0) {
               delete global.db.groups[v]
               await Func.delay(3000).then(async () => await client.groupLeave(v))
               group += 1
            }
         })
         client.reply(m.chat, Func.texted('bold', `Successfully deleted ${user} users and ${chat} chats.`), m)
      } else {
         Object.entries(global.db.users).map(([v, x]) => {
            if (now - x.lastseen > day && !x.premium) user += 1
         })
         Object.entries(global.db.chats).map(([v, x]) => {
            if (now - x.lastseen > day && !x.premium) chat += 1
         })
         Object.entries(global.db.users).map(([v, x]) => {
            if (/-/.test(x.limit)) limit += 1
         })
         Object.entries(global.db.groups).map(([v, x]) => {
            if (now - x.activity > day && !x.stay && x.expired == 0) group += 1
         })
         let text = `❏  *D B - S Q L*\n\n`
         text += `yang tidak aktif selama 1 hari\n\n`
         text += `${Func.texted('bold', user)} user\n`
         text += `${Func.texted('bold', chat)} chats\n`
         text += `${Func.texted('bold', group)} groups\n`
         text += `${Func.texted('bold', limit)} limit minus\n`
         text += `^kirim ${Func.texted('bold', `${isPrefix}sql remove`)} untuk reset data di atas`
         client.reply(m.chat, text, m)
      }
   },
   owner: true
}