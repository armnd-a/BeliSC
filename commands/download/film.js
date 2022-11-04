exports.run = {
   usage: ['film', 'filmget', 'filmdown'],
   async: async (m, {
      client,
      args,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (command == 'film') {
            if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'kkn di desa penari'), m)
            let json = await scrap.film(text)
            if (!json.status) return client.reply(m.chat, global.status.fail, m)
            let rows = []
            json.data.map(v => rows.push({
               title: v.title,
               rowId: `${isPrefix}filmget ${v.url}`,
               description: `[ Rating : ★ ${v.rating} | Duration : ${v.duration} | Quality : ${v.quality} | Genre : ${v.genre.map(v => v).join(', ')} ]`
            }))
            client.sendList(m.chat, '', `pencarian untuk : ${text}, layanan streaming dan juga download film layar lebar dari berbagai genre 🔥`, '', 'Tap!', rows, m)
         } else if (command == 'filmget') {
            if (!args || !args[0]) return
            let json = await scrap.film(args[0])
            if (!json.status) return client.reply(m.chat, global.status.fail, m)
            let caption = `⬣━━━━⬡ Film search\n\n`
            caption += json.data.title + '\n\n'
            caption += json.moviedata.map(v => `	⬡  *${Object.keys(v)}* : ${Object.values(v)}`).join('\n') + '\n\n'
            caption += `⬣━━━⬡\n\n`                  
            caption += global.db.setting.footer
            client.sendMessageModify(m.chat, caption, m, {
            title: 'F I L M - S E A R C H',
            largeThumb: true,
            thumbnail: await Func.fetchBuffer(json.data.thumbnail)
         }).then(async () => {
               let rows = [{
                  title: 'Download',
                  rowId: `${isPrefix}filmdown ${args[0]}`,
                  description: ``
               }, {
                  title: 'Trailer',
                  rowId: `${isPrefix}ytmp4 ${json.data.trailer}`,
                  description: ``
               }]
               client.sendList(m.chat, '', `*Sinopsis* : “${json.data.sinopsis}”`, '', 'Tap!', rows, m)
            })
         } else if (command == 'filmdown') {
            let json = await (await scrap.film(args[0])).download
            if (json.length == 0) return client.reply(m.chat, global.status.fail, m)
            const content = json.map(v => `◦ *${v.provider}* : ${v.url}`).join('\n')
            client.reply(m.chat, content, m)
         }
      } catch (e) {
         console.log(e)
         client.reply(m.chat, global.status.error, m)
      }
   },
   error: false
}