exports.run = {
   usage: ['tourl'],
   async: async (m, {
      client
   }) => {
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, 'Hanya untuk foto!', m)
      let img = await q.download()
      if (!img) return client.reply(m.chat, global.status.wrong, m)
      let json = await Func.uploadImage(img)
      client.reply(m.chat, json, m)
   },
   error: false
}