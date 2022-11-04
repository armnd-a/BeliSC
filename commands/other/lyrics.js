let lyricsParse = require('lyrics-parse')
let {
   decode
} = require('html-entities')
exports.run = {
   usage: ['lirik'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'hal terindah'), m)
         client.reply(m.chat, global.status.getdata, m)
         let lyrics = await lyricsParse(text, '')        
         lyrics ? client.sendMessageModify(m.chat, unescape(decode(lyrics)), m, {
            title: 'L I R I K - S E A R C H',
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/208637eeaef5939faa8b3.jpg')
            })          : client.reply(m.chat, global.status.fail, m)
      } catch {
         client.reply(m.chat, global.status.error, m)
      }
   },
   error: false
}