exports.run = {
   usage: ['asupan'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      isOwner
   }) => {
      try {
         if (command == 'asupan') {
            let q = args[0] ? args[0] : Func.random(['gabatha', 'kobokaneru']) // hashtag
            client.reply(m.chat, global.status.getdata, m)
            let json = await Func.asupan(q)
            if (!json.status) return client.reply(m.chat, Func.texted('bold', `Video tidak ditemukan, silahkan coba lagi.`), m)
            let caption = `⬣━━━━⬡ Asupan Downloader\n\n`
            caption += json.caption + '\n\n'
            caption += '	⬡ Akun: : ' + json.author + '\n'
            caption += `⬣━━━⬡\n\n`                  
            caption += global.db.setting.footer
            client.sendFile(m.chat, json.data.video, 'video.mp4', caption, m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   premium: true,
   cache: true,
   location: __filename
}