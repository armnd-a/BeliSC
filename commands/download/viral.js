let fs = require('fs')
exports.run = {
   usage: ['viral'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.hentai, m)
      let _fun = JSON.parse(fs.readFileSync('./media/json/viral.json'))
      let json = _fun[Math.floor(Math.random() * _fun.length)]
      let caption = `❏  *RANDOM - VIRAL*\n\n`
         caption += `${json.title}\n\n`
         caption += global.db.setting.footer
      client.sendFile(m.chat, await Func.fetchBuffer(json.path), 'video.mp4', caption, m)
   },
   premium: true,
   limit: true
}
