exports.run = {
   usage: ['coin'],
   async: async (m, {
      client,
      args
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Game features are temporarily disabled by the owner.`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Game features are not activated in this group.`), m)
      let user = global.db.users[m.sender]
      if (!args || !args[0]) return client.reply(m.chat, Func.texted('bold', `silahkan pilih a / b`), m)
      if (user.point == 0) return client.reply(m.chat, Func.texted('bold', `Anda tidak memiliki saldo untuk bermain koin.`), m)
      if (user.point < 300000) return client.reply(m.chat, Func.texted('bold', `Untuk memainkan game coin, setidaknya Anda harus memiliki 300rb saldo`), m)
      let x = Func.ucword(args[0])
      if (x == 'A' || x == 'B') {
         var type = Func.random(['A', 'B'])
         var reward = Func.randomInt(100000, user.point)
         setTimeout(async () => {
            if (Func.ucword(args[0]) == type) {
               user.point += reward
               let last = user.point
               let teks = `❏  *W I N*\n\n`
               teks += `	*System* : ${type}, *You* : ${Func.ucword(args[0])}!\n`
               teks += `	*+ ${Func.formatNumber(reward)}*\n\n`
               teks += `• *Total* : ${Func.formatNumber(last)} Points\n\n`
               teks += `*Note : “Untuk menghindari kemiskinan, gunakan 3x sehari saja.”*`
               client.reply(m.chat, teks, m)
            } else if (Func.ucword(args[0]) != type) {
               user.point -= reward
               let last = user.point
               let teks = `❏  *L O S E*\n\n`
               teks += `	*System* : ${type}, *You* : ${Func.ucword(args[0])}!\n`
               teks += `	*- ${Func.formatNumber(reward)}*\n\n`
               teks += `• *Total* : ${Func.formatNumber(last)} Points\n\n`
               teks += `*Note : “Untuk menghindari kemiskinan, gunakan 3x sehari saja.”*`
               client.reply(m.chat, teks, m)
            }
         }, 1000)
      } else {
         return client.reply(m.chat, Func.texted('bold', `ga usah main dek 🗿`), m)
      }
   },
   group: true,
   limit: true
}