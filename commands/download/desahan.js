let fs = require('fs')
exports.run = {
   usage: ['desahancewek'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.ds, m)
      let _vn = JSON.parse(fs.readFileSync('./media/json/desahan.json'))
      let json = _vn[Math.floor(Math.random() * _vn.length)]
      client.sendFile(m.chat, await Func.fetchBuffer(json.path), '', '', m, {
         ptt: true
      })
   },
   vip: true
}