exports.run = {
   usage: ['git', 'github', 'gitclone'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://github.com/acuyxzy/multi-device'), m)
         client.reply(m.chat, global.status.getdata, m)
         const branch = (args[1] || 'master') + '.zip'
         client.sendFile(m.chat, args[0] + '/archive/refs/heads/' + branch, args[0].split`/`[4] + '.zip', '', m)    
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   cache: true,
   location: __filename
}