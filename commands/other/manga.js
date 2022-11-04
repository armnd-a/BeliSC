let fs = require('fs')
exports.run = {
   usage: ['manga', 'manganext'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.getdata, m)
      let _fun = JSON.parse(fs.readFileSync('./media/json/manga.json'))
      let loli = Func.random(_fun)
      client.sendButton(m.chat, loli, 'Jangan Dipake Ngocok', global.db.setting.footer, m, [{
               buttonId: `${isPrefix}manganext`,
               buttonText: {
                  displayText: 'NEXT'
               },
               type: 1
            }])
   },
   limit: true
}