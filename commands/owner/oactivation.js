exports.run = {
   usage: ['omute'],
   async: async (m, {
      args,
      isPrefix,
      command
   }) => {
      let gc = global.db.groups[m.chat]
      let opt = [0, 1]
      if (!args || !args[0] || !opt.includes(parseInt(args[0]))) return client.buttonLoc(m.chat, await Func.fetchBuffer(global.db.setting.cover), Func.texted('bold', `This command to change the bot activation in the group.`), global.db.setting.footer, [{
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
      ])
      if (parseInt(args[0]) == 1) {
         if (gc.mute) return client.reply(m.chat, Func.texted('bold', `Bot has been muted.`), m)
         gc.mute = true
         client.reply(m.chat, Func.texted('bold', `Successfully muted.`), m)
      } else if (parseInt(args[0]) == 0) {
         if (!gc.mute) return client.reply(m.chat, Func.texted('bold', `Bot has been unmuted.`), m)
         gc.mute = false
         client.reply(m.chat, Func.texted('bold', `Successfully unmuted.`), m)
      }
   },
   owner: true,
   group: true,
   cache: true,
   location: __filename
}