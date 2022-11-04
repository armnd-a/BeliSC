exports.run = {
   usage: ['yt', 'yta', 'ytv', 'ytaaa', 'ytvvv', 'ytmp3', 'ytmp4', 'ytta'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, `• ${Func.texted('bold', `Example`)} : ${isPrefix + command} https://youtu.be/zaRFmdtLhQ8`, m)
         client.reply(m.chat, global.status.getdata, m)
         if (/yta|ytaaa|ytmp3/.test(command)) {
            var json = await scrap.youtube(args[0], 'audio')
            if (!json.data.url) {
               for (let i = 2; i < 5; ++i) {
                  var json = await scrap.youtube(args[0], 'audio')
                  await Func.delay(1500)
                  if (json.data.url) {
                     break
                  }
               }
            }
            if (!json.data.url) return client.reply(m.chat, global.status.fail, m)
            let caption = `${Func.h2k(json.views)} Views, File ${json.data.size}. Music from ${json.channel}: "${json.title}".\n\n`
            caption += `${json.publish}`
            let chSize = Func.sizeLimit(json.data.size, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `The file size (${json.data.size}) too large the size exceeds the limit, please download it by ur self via this link : ${await (await Func.shorten(json.data.url)).data.url}`, m)
            client.sendMessageModify(m.chat, caption, m, {
               title: 'Music Downloader',
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(json.thumbnail)
            }).then(() => {
               client.sendFile(m.chat, json.data.url, json.data.filename + '.mp3', '', m, {
                  document: true
               })
            })
         } else if (/ytv|ytvvv|ytmp4|ytta/.test(command)) {
            var json = await scrap.youtube(args[0], 'video')
            if (!json.data.url) {
               for (let i = 2; i < 5; ++i) {
                  var json = await scrap.youtube(args[0], 'video')
                  await Func.delay(1500)
                  if (json.data.url) {
                     break
                  }
               }
            }
            if (!json.data.url) return client.reply(m.chat, global.status.fail, m)
            let caption = `${Func.h2k(json.views)} Views, File ${json.data.size}. Video from ${json.channel}: "${json.title}".\n\n`
            caption += `${json.publish}`
            let chSize = Func.sizeLimit(json.data.size, global.max_upload)
            if (chSize.oversize) return client.reply(m.chat, `The file size (${json.data.size}) too large the size exceeds the limit, please download it by ur self via this link : ${await (await Func.shorten(json.data.url)).data.url}`, m)            
            client.sendFile(m.chat, await Func.fetchBuffer(json.data.url), 'video.mp4', caption, m)
         } else if (command == 'yt') {
            let json = await scrap.youtube(args[0], 'combine')
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            let mp3 = json.data.find(v => v.extension == 'mp3')
            let mp4 = json.data.find(v => v.extension == 'mp4')
            let buttons = [{
               buttonId: `${isPrefix}yta ${args[0]}`,
               buttonText: {
                 displayText: 'Audio'
               },
              type: 1
              }, {
                 buttonId: `${isPrefix}ytv ${args[0]}`,
                 buttonText: {
                   displayText: 'Video'
               },
              type: 1
            }]
            let caption = `⬣━━━━⬡ YouTube Downloader\n\n`
            caption += json.title + '\n\n'
            caption += '	⬡ Akun: : ' + json.channel + '\n'
            caption += '	⬡ Durasi : ' + json.duration + '\n'
            caption += '	⬡ Views: : ' + json.views + '\n'
            caption += '	⬡ Upload : ' + json.publish + '\n\n'
            caption += `⬣━━━⬡\n\n`                  
            client.sendButton(m.chat, json.thumbnail, caption, 'Simple WhatsApp Bot', m, buttons, {
                    document: true
            }, {
                title: 'ılılılllıılılıllllıılılllıllı\n01:43 ━●── 03:50 ⇆ ◁ㅤ ❚❚ ㅤ▷ ↻',
                thumbnail: await Func.fetchBuffer(json.thumbnail),
                fileName: 'WhatsApp Bot'
            })
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