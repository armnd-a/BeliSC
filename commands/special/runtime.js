exports.run = {
   usage: ['runtime'],
   async: async (m, {
      client
   }) => {
      let _uptime = process.uptime() * 1000
      let uptime = Func.toTime(_uptime)
      client.reply(m.chat, Func.texted('bold', `Berjalan : ↳˗ˏˋ${uptime}ˊˎ˗ ↴`), m)
   },
   error: false
}