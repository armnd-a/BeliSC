let fs = require('fs')
exports.run = {
   usage: ['tebaklirik'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Fitur game dinonaktifkan sementara oleh owner.`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Fitur game tidak diaktifkan di grup ini.`), m)
      client.tebaklirik = client.tebaklirik ? client.tebaklirik : {}
      let id = m.chat,
         timeout = 120000,
         poin = 0
      if (id in client.tebaklirik) return client.reply(m.chat, '*^ pertanyaan ini belum dijawab!!*', client.tebaklirik[id][0])
      let _tebaklirik = JSON.parse(fs.readFileSync('./media/json/tebaklirik.json'))
      let json = _tebaklirik[Math.floor(Math.random() * _tebaklirik.length)]
      let teks = `${json.soal}\n\n`
      teks += `waktu : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Balas pesan ini untuk menjawab pertanyaan, ketik *${isPrefix}kasihclue* untuk bantuan`
      client.tebaklirik[id] = [
         await client.reply(m.chat, teks, m),
         json, poin,
         setTimeout(() => {
            if (client.tebaklirik[id]) client.reply(m.chat, `*Waktunya habis!*\n\nJawabannya adalah : *${json.jawaban}*`, client.tebaklirik[id][0])
            delete client.tebaklirik[id]
         }, timeout)
      ]
   },
   group: true,
   limit: 5
}