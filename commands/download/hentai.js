let fs = require('fs')
exports.run = {
   usage: ['hentai'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.hentai, m)
      let _fun = JSON.parse(fs.readFileSync('./media/json/hentai.json'))
      let json = _fun[Math.floor(Math.random() * _fun.length)]
      let caption = `❏  *H E N T A I*\n\n`
         caption += `${json.title}\n\n`
         caption += global.db.setting.footer
      client.sendFile(m.chat, await Func.fetchBuffer(json.path), 'video.mp4', caption, m)
   },
   premium: true,
   limit: true
}
