exports.run = {
   usage: ['ig'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://www.instagram.com/p/CK0tLXyAzEI'), m)
         if (!args[0].match(/(https:\/\/www.instagram.com)/gi)) return client.reply(m.chat, global.status.invalid, m)
         client.reply(m.chat, global.status.getdata, m)
         let json = await Api.ig(Func.igFixed(args[0]))
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         json.data.map(async v => {
            client.sendFile(m.chat, v.url, '', '', m)
            await Func.delay(1500)
         })
      } catch {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: 20,
   cache: true,
   location: __filename
}