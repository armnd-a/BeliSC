let fs = require('fs')
exports.run = {
   usage: ['tebaktebakan'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Fitur game dinonaktifkan sementara oleh owner.`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Fitur game tidak diaktifkan di grup ini.`), m)
      client.tebaktebakan = client.tebaktebakan ? client.tebaktebakan : {}
      let id = m.chat,
         timeout = 120000,
         poin = 0
      if (id in client.tebaktebakan) return client.reply(m.chat, '*^ pertanyaan ini belum dijawab!!*', client.tebaktebakan[id][0])
      let _tebaktebakan = JSON.parse(fs.readFileSync('./media/json/tebaktebakan.json'))
      let json = _tebaktebakan[Math.floor(Math.random() * _tebaktebakan.length)]
      let teks = `${json.soal}\n\n`
      teks += `waktu : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Balas pesan ini untuk menjawab pertanyaan, ketik *${isPrefix}apatuh* untuk bantuan`
      client.tebaktebakan[id] = [
         await client.reply(m.chat, teks, m),
         json, poin,
         setTimeout(() => {
            if (client.tebaktebakan[id]) client.reply(m.chat, `*Waktunya habis!*\n\nJawabannya adalah : *${json.jawaban}*`, client.tebaktebakan[id][0])
            delete client.tebaktebakan[id]
         }, timeout)
      ]
   },
   group: true
}