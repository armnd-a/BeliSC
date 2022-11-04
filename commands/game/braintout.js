let fs = require('fs')
exports.run = {
   usage: ['brainout'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Fitur game dinonaktifkan sementara oleh owner.`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Fitur game tidak diaktifkan di grup ini.`), m)
      client.brainout = client.brainout ? client.brainout : {}
      let id = m.chat,
         timeout = 120000,
         poin = 0
      if (id in client.brainout) return client.reply(m.chat, '*^ pertanyaan ini belum dijawab!!*', client.brainout[id][0])
      let _brainout = JSON.parse(fs.readFileSync('./media/json/brainout.json'))
      let json = _brainout[Math.floor(Math.random() * _brainout.length)]
      let teks = `${json.pertanyaan}\n\n`
      teks += `waktu : [ *${((timeout / 1000) / 60)} minutes* ]\n`
      teks += `Balas pesan ini untuk menjawab pertanyaan, ketik *${isPrefix}brainwhat* untuk bantuan dan *${isPrefix}brainskip* untuk menghapus sesi.`
      client.brainout[id] = [
         await client.reply(m.chat, teks, m),
         json, poin,
         setTimeout(() => {
            if (client.brainout[id]) client.reply(m.chat, `*Time's up!*\nThe answer is : *${json.jawaban}*`, client.brainout[id][0])
            delete client.brainout[id]
         }, timeout)
      ]
   },
   group: true
}