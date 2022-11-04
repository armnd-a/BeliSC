let fs = require('fs')
exports.run = {
   usage: ['whoami'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Fitur game dinonaktifkan sementara oleh owner.`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Fitur game tidak diaktifkan di grup ini.`), m)
      client.whoami = client.whoami ? client.whoami : {}
      let id = m.chat,
         timeout = 120000,
         poin = 0
      if (id in client.whoami) return client.reply(m.chat, '*^ pertanyaan ini belum dijawab!*', client.whoami[id][0])
      let _whoami = JSON.parse(fs.readFileSync('./media/json/whoami.json'))
      let json = _whoami[Math.floor(Math.random() * _whoami.length)]
      let teks = `${json.pertanyaan}\n\n`
      teks += `waktu : [ *${((timeout / 1000) / 60)} minutes* ]\n`
      teks += `Balas pesan ini untuk menjawab pertanyaan, ketik *${isPrefix}who* untuk bantuan dan *${isPrefix}whoskip* untuk menghapus sesi.`
      client.whoami[id] = [
         await client.reply(m.chat, teks, m),
         json, poin,
         setTimeout(() => {
            if (client.whoami[id]) client.reply(m.chat, `*Waktunya habis!*\nJawabannya adalah : *${json.jawaban}*`, client.whoami[id][0])
            delete client.whoami[id]
         }, timeout)
      ]
   },
   group: true,
   limit: 2
}