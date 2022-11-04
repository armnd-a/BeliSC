let fs = require('fs')
exports.run = {
   usage: ['blowjob', 'blowjobnext'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, global.status.getdata, m)
      let _fun = JSON.parse(fs.readFileSync('./media/json/blowjob.json'))
      let loli = Func.random(_fun)
      client.sendButton(m.chat, loli, 'Jangan Dipake Ngocok', global.db.setting.footer, m, [{
               buttonId: `${isPrefix}blowjobnext`,
               buttonText: {
                  displayText: 'NEXT'
               },
               type: 1
            }])
   },
   limit: true
}