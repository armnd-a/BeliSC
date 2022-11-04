const {
   decode
} = require('html-entities')
exports.run = {
   usage: ['mf', 'mediafire'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://www.mediafire.com/file/1fqjqg7e8e2v3ao/YOWA.v8.87_By.SamMods.apk/file'), m)
         if (!args[0].match(/(https:\/\/www.mediafire.com\/file\/)/gi)) return client.reply(m.chat, global.status.invalid, m)
         client.reply(m.chat, global.status.getdata, m)
         let json = await Api.mediafire(args[0])
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let caption = `⬣━━━━⬡ Mediafire Downloader\n\n`
         caption += '	⬡ Name : ' + unescape(decode(json.data.filename)) + '\n'
         caption += '	⬡ Package : ' + json.data.mime + '\n'
         caption += '	⬡ Ukuran : ' + json.data.size + '\n'
         caption += '	⬡ Tipe : ' + json.data.extension + '\n\n'
         caption += `⬣━━━⬡\n\n`
         caption += global.db.setting.footer
         let chSize = Func.sizeLimit(json.data.size, global.max_upload)
         if (chSize.oversize) return client.reply(m.chat, `The file size (${json.data.size}) the size exceeds the limit, please download it by ur self via this link : ${await (await Func.shorten(json.data.link)).data.url}`, m)
         client.sendMessageModify(m.chat, caption, m, {
            title: 'Mediafire Downloader',
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/ddbf1504fe669a59638c9.jpg')
         }).then(() => {
            client.sendFile(m.chat, json.data.link, unescape(decode(json.data.filename)), '', m, {
               document: true
            })
         })
      } catch (e) {
         console.log(e)         
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   premium: true,
   cache: true,
   location: __filename
}