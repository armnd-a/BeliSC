exports.run = {
   usage: ['sholat', 'solat'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'bandung'), m)
         let json = await Api.sholat(text)
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         let teks = '❏  *S H O L A T*\n\n'
         teks += `Menampilkan jadwal sholat untuk wilayah *${Func.ucword(json.city)}* per tanggal *${json.date}*\n\n`
         teks += '	⬡  ```Imsak  :``` ' + json.data.imsak + '\n'
         teks += '	⬡  ```Subuh  :``` ' + json.data.subuh + '\n'
         teks += '	⬡  ```Dhuha  :``` ' + json.data.dhuha + '\n'
         teks += '	⬡  ```Dzuhur :``` ' + json.data.dzuhur + '\n'
         teks += '	⬡  ```Ashar  :``` ' + json.data.ashar + '\n'
         teks += '	⬡  ```Magrib :``` ' + json.data.magrib + '\n'
         teks += '	⬡  ```Isya   :``` ' + json.data.isya + '\n\n'
         teks += global.db.setting.footer
         client.sendMessageModify(m.chat, teks, m, {
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/e497caecf6dc8c66fc1a9.jpg'),
            largeThumb: true
         })
      } catch {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false
}