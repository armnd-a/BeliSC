exports.run = {
   usage: ['soundcloud', 'scdl'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (!text) return client.reply(m.chat, `${Func.texted('bold', `Example`)} :\n\n${isPrefix + command} antara ada dan tiada\n${isPrefix + command} https://soundcloud.com/imran-agussalim/nadia-zerlinda-dear-diary-1`, m)
         client.reply(m.chat, global.status.getdata, m)
         const json = await Api.soundcloud(text)
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         if (text.match('soundcloud.com')) return client.sendFile(m.chat, json.data.url, json.data.title + '.mp3', '', m, {
            document: true
         })
         if (json.data.length == 0) return client.reply(m.chat, global.status.fail, m)
         let rows = []
         json.data.map(v => rows.push({
            title: v.artist + ' – ' + v.title,
            rowId: `${isPrefix + command} ${v.url}`,
            description: `Duration : ${v.duration} – Genre : ${v.genre} – Plays : ${v.plays}x`
         }))
         client.sendList(m.chat, '', `${text} Berhasil ditemukan\n\npilih di bawah ini sesuai dengan judul yang Anda inginkan`, '', 'Lihat', rows, m)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   cache: true,
   quota: true,
   location: __filename
}