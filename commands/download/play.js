exports.run = {
   usage: ['play', 'lagu', 'sad'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      isPrem,
      isOwner
   }) => {
      try {
         if (!text) return client.reply(m.chat, `${Func.texted('bold', `Contoh`)} : ${isPrefix + command} ayah`, m)
         if (!isOwner && text.match(/(bugil|bokep|hentai|sex|desah)/gi)) {
            client.updateBlockStatus(m.sender, 'block')
            let user = global.db.users
            user[m.sender].banned = true
            let banned = 0
            for (let jid in user) {
               if (user[jid].banned) banned++
            }
            return client.reply(m.chat, `${text}\n\nKata kunci tidak diperbolehkan, gunakan bot ini untuk hal-hal positif dan sekarang nomor Anda telah *banned* and *blocked.*\n\nJika Anda ingin *unban* and *unblock* bayar saya dengan uang Anda dengan harga 5K, kirim *${isPrefix}owner*`, m)
         }
         client.reply(m.chat, global.status.getdata, m)
         let json = await scrap.play(text)
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let link = 'https://youtu.be/' + json.videoId
         let premSize = Func.sizeLimit(json.data.size, 30)
         if (premSize.oversize && !isPrem) return client.reply(m.chat, `User free hanya bisa mendownload di bawah 30 MB, silahkan download sendiri melalui link berikut : ${await (await Func.shorten(json.data.url)).data.url}`, m)
         let chSize = Func.sizeLimit(json.data.size, global.max_upload)
         if (chSize.oversize) return client.reply(m.chat, `Ukuran file (${json.data.size}) melebihi batas maksimum, silahkan download sendiri melalui link berikut : ${await (await Func.shorten(json.data.url)).data.url}`, m)
         let buttons = [{
               buttonId: `${isPrefix}ytaaa ${link}`,
               buttonText: {
                 displayText: 'Audio'
               },
              type: 1
              }, {
                 buttonId: `${isPrefix}ytvvv ${link}`,
                 buttonText: {
                   displayText: 'Video'
               },
              type: 1
            }]
            let caption = `${json.views} Views, File ${json.data.size}. Music from ${json.channel}: "${json.title}".\n\n`
            caption += `Upload : ${json.publish}`              
            client.sendButton(m.chat, json.thumbnail, caption, 'Simple WhatsApp Bot', m, buttons, {
                    document: true
            }, {
                title: 'ılılılllıılılıllllıılılllıllı\n01:43 ━●── 03:50 ⇆ ◁ㅤ ❚❚ ㅤ▷ ↻',
                thumbnail: await Func.fetchBuffer(json.thumbnail),
                fileName: 'WhatsApp Bot'
            })
      } catch (e) {
         console.log(e)         
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   cache: true,
   location: __filename
}
