let fs = require('fs')
exports.run = {
   usage: ['bucin'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.vn, m)
      let _vn = JSON.parse(fs.readFileSync('./media/json/bucin.json'))
      let json = _vn[Math.floor(Math.random() * _vn.length)]
      client.sendFile(m.chat, await Func.fetchBuffer(json.path), 'audio.mp3', '', m, { ptt: true })
   },
   limit: 5
}