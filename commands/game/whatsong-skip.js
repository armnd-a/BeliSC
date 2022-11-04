exports.run = {
   usage: ['songskip'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.whatsong = client.whatsong ? client.whatsong : {}
      let id = m.chat
      if (!(id in client.whatsong)) return
      delete client.whatsong[id]
      client.reply(m.chat, Func.texted('bold', `Sesi permainan whatsong telah dihapus.`), m)
   },
   group: true
}