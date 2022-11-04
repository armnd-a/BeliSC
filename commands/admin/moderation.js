exports.run = {
   usage: ['antilink', 'antivirtex', 'left', 'filter', 'game', 'localonly', 'notify', 'protect', 'welcome'],
   async: async (m, {
      client,
      args,
      command,
      isBotAdmin
   }) => {
      let setting = global.db.groups[m.chat]
      if (!args || !args[0]) return client.reply(m.chat, Func.texted('bold', `Select option on / off.`), m)
      let type = command.toLowerCase()
      let option = args[0].toLowerCase()
      let optionList = ['on', 'off']
      if (!optionList.includes(option)) return client.reply(m.chat, Func.texted('bold', `Select option on / off.`), m)
      let status = option != 'on' ? false : true
      if (type == 'antidelete' || type == 'antidel') {
         if (setting.nodelete == status) return client.reply(m.chat, Func.texted('bold', `Anti Delete Sebelumnya sudah ${args[0].toUpperCase()}.`), m)
         setting.nodelete = status
         return client.reply(m.chat, Func.texted('bold', `Anti Delete successfully turned ${args[0].toUpperCase()}.`), m)
      } else if (type == 'antilink') {
         if (!isBotAdmin) return client.reply(m.chat, global.status.botAdmin, m)
         if (setting.nolink == status) return client.reply(m.chat, Func.texted('bold', `Antilink Sebelumnya sudah ${args[0].toUpperCase()}.`), m)
         setting.nolink = status
         return client.reply(m.chat, Func.texted('bold', `Antilink berhasil ${args[0].toUpperCase()}.`), m)
      } else if (type == 'antivirtex') {
         if (!isBotAdmin) return client.reply(m.chat, global.status.botAdmin, m)
         if (setting.novirtex == status) return client.reply(m.chat, Func.texted('bold', `Anti Virtex Sebelumnya sudah ${args[0].toUpperCase()}.`), m)
         setting.novirtex = status
         return client.reply(m.chat, Func.texted('bold', `Anti virtex berhasil ${args[0].toUpperCase()}.`), m)
      } else if (type == 'filter') {
         if (!isBotAdmin) return client.reply(m.chat, global.status.botAdmin, m)
         if (setting.nobadword == status) return client.reply(m.chat, Func.texted('bold', `Anti toxic Sebelumnya sudah ${args[0].toUpperCase()}.`), m)
         setting.nobadword = status
         return client.reply(m.chat, Func.texted('bold', `Anti toxic berhasil ${args[0].toUpperCase()}.`), m)
      } else if (type == 'game') {
         if (setting.game == status) return client.reply(m.chat, Func.texted('bold', `Fitur game sebelumnya sudah ${args[0].toUpperCase()}.`), m)
         setting.game = status
         return client.reply(m.chat, Func.texted('bold', `Fitur game berhasil ${args[0].toUpperCase()}.`), m)
      } else if (type == 'localonly') {
         if (!isBotAdmin) return client.reply(m.chat, global.status.botAdmin, m)
         if (setting.localonly == status) return client.reply(m.chat, Func.texted('bold', `Localonly sebelumnya sudah ${args[0].toUpperCase()}.`), m)
         setting.localonly = status
         return client.reply(m.chat, Func.texted('bold', `Localonly berhasil ${args[0].toUpperCase()}.`), m)
      } else if (type == 'left') {
         if (setting.left == status) return client.reply(m.chat, Func.texted('bold', `Left Message sebelum nya sudah ${args[0].toUpperCase()}.`), m)
         setting.left = status
         return client.reply(m.chat, Func.texted('bold', `Left Message berhasil ${args[0].toUpperCase()}.`), m)
      } else if (type == 'notify') {
         if (setting.notify == status) return client.reply(m.chat, Func.texted('bold', `Notification Spam sebelumnya sudah ${args[0].toUpperCase()}.`), m)
         setting.notify = status
         return client.reply(m.chat, Func.texted('bold', `Notification Spam berhasil ${args[0].toUpperCase()}.`), m)
      } else if (type == 'protect') {
         if (!isBotAdmin) return client.reply(m.chat, global.status.botAdmin, m)
         if (setting.spamProtect == status) return client.reply(m.chat, Func.texted('bold', `Spam Protection sebelumnya sudah ${args[0].toUpperCase()}.`), m)
         setting.spamProtect = status
         return client.reply(m.chat, Func.texted('bold', `Spam Protection berhasil ${args[0].toUpperCase()}.`), m)
      } else if (type == 'welcome') {
         if (setting.welcome == status) return client.reply(m.chat, Func.texted('bold', `Welcome Message sebelumnya sudah ${args[0].toUpperCase()}.`), m)
         setting.welcome = status
         return client.reply(m.chat, Func.texted('bold', `Welcome Message berhasil ${args[0].toUpperCase()}.`), m)
      }
   },
   admin: true,
   group: true,
   cache: true,
   location: __filename
}
