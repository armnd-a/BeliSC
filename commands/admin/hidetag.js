exports.run = {
   usage: ['hidetag'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      participants
   }) => {
      if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'kontol'), m)
      let users = participants.map(u => u.id)
      client.reply(m.chat, text, null, {
         contextInfo: {
            mentionedJid: users
         }
      })
   },
   admin: true,
   group: true
}