exports.run = {
   usage: ['songclue'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.whatsong = client.whatsong ? client.whatsong : {}
      let id = m.chat
      if (!(id in client.whatsong)) return
      let json = client.whatsong[id][1]
      let nya = json.title
      let nyanya = nya.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
      client.reply(m.chat, '```' + nyanya + '```', m)
   },
   group: true
}