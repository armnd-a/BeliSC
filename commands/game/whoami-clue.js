exports.run = {
   usage: ['who'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.whoami = client.whoami ? client.whoami : {}
      let id = m.chat
      if (!(id in client.whoami)) return
      let json = client.whoami[id][1]
      let nya = json.jawaban
      let nyanya = nya.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
      client.reply(m.chat, '```' + nyanya + '```', m)
   },
   group: true
}