exports.run = {
   usage: ['artinama2'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, command != 'artinama' ? 'yntkts' : 'galang'), m)
         let json = await scrap.artinama(text)
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         let teks = `❏  *A R T I N A M A*\n\n`   
         client.reply(m.chat, `${json.data.arti}`, m)
      } catch {
         client.reply(m.chat, global.status.error, m)
      }
   },
   error: false
}