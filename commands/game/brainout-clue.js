exports.run = {
   usage: ['brainwhat'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.brainout = client.brainout ? client.brainout : {}
      let id = m.chat
      if (!(id in client.brainout)) return
      let json = client.brainout[id][1]
      let nya = json.jawaban
      let nyanya = nya.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
      client.reply(m.chat, '```' + nyanya + '```', m)
   },
   group: true
}