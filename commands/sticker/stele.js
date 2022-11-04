exports.run = {
   usage: ['ts', 'telestik', 'telesticker'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         let exif = global.db.setting
         if (!args || !args[0]) return client.reply(m.chat, `• ${Func.texted('bold', `Example`)} : ${isPrefix + command} https://t.me/addstickers/NonromanticBear`, m)
         client.reply(m.chat, global.status.getdata, m)
         let json = await Func.telesticker(args[0])
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         for (let i = 0; i < json.data.length; i++) {
            client.sendSticker(m.chat, await Func.fetchBuffer(json.data[i].url), m, {
               pack: exif.sk_pack,
               author: exif.sk_author
            })
            await Func.delay(2000)
         }
         await client.reply(m.chat, Func.texted('bold', `Done, all stickers have been sent.`), m)
      } catch (e) {
         console.log(e)
         client.reply(m.chat, require('util').format(e), m)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true,
   private: true,
   cache: true,
   location: __filename
}