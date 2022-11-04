let fs = require('fs')
exports.run = {
   usage: ['meme'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.getdata, m)
      let _hai = JSON.parse(fs.readFileSync('./media/json/meme.json'))
      let meme = Func.random(_hai)
      client.sendFile(m.chat, meme, 'image.jpg', '', m)
   },
   limit: true
}