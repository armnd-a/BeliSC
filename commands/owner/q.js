exports.run = {
   usage: ['q'],
   async: async (m, {
      client
   }) => {
      try {
         if (!m.quoted) return client.reply(m.chat, Func.texted('bold', `Balas pesan nya!`), m)
         const msg = await store.loadMessage(m.chat, m.quoted.id)
         if (msg.quoted === null) return client.reply(m.chat, Func.texted('bold', `Tidak ada reply`), m)
         return client.copyNForward(m.chat, msg.quoted.fakeObj)
      } catch (e) {
         client.reply(m.chat, Func.texted('bold', `Tidak dapat memuat pesan`), m)
      }
   },
   error: false,
   cache: true,
   location: __filename
}