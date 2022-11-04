exports.run = {
   usage: ['afk'],
   async: async (m, {
      client,
      text
   }) => {
      try {
         let user = global.db.users[m.sender]
         user.afk = +new Date
         user.afkReason = text
         let tag = m.sender.split`@` [0]
         client.sendMessageModify(m.chat, `*@${tag} sekarang kamu afk!!*`, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/aafc4787439536642f4e3.jpg')
            })
      } catch {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   group: true
}