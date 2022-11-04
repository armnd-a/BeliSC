let fs = require('fs')
exports.run = {
   usage: ['ometv'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.hentai, m)
      let _fun = JSON.parse(fs.readFileSync('./media/json/ometv.json'))
      let json = _fun[Math.floor(Math.random() * _fun.length)]
      let caption = `❏  *OME - TV*\n\n`
         caption += `${json.title}\n\n`
         caption += `💻 ome tv full video tanpa download langsung lihat\n\ntotal video 1300 video 50k saja\n\nOrder?\nhttps://wa.me/84888725073?text=order+ometv+50k+full+video+dong`         
      client.sendFile(m.chat, await Func.fetchBuffer(json.path), 'video.mp4', caption, m)
   },
   limit: 50
}