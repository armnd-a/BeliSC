exports.run = {
   usage: ['whoskip'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.whoami = client.whoami ? client.whoami : {}
      let id = m.chat
      if (!(id in client.whoami)) return
      delete client.whoami[id]
      client.reply(m.chat, Func.texted('bold', `Sesi permainan Whoami telah dihapus.`), m)
   },
   group: true
}