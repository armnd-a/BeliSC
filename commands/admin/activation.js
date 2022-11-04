exports.run = {
   usage: ['mute'],
   async: async (m, {
      args,
      isPrefix,
      command
   }) => {
      let gc = global.db.groups[m.chat]
      let opt = [0, 1]
      if (!args || !args[0] || !opt.includes(parseInt(args[0]))) return client.sendTemplateButton(m.chat, global.db.setting.cover, Func.texted('bold', `This command to change the bot activation in the group.`), global.db.setting.footer, [{
            quickReplyButton: {
               displayText: `True`,
               id: `${isPrefix + command} 1`
            }
         },
         {
            quickReplyButton: {
               displayText: `False`,
               id: `${isPrefix + command} 0`
            }
         }
      ], {
         location: true
      })
      if (parseInt(args[0]) == 1) {
         if (gc.mute) return client.reply(m.chat, Func.texted('bold', `Bot telah di matikan.`), m)
         gc.mute = true
         client.reply(m.chat, Func.texted('bold', `Berhasil di matikan di group ini.`), m)
      } else if (parseInt(args[0]) == 0) {
         if (!gc.mute) return client.reply(m.chat, Func.texted('bold', `Bot telah di hidupkan.`), m)
         gc.mute = false
         client.reply(m.chat, Func.texted('bold', `Berhasil di hidupkan di group ini.`), m)
      }
   },
   admin: true,
   group: true,
   cache: true,
   location: __filename
}
