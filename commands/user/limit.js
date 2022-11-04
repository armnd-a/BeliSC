exports.run = {
   usage: ['limit'],
   async: async (m, {
      client,
      isPrefix,
      isOwner,
      isPrem
   }) => {
      let user = global.users[m.sender]
      if (isOwner || isPrem) return client.reply(m.chat, Func.texted('bold', `Kamu user premium limit kamu unlimited`), m)
      if (user.limit == 0) return client.reply(m.chat, `Maaf @${m.sender.split`@`[0]}, limit kamu habis silahkan untuk membeli limit`, m)
      client.reply(m.chat, Func.texted('bold', `Kamu mempunyai limit sebanyak ${Func.formatNumber(user.limit)} limit*\n\n*Upgrade premium untuk mendapatkan unlimited limit`), m)
   },
   error: false
}