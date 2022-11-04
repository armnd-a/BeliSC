let fs = require('fs')
exports.run = {
   usage: ['bokep'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.xxx, m)
      let _fun = JSON.parse(fs.readFileSync('./media/json/xxx.json'))
      let json = _fun[Math.floor(Math.random() * _fun.length)]
      let caption = `❏  *B O K E P*\n\n`
         caption += `${json.title}\n`
         caption += `🛡 Premium viral : 50k\n\n`
         caption += global.db.setting.footer
      client.sendFile(m.chat, await Func.fetchBuffer(json.path), 'video.mp4', caption, m)
   },
   premium: true,
   limit: true
}