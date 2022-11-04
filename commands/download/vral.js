let fs = require('fs')
exports.run = {
   usage: ['trending'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.getdata, m)
      let _fun = JSON.parse(fs.readFileSync('./media/json/viraltiktok.json'))
      let json = _fun[Math.floor(Math.random() * _fun.length)]
      let caption = `⬣━━━━⬡ Trending random\n\n`
         caption += `${json.title}\n\n`
         caption += `⬣━━━⬡\n\n`
         caption += global.db.setting.footer
      client.sendFile(m.chat, await Func.fetchBuffer(json.path), 'video.mp4', caption, m)
   },
   premium: true,
   limit: true
}