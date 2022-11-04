let fs = require('fs')
exports.run = {
   usage: ['whatword'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Fitur game dinonaktifkan sementara oleh pemiliknya.`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Fitur game tidak diaktifkan di grup ini.`), m)
      client.whatword = client.whatword ? client.whatword : {}
      let id = m.chat,
         timeout = 120000,
         poin = 0
      if (id in client.whatword) return client.reply(m.chat, '*^ pertanyaan ini belum dijawab!*', client.whatword[id][0])
      let _whatword = JSON.parse(fs.readFileSync('./media/json/whatword.json'))
      let json = _whatword[Math.floor(Math.random() * _whatword.length)]
      let teks = `${json.acak}\n\n`
      teks += `waktu : [ *${((timeout / 1000) / 60)} minutes* ]\n`
      teks += `Balas pesan ini untuk menjawab pertanyaan, ketik *${isPrefix}wordclue* untuk bantuan dan *${isPrefix}wordskip* untuk menghapus sesi.`
      client.whatword[id] = [
         await client.reply(m.chat, teks, m),
         json, poin,
         setTimeout(() => {
            if (client.whatword[id]) client.reply(m.chat, `*Waktunya habis!*\nJawabannya adalah : *${json.jawaban}*`, client.whatword[id][0])
            delete client.whatword[id]
         }, timeout)
      ]
   },
   group: true,
   limit: 2
}