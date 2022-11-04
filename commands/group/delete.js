exports.run = {
   usage: ['del', 'd', 'delete'],
   async: async (m, {
      client,
      isBotAdmin
   }) => {
      if (!m.quoted) return
      client.sendMessage(m.chat, {
         delete: {
            remoteJid: m.chat,
            fromMe: isBotAdmin ? false : true,
            id: m.quoted.id,
            participant: m.quoted.sender
         }
      }).then(() => client.reply(m.chat, 'Pesan gajelas berhasil dihapus 🚫', m))
   },
   error: false,
   premium: true,
   group: true
}