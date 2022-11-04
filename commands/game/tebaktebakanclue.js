exports.run = {
   usage: ['apatuh'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.tebaktebakan = client.tebaktebakan ? client.tebaktebakan : {}
      let id = m.chat
      if (!(id in client.tebaktebakan)) return
      let json = client.tebaktebakan[id][1]
      let nya = json.jawaban
      let nyanya = nya.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
      client.reply(m.chat, '```' + nyanya + '```', m)
   },
   group: true
}