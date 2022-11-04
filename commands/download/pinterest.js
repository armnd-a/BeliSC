exports.run = {
   usage: ['pinterest'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      isOwner
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, `panda`), m)
         if (!isOwner && text.match(/(xnxx|porn|ngentot|pussy|bugil|memek|hentai|sex|desah)/gi)) {
            client.updateBlockStatus(m.sender, 'block')
            let user = global.db.users
            user[m.sender].banned = true
            let banned = 0
            for (let jid in user) {
               if (user[jid].banned) banned++
            }
            return client.reply(m.chat, `“${text}”\n\n😳 Kamu terdeteksi menyalahi *Syarat & Ketentuan* pengguna untuk itu sistem membanned dan memblokir nomormu, jika ingin dibuka blokiran & banned dikenai biaya sebesar Rp. 10,000`, m)
         }
         client.reply(m.chat, global.status.getdata, m)
         let old = new Date()
         let json = await Api.pinterest(text)
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         for (let i = 0; i < 3; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            client.sendFile(m.chat, json.data[rand].url, '', `Hasil pencarian ${text}\n\n⏱️ *Fetching* : ${((new Date - old) * 1)} ms`, m)
            await Func.delay(2000)
         }
      } catch {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: 10
}