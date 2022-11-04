let fs = require('fs')
exports.run = {
   usage: ['neko', 'nsfwNeko', 'nekonext'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.getdata, m)
      let _fun = JSON.parse(fs.readFileSync('./media/json/neko.json'))
      let loli = Func.random(_fun)
      client.sendButton(m.chat, loli, 'Jangan Dipake Ngocok', global.db.setting.footer, m, [{
               buttonId: `${isPrefix}nekonext`,
               buttonText: {
                  displayText: 'NEXT'
               },
               type: 1
            }])
   },
   limit: true
}