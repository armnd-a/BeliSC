exports.run = {
   usage: ['spin'],
   async: async (m, {
      client,
      args
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Fitur game dinonaktifkan sementara oleh owner.`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Fitur game tidak diaktifkan di grup ini.`), m)
      let user = global.db.users[m.sender]
      if (user.point > 500000) return client.reply(m.chat, Func.texted('bold', `Poin Anda telah mencapai 500K, silakan mainkan permainan koin.`), m)
      if (!args || !args[0] || args[0].startsWith('0')) return client.reply(m.chat, Func.texted('bold', `Berikan poin nominal yang akan diputar.`), m)
      if (isNaN(args[0])) return client.reply(m.chat, Func.texted('bold', `Poin harus berupa angka`), m)
      if (args[0] > user.point) return client.reply(m.chat, Func.texted('bold', `Poin Anda tidak cukup untuk diputar ${Func.formatNumber(args[0])} points.`), m)
      if (args[0] < 1000) return client.reply(m.chat, Func.texted('bold', `Tidak dapat berputar di bawah 1000 poin.`), m)
      user.point -= args[0]
      setTimeout(async () => {
         let reward = Func.randomInt(100, args[0] * 3)
         user.point += reward
         let last = user.point
         let teks = `❏  *S P I N - R E S U L T*\n\n`
         teks += `	*- ${Func.formatNumber(args[0])}*\n`
         teks += `	*+ ${Func.formatNumber(reward)}*\n\n`
         teks += `• *Total* : ${Func.formatNumber(last)} Points\n\n`
         teks += `*NB : “Anti-Spam jeda 5 detik setelah putaran sebelumnya, BOT tidak akan merespon, harap ulangi setelah 5 detik berlalu.”*`
         client.reply(m.chat, teks, m)
      }, 1000)
   },
   group: true,
   limit: 5
}