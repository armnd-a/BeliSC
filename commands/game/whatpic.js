exports.run = {
   usage: ['tebakgambar', 'whatpic'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.whatpic = client.whatpic ? client.whatpic : {}
      let id = m.chat,
         timeout = 120000
      if (id in client.whatpic) {
         return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.whatpic[id][0])
      } else {
         let json = Func.jsonRandom('./media/json/whatpic.json')
         let teks = `❏  *T E B A K - G A M B A R*\n\n`
         teks += `${json.deskripsi}\n\n`
         teks += `Waktu : [ *${((timeout / 1000) / 60)} menit* ]\n`
         teks += `Reply pesan ini untuk menjawab, kirim *${isPrefix}picclue* untuk bantuan dan *${isPrefix}picskip* untuk menghapus sesi.`
         client.whatpic[id] = [
            await client.sendMessageModify(m.chat, teks, m, {
               thumbnail: await Func.fetchBuffer(json.img),
               largeThumb: true
            }),
            json,
            setTimeout(async () => {
               const msg = await store.loadMessage(m.chat, client.whatpic[id][0])
               if (client.whatpic[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${json.jawaban}*`, client.whatpic[id][0])
               delete client.whatpic[id]
            }, timeout)
         ]
      }
   },
   group: true,
   limit: true,
   game: true
}