exports.run = {
   usage: ['cluedong'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.caklontong = client.caklontong ? client.caklontong : {}
      let id = m.chat
      if (!(id in client.caklontong)) return
      let json = client.caklontong[id][1]
      let nya = json.jawaban
      let nyanya = nya.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
      client.reply(m.chat, '```' + nyanya + '```', m)
   },
   group: true
}