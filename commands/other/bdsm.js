let fs = require('fs')
exports.run = {
   usage: ['bdsm', 'bdsmnext'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.getdata, m)
      let _fun = JSON.parse(fs.readFileSync('./media/json/bdsm.json'))
      let loli = Func.random(_fun)
      client.sendButton(m.chat, loli, 'Jangan Dipake Ngocok', global.db.setting.footer, m, [{
               buttonId: `${isPrefix}bdsmnext`,
               buttonText: {
                  displayText: 'NEXT'
               },
               type: 1
            }])
   },
   limit: true
}