exports.run = {
   usage: ['setlink', 'setpp', 'setmenu', 'setmsg', 'setheader', 'setfooter', 'setwm', 'setcover'],
   async: async (m, {
      client,
      args,
      text,
      isPrefix,
      command
   }) => {
      let setting = global.db.setting
      if (command == 'setmenu') {
         if (!args || !args[0]) {
            let rows = [{
               title: `Umum`,
               rowId: `${isPrefix + command} 1`,
               description: '© Simple WhatsApp bot'
            }, {
               title: `Fake Reply Story`,
               rowId: `${isPrefix + command} 2`,
               description: '© Simple WhatsApp bot'
            }, {
               title: `Menu Document`,
               rowId: `${isPrefix + command} 3`,
               description: '© Simple WhatsApp bot'
            }, {
               title: `Menu Location`,
               rowId: `${isPrefix + command} 4`,
               description: '© Simple WhatsApp bot'
            }, {
               title: `Menu GIF`,
               rowId: `${isPrefix + command} 5`,
               description: '© Simple WhatsApp bot'
            }, {
               title: `Menu Image`,
               rowId: `${isPrefix + command} 6`,
               description: '© Simple WhatsApp bot'
            }, {
               title: `Menu Video`,
               rowId: `${isPrefix + command} 7`,
               description: '© Simple WhatsApp bot'
            }, {
               title: `Menu List`,
               rowId: `${isPrefix + command} 8`,
               description: '© Simple WhatsApp bot'
            }]
            client.sendList(m.chat, '', `Silahkan pilih salah satu tampilan menu 😍`, '', 'Lihat semua!', rows, m)
         } else {
            let types = args[0] == 1 ? 'Umum' : args[0] == 2 ? 'Fake Reply Story' : args[0] == 3 ? 'Menu Document' : args[0] == 4 ? 'Menu Location' : args[0] == 5 ? 'Menu GIF' : args[0] == 6 ? 'Menu Image' : args[0] == 7 ? 'Menu Video' : args[0] == 8 ? 'Menu List' : 0
            client.reply(m.chat, `Tampilan menu berhasil jadi *${types}*`, m).then(() => setting.setmenu = parseInt(args[0]))
         }
      } else if (command == 'setpp') {
         if (!m.quoted) return client.reply(m.chat, Func.texted('bold', `Balas foto yang akan dijadikan foto profil bot.`), m)
         let mime = ((m.quoted ? m.quoted : m.msg).mimetype || '')
         if (/image\/(jpe?g|png)/.test(mime)) {
            client.reply(m.chat, global.status.wait, m)
            let media = await client.saveMediaMessage(m.quoted)
            await client.updateProfilePicture(client.user.id, {
               url: media
            })
            await Func.delay(3000).then(() => client.reply(m.chat, Func.texted('bold', `Foto profil berhasil diganti.`), m))
         }
      } else if (command == 'setlink') {
         if (!text) return client.reply(m.chat, `• ${Func.texted('bold', 'Contoh')} : ${isPrefix + command} https://chat.whatsapp.com/acuynocounter`, m)
         setting.link = text
         client.reply(m.chat, Func.texted('bold', `Group link successfully set.`), m)
      } else if (command == 'setmsg') {
         if (!text) return client.reply(m.chat, `• ${Func.texted('bold', 'Contoh')} : ${isPrefix + command} I'am a Just Simple WhatsApp Bot`, m)
         setting.msg = text
         client.reply(m.chat, Func.texted('bold', `Menu Message successfully set.`), m)
      } else if (command == 'setheader') {
         if (!text) return client.reply(m.chat, `• ${Func.texted('bold', 'Contoh')} : ${isPrefix + command} JUST FOR FUN`, m)
         setting.header = text
         client.reply(m.chat, Func.texted('bold', `Header Message successfully set.`), m)
      } else if (command == 'setfooter') {
         if (!text) return client.reply(m.chat, `• ${Func.texted('bold', 'Contoh')} : ${isPrefix + command} acuy gans`, m)
         setting.footer = text
         client.reply(m.chat, Func.texted('bold', `Footer Message successfully set.`), m)
      } else if (command == 'setwm') {
         if (!text) return client.reply(m.chat, `• ${Func.texted('bold', 'Contoh')} : ${isPrefix + command} Sticker by acuy`, m)
         let [packname, ...author] = text.split`|`
         author = (author || []).join`|`
         setting.sk_pack = packname || ''
         setting.sk_author = author || ''
         client.reply(m.chat, Func.texted('bold', `Sticker Watermark Berhasil diubah`), m)
      } else if (command == 'setcover') {
         try {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!/image/.test(mime)) return client.reply(m.chat, Func.texted('bold', `Gambar tidak ada`), m)
            client.reply(m.chat, global.status.wait, m)
            let img = await q.download()
            if (!img) return client.reply(m.chat, global.status.wrong, m)
            let link = await Func.uploadImage(img)
            setting.cover = link
            client.reply(m.chat, Func.texted('bold', `Berhasil mengubah cover`), m)
         } catch {
            return client.reply(m.chat, global.status.error, m)
         }
      }
   },
   owner: true,
   cache: true,
   location: __filename
}