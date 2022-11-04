exports.run = {
   usage: ['tovideo', 'tovid', 'tomp4'],
   async: async (m, {
      client,
      isPrefix,
      command
   }) => {
      if (!m.quoted) return client.reply(m.chat, Func.texted('bold', `Only for Sticker!`), m)
      if (m.quoted.mimetype != 'image/webp') return client.reply(m.chat, Func.texted('bold', `Reply gif sticker you want to convert with this command.`), m)
      client.reply(m.chat, global.status.wait, m)
      let media = await m.quoted.download()
      let json = await Func.toMP4(media)
      client.sendVideo(m.chat, json.url, '', m)
   },
   error: false,
   limit: 10,
   cache: true,
   location: __filename
}