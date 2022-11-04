exports.run = {
   usage: ['kasihclue'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.tebaklirik = client.tebaklirik ? client.tebaklirik : {}
      let id = m.chat
      if (!(id in client.tebaklirik)) return
      let json = client.tebaklirik[id][1]
      let nya = json.jawaban
      let nyanya = nya.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
      client.reply(m.chat, '```' + nyanya + '```', m)
   },
   group: true
}