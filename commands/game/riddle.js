let fs = require('fs')
exports.run = {
   usage: ['riddle'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Fitur game dinonaktifkan sementara oleh owner.`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Fitur game tidak diaktifkan di grup ini.`), m)
      client.riddle = client.riddle ? client.riddle : {}
      let id = m.chat,
         timeout = 120000,
         poin = 0
      if (id in client.riddle) return client.reply(m.chat, '*^ pertanyaan ini belum dijawab!*', client.riddle[id][0])
      let _riddle = JSON.parse(fs.readFileSync('./media/json/riddle.json'))
      let json = _riddle[Math.floor(Math.random() * _riddle.length)]
      let teks = `${json.pertanyaan}\n\n`
      teks += `Waktu : [ *${((timeout / 1000) / 60)} minutes* ]\n`
      teks += `Balas pesan ini untuk menjawab pertanyaan, kirim *${isPrefix}clue* untuk bantuan dan *${isPrefix}ridskip* untuk menghapus sesi.`
      client.riddle[id] = [
         await client.reply(m.chat, teks, m),
         json, poin,
         setTimeout(() => {
            if (client.riddle[id]) client.reply(m.chat, `*Waktunya habis!*\nJawabannya adalah : *${json.jawaban}*`, client.riddle[id][0])
            delete client.riddle[id]
         }, timeout)
      ]
   },
   group: true
}