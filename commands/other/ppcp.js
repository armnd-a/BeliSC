exports.run = {
   usage: ['ppcp'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      let json = Func.jsonRandom('./media/json/couple.json')
      client.sendImage(m.chat, json.female, '', m).then(async () => {
         await client.sendImage(m.chat, json.male, '', m)
      })
   },
   quota: true
}