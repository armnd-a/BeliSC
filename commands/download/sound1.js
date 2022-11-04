let fs = require('fs')
exports.run = {
   usage: ['sound1'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.getdata, m)
      let sound = await Func.fetchBuffer('https://raw.githubusercontent.com/Hyuura/Rest-Sound/main/HyuuraSoundMangkane/hyuura-Mangkane1.mp3')
      client.sendFile(m.chat, sound, 'audio.mp3', '', m, { ptt: true })
   },
   limit: true
}