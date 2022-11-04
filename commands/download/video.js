exports.run = {
   usage: ['video', 'ytvid'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      isOwner
   }) => {
      try {
         if (!text) return client.reply(m.chat, `• ${Func.texted('bold', `Example`)} : ${isPrefix + command} lathi`, m)
         if (!isOwner && text.match(/(xnxx|porn|ngentot|pussy|bugil|memek|hentai|sex|desah)/gi)) {
            client.updateBlockStatus(m.sender, 'block')
            let user = global.db.users
            user[m.sender].banned = true
            let banned = 0
            for (let jid in user) {
               if (user[jid].banned) banned++
            }
            return client.reply(m.chat, `“${text}”\n\n😳 Kamu terdeteksi menyalahi *Syarat & Ketentuan pengguna* untuk itu sistem membanned dan memblokir nomormu, jika ingin dibuka blokiran & banned dikenai biaya sebesar Rp. 10,000, kirim *${isPrefix}owner*`, m)
         }
         client.reply(m.chat, global.status.getdata, m)
         var json = await scrap.play(text, 'video')
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let caption = `${json.views} Views, File ${json.data.size}. Video from ${json.channel}: "${json.title}".\n\n`
         caption += `${json.publish}`
         let chSize = Func.sizeLimit(json.data.size, global.max_upload)
         if (chSize.oversize) return client.reply(m.chat, `The file size (${json.data.size}) too large the size exceeds the limit, please download it by ur self via this link : ${await (await Func.shorten(json.data.url)).data.url}`, m)
         let isSize = (json.data.size).replace(/MB/g, '').trim()
         if (isSize > 99) return client.sendMessageModify(m.chat, caption, m, {
            title: 'Search Video Downloader',
            largeThumb: true,
            thumbnail: await Func.fetchBuffer(json.thumbnail)
         }).then(async () => await client.sendFile(m.chat, json.data.url, json.data.filename + '.mp4', '', m, {
            document: true
         }))
         client.sendFile(m.chat, json.data.url, json.data.filename('mp4'), caption, m)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true,
   premium: true,
   cache: true,
   location: __filename
}