exports.run = {
   usage: ['wordclue'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.whatword = client.whatword ? client.whatword : {}
      let id = m.chat
      if (!(id in client.whatword)) return
      let json = client.whatword[id][1]
      let nya = json.tipe
      client.reply(m.chat, '```' + nya + '```', m)
   },
   group: true,
   limit: 2
}