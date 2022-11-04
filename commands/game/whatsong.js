let fs = require('fs')
exports.run = {
   usage: ['whatsong'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Fitur game untuk sementara dinonaktifkan oleh owner.`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Fitur game tidak diaktifkan di grup ini.`), m)
      client.whatsong = client.whatsong ? client.whatsong : {}
      let id = m.chat,
         timeout = 120000,
         poin = 0
      if (id in client.whatsong) return client.reply(m.chat, '*^ pertanyaan ini belum dijawab!*', client.whatsong[id][0])
      let _whatsong = JSON.parse(fs.readFileSync('./media/json/whatsong.json'))
      let json = _whatsong[Math.floor(Math.random() * _whatsong.length)]
      let teks = `Apa judul lagu ini ?\n\n`
      teks += `waktu : [ *${((timeout / 1000) / 60)} minutes* ]\n`
      teks += `Balas pesan ini untuk menjawab pertanyaan, ketik *${isPrefix}songclue* untuk bantuan dan *${isPrefix}songskip* untuk menghapus sesi.`
      client.whatsong[id] = [
         await client.reply(m.chat, teks, m),
         json, poin,
         await client.sendFile(m.chat, fs.readFileSync(json.path), '', '', m, { ptt: true }),
         setTimeout(() => {
            if (client.whatsong[id]) client.reply(m.chat, `*Waktunya habis!*`, client.whatsong[id][0])
            delete client.whatsong[id]
         }, timeout)
      ]
   },
   group: true,
   limit: 15
}