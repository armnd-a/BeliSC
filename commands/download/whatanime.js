exports.run = {
   usage: ['whatanime'],
   async: async (m, {
      client,
      command
   }) => {
      try {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await client.downloadMediaMessage(q)
            if (!/image/.test(type)) return client.reply(m.chat, Func.texted('bold', `reply foto dengan perintah .whatanime`), m)
            let old = new Date()
            client.reply(m.chat, global.status.wait, m)
            let image = await Func.uploadImage(img)
            let json = await scrap.whatanime(image)
            if (!json.status) return client.reply(m.chat, global.status.fail, m)
            let caption = `❏  *W H A T A N I M E*\n\n`
            caption += '	›  *Judul* : ' + json.data.filename.replace(/[.]mp4/gi,'') + '\n'
            caption += '	›  *Episode* : ' + (json.data.episode ||  1) + '\n'
            caption += '	›  *Dari* : ' + json.data.from + '\n'
            caption += '	›  *To* : ' + json.data.to + '\n'
            caption += '	›  *Similarity* : ' + json.data.similarity + '\n'
            caption += '	›  *Fetching* : ' + ((new Date - old) * 1) + 's\n\n'
            caption += global.db.setting.footer
            client.sendFile(m.chat, json.data.image, 'image.jpg', caption, m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `reply foto dengan perintah .whatanime`), m)
            let img = await q.download()
            if (!img) return client.reply(m.chat, Func.texted('bold', `🚩 Berikan caption atau reply foto dengan perintah .whatanime`), m)
            let old = new Date()
            client.reply(m.chat, global.status.wait, m)
            let image = await Func.uploadImage(img)
            let json = await scrap.whatanime(image)
            let caption = `❏  *W H A T A N I M E*\n\n`
            caption += '	›  *Judul* : ' + json.data.filename.replace(/[.]mp4/gi,'') + '\n'
            caption += '	›  *Episode* : ' + (json.data.episode || 1) + '\n'
            caption += '	›  *Dari* : ' + json.data.from + '\n'
            caption += '	›  *To* : ' + json.data.to + '\n'
            caption += '	›  *Similarity* : ' + json.data.similarity + '\n'
            caption += '	›  *Fetching* : ' + ((new Date - old) * 1) + 's\n\n'
            caption += global.db.setting.footer
            client.sendFile(m.chat, json.data.image, 'image.jpg', caption, m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false
}