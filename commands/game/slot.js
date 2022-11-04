exports.run = {
   usage: ['slot'],
   async: async (m, {
      client
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Fitur game dinonaktifkan sementara oleh owner.`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Fitur game tidak diaktifkan di grup ini.`), m)
      let user = global.db.users[m.sender]
      if (user.point == 0) return client.reply(m.chat, Func.texted('bold', `Anda tidak memiliki poin untuk bermain slot.`), m)
      if (user.point < 1000) return client.reply(m.chat, Func.texted('bold', `Untuk memainkan slot game setidaknya Anda harus memiliki 1k poin.`), m)
      let reward = Func.randomInt(1000, user.point)
      let emojis = ["🤡", "⚡", "💎"]
      let a = Math.floor(Math.random() * emojis.length)
      let b = Math.floor(Math.random() * emojis.length)
      let c = Math.floor(Math.random() * emojis.length)
      let x = [],
         y = [],
         z = []
      for (let i = 0; i < 3; i++) {
         x[i] = emojis[a]
         a++
         if (a == emojis.length) a = 0
      }
      for (let i = 0; i < 3; i++) {
         y[i] = emojis[b]
         b++
         if (b == emojis.length) b = 0
      }
      for (let i = 0; i < 3; i++) {
         z[i] = emojis[c]
         c++
         if (c == emojis.length) c = 0
      }
      let end
      if (a == b && b == c) {
         end = `JACKPOT! *+${Func.formatNumber(reward)} points*`
         user.point += reward
      } else if (a == b || a == c || b == c) {
         end = `Less Fortunate! *+3 Limits*`
         user.limit += 3
      } else {
         end = `LOSE! *-${Func.formatNumber(reward)} points*`
         if (reward > user.point) {
            user.point = 0
         } else {
            user.point -= reward
         }
      }
      let teks = `❏  *S L O T S*\n\n`
      teks += `	[ ${x[0]} ${y[0]} ${z[0]} ]\n`
      teks += `	[ ${x[1]} ${y[1]} ${z[1]} ]\n`
      teks += `	[ ${x[2]} ${y[2]} ${z[2]} ]\n`
      teks += `\n${end}`
      client.reply(m.chat, teks, m)
   },
   group: true,
   limit: 5
}