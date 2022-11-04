exports.run = {
   usage: ['restart'],
   async: async (m, {
      client
   }) => {
      await client.reply(m.chat, Func.texted('bold', 'Rebooting . . .'), m).then(async () => {
         await client.sql.save()
         process.send('reset')
      })
   },
   owner: true
}