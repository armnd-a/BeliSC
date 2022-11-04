exports.run = {
   usage: ['check'],
   async: async (m, {
      client
   }) => {
      try {
         let json = await Func.fetchJson('https://api.neoxr.my.id/api/check/lf3YsbNU')
         await client.reply(m.chat, Func.jsonFormat(json), m)
      } catch (e) {
         client.fakeGroupLink(m.chat, global.status.error, m)
      }
   },
   error: false,
   cache: true,
   location: __filename
}