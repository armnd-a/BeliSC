exports.run = {
   usage: ['point', 'saldo', 'uang'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      let user = global.db.users[m.sender]
      if (user.point == 0) return client.reply(m.chat, `Maaf @${m.sender.split`@`[0]}, uang kamu habis silahkan ketik .claim*`, m)
      client.reply(m.chat, Func.texted('bold', `Kamu mempunyai uang sebanyak ${Func.h2k(user.point)}`), m)
   },
   error: false
}