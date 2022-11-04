exports.run = {
   usage: ['anime', 'animeget', 'astream', 'adown'],
   async: async (m, {
      client,
      args,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (command == 'anime') {
            if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'Digimon'), m)
            let json = await scrap.anime(text)
            if (!json.status) return client.reply(m.chat, global.status.fail, m)
            let rows = []
            json.data.map(v => rows.push({
               title: v.title,
               rowId: `${isPrefix}animeget ${v.url}`,
               description: `[ Upload : ${v.up} ]`
            }))
            client.sendList(m.chat, '', `pencarian untuk : ${text}\n\nNonton Anime online subtitle Indonesia terbaru hanya di melbot dengan kualitas terbaik anime sub Indo yang terupdate dan download terlengkap 🌐`, '', 'Lihat semua!', rows, m)
         } else if (command == 'animeget') {
            if (!args || !args[0]) return
            let json = await scrap.anime(args[0])
            if (!json.status) return client.reply(m.chat, global.status.fail, m)
            let caption = `⬣━━━━⬡ Anime search\n\n`
            caption += json.data.title + '\n\n'
            caption += '	⬡ Studio:  ' + json.data.studio + '\n'
            caption += '	⬡ Rating: ' + json.data.score + '\n'
            caption += '	⬡ Genre: ' + json.data.genre + '\n'
            caption += `⬣━━━⬡\n\n`                  
            caption += global.db.setting.footer
            client.sendMessageModify(m.chat, caption, m, {
            title: 'A N I M E - S E A R C H',
            largeThumb: true,
            thumbnail: await Func.fetchBuffer(json.data.thumbnail)
         }).then(async () => {
               let rows = [{
                  title: 'Download',
                  rowId: `${isPrefix}adown ${args[0]}`,
                  description: `list link download 📥`
               }, {
                  title: 'Streaming',
                  rowId: `${isPrefix}astream ${args[0]}`,
                  description: `list link streaming 🖥️`
               }]
               client.sendList(m.chat, '', `*Sinopsis* : “${json.data.sinopsis}”`, '', 'Download And Streaming', rows, m)
            })
         } else if (command == 'adown') {
            let json = await (await scrap.anime(args[0])).download
            if (json.length == 0) return client.reply(m.chat, global.status.fail, m)
            const content = json.map(v => `❏  *${v.provider.toUpperCase().split('').map(v => v).join(' ')}*\n\n${v.url.map(v => `◦ *${v.quality}* : ${v.url}`).join('\n')}`).join('\n\n')
            client.reply(m.chat, content, m)
         } else if (command == 'astream') {
            let json = await (await scrap.anime(args[0])).stream
            if (json.length == 0) return client.reply(m.chat, global.status.fail, m)
            const content = json.map(v => `❏  *${v.provider.toUpperCase().split('').map(v => v).join(' ')}*\n\n${v.url.map(v => `◦ *${v.quality}* : ${v.url}`).join('\n')}`).join('\n\n')
            client.reply(m.chat, content, m)
         }
      } catch (e) {
         console.log(e)
         client.reply(m.chat, global.status.error, m)
      }
   },
   error: false
}