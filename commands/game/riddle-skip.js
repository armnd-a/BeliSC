exports.run = {
   usage: ['ridskip'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.riddle = client.riddle ? client.riddle : {}
      let id = m.chat
      if (!(id in client.riddle)) return
      delete client.riddle[id]
      client.reply(m.chat, Func.texted('bold', `Sesi permainan teka-teki telah dihapus.`), m)
   },
   group: true
}