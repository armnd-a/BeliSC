exports.run = {
   usage: ['ss', 'ssweb', 'ssphone', 'sshp'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://screenshot.neoxr.my.id'), m)
         client.reply(m.chat, global.status.wait, m)
         if (command == 'ss' || command == 'ssweb') {
            let json = await Func.screenshot(args[0])
            if (!json.status) return client.reply(m.chat, global.status.error, m)
            let img = Buffer.from(json.data.image.split(',')[1], 'base64')
            client.sendImage(m.chat, img, '', m)
         } else if (command == 'ssphone' || command == 'sshp') {
            let json = await Func.screenshot(args[0], 2)
            if (!json.status) return client.reply(m.chat, global.status.error, m)
            let img = Buffer.from(json.data.image.split(',')[1], 'base64')
            client.sendImage(m.chat, img, '', m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   cache: true,
   location: __filename
}