exports.run = {
   usage: ['clue'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.riddle = client.riddle ? client.riddle : {}
      let id = m.chat
      if (!(id in client.riddle)) return
      let json = client.riddle[id][1]
      let nya = json.jawaban
      let nyanya = nya.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
      client.reply(m.chat, '```' + nyanya + '```', m)
   },
   group: true
}