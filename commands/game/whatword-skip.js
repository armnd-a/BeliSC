exports.run = {
   usage: ['wordskip'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.whatword = client.whatword ? client.whatword : {}
      let id = m.chat
      if (!(id in client.whatword)) return
      delete client.whatword[id]
      client.reply(m.chat, Func.texted('bold', `Sesi permainan whatword telah dihapus.`), m)
   },
   group: true
}