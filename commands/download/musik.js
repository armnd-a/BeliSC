exports.run = {
   usage: ['musik'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      isOwner
   }) => {
      try {
         if (!text) return client.reply(m.chat, `• ${Func.texted('bold', `Example`)} : ${isPrefix + command} lathi`, m)
         if (!isOwner && text.match(/(bugil|bokep|telanjang|masturbasi|sperma|hentai|sex|desah)/gi)) {
            client.updateBlockStatus(m.sender, 'block')
            let user = global.db.users
            user[m.sender].banned = true
            let banned = 0
            for (let jid in user) {
               if (user[jid].banned) banned++
            }
            return client.reply(m.chat, `❝${text}❞\n\nKata kunci tidak diperbolehkan, gunakan bot ini untuk hal-hal positif dan sekarang nomor Anda telah *di-banned* dan *di-blokir.*\n\nJika Anda ingin *unban* dan *unblok* membayar saya dengan uang Anda dengan harga 5K, ketik *${isPrefix}owner*`, m)
         }
         client.reply(m.chat, global.status.getdata, m)
         let json = await scrap.play(text)
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let caption = `❏  *P L A Y - M U S I C*\n\n`
         caption += `	›  *Title* : ${json.title}\n`
         caption += `	›  *Size* : ${json.data.size}\n`
         caption += `	›  *Duration* : ${json.duration}\n`
         caption += `	›  *Bitrate* : ${json.data.quality}\n\n`
         caption += global.db.setting.footer
         let chSize = Func.sizeLimit(json.data.size, global.max_upload)
         if (chSize.oversize) return client.reply(m.chat, `The file size (${json.data.size}) too large the size exceeds the limit, please download it by ur self via this link : ${await (await Func.shorten(json.data.url)).data.url}`, m)
         client.sendMessageModify(m.chat, caption, m, {
            title: '© Simple WhatsApp Bot',
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/cfb98e81cffb2d9b0aeee.jpg')
         }).then(() => {
            client.sendFile(m.chat, dl_link, decode(title) + '.mp3', '', m, {
               document: true
            })
         })
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: 5,
   cache: true,
   location: __filename
}
