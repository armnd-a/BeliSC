exports.run = {
   usage: ['fb'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://fb.watch/7B5KBCgdO3'), m)
         client.reply(m.chat, global.status.getdata, m)
         let json = await Func.facebook(args[0])
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         if (command == 'fb') {
            let result = json.data.find(v => v.quality == 'HD')
            if (result.response == 200) {
               client.sendVideo(m.chat, result.url, `◦  *Quality* : HD`, m)
            } else {
               let result = json.data.find(v => v.quality == 'SD')
               if (result.response != 200) return client.reply(m.chat, global.status.fail, m)
               client.sendVideo(m.chat, result.url, `◦  *Quality* : SD`, m)
            }
         }
      } catch {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   premium: true,
   cache: true,
   location: __filename
}