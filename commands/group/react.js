exports.run = {
   usage: ['react'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, '🤨'), m)
         if (!m.quoted) return client.reply(m.chat, Func.texted('bold', `Balas pesan yang akan memberikan reaksi.`), m)
         await client.sendReact(m.chat, args[0], m.quoted.fakeObj.key)
      } catch (e) {
         console.log(e)
         client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   group: true
}