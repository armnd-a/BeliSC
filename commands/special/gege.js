exports.run = {
   usage: ['gegemink'],
   async: async (m, {
      client
   }) => {
      client.reply(m.chat, Func.texted('bold', `Stay Halal Kawan 😭🙏`), m)
   },
   error: false
}