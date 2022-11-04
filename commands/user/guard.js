exports.run = {
   usage: ['guard'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      let user = global.db.users[m.sender]
      if (user.guard < 1) return client.reply(m.chat, `Kamu tidak mempunyai guard.`, m)
      client.reply(m.chat, Func.texted('bold', `Kamu mempunyai guard sebanyak ${Func.h2k(Func.formatNumber(user.guard))} (${Func.formatNumber(user.guard)}).`), m)
   },
   error: false
}