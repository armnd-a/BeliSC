exports.run = {
   usage: ['podcast'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy9jYjQ0OGM0L3BvZGNhc3QvcnNz/episode/MjhjODNkYzUtMGVhNi00MWEwLTk0YWMtYzhmZjBkOWNkYTM1?sa=X&ved=0CAUQkfYCahcKEwj4pdqlhYT5AhUAAAAAHQAAAAAQLA'), m)
         if (!args[0].match(/^(?:https?:\/\/)?(?:podcasts\.)?(?:google\.com\/)(?:feed\/)(?:\S+)?$/)) return client.reply(m.chat, global.status.invalid, m)
         client.reply(m.chat, global.status.getdata, m)
         let json = await Api.podcast(args[0])
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let caption = `⬣━━━━⬡ *P O D C A S T*\n\n`
         caption += json.data.title + '\n\n'
         caption += '	⬡ Akun: ' + json.data.author + '\n'
         caption += '	⬡ Durasi: ' + json.data.duration + '\n'
         caption += `⬣━━━⬡\n\n`   
         caption += global.db.setting.footer
         client.sendMessageModify(m.chat, caption, m, {
            title: 'P O D C A S T - D O W N L O A D E R',
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/eed080eb5089471c9400c.jpg')
         }).then(() => {
            client.sendFile(m.chat, json.data.audio, json.data.title + '.mp3', '', m, {
               document: true
            })
         })
      } catch {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true,
   cache: true,
   location: __filename
}