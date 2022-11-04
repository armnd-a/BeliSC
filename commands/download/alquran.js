exports.run = {
   usage: ['alquran', 'quran'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, '1:5'), m)
         let [ surat, ayat ] = text.split`:`
         if (isNaN(surat) || isNaN(ayat)) return client.reply(m.chat, Func.example(isPrefix, command, '1:5'), m)
         let json = await Func.fetchJson('https://quran.neoxr.my.id/surah/' + surat.trim() + '/' + ayat.trim())
         if (json.code != 200) return client.reply(m.chat, global.status.fail, m)
         let caption = `*A R T I - S U R A H*\n\n`
         caption += `${json.data.tafsir.id.long}\n\n`
         caption += global.db.setting.footer
         client.sendMessageModify(m.chat, caption, m, {
            title: 'A L - Q U R A N',
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/2f72132f095d995700e31.jpg')
         }).then(() => {
            client.sendFile(m.chat, json.data.audio.secondary[0], 'audio.mp3', '', m, {
            ptt: true
            })
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