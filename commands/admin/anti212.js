exports.run = {
   usage: ['anti212'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      let setting = global.db.groups[m.chat]
      let rows = [{
         title: Func.ucword(command),
         rowId: `${isPrefix + command} on`,
         description: `[ Status : ON ]`
      }, {
         title: Func.ucword(command),
         rowId: `${isPrefix + command} off`,
         description: `[ Status : OFF ]`
      }]
      let type = command.toLowerCase()
      if (!args || !args[0]) return client.sendList(m.chat, '', `Status saat ini : [ ${setting[type] ? 'ON' : 'OFF'} ]`, '', 'Tap!', rows, m)
      let option = args[0].toLowerCase()
      let optionList = ['on', 'off']
      if (!optionList.includes(option)) return client.sendList(m.chat, '', `Status saat ini : [ ${setting[type] ? 'ON' : 'OFF'} ]`, '', 'Tap!', rows, m)
      let status = option != 'on' ? false : true
      if (setting[type] == status) return client.reply(m.chat, Func.texted('bold', `${Func.ucword(command)} sebelumnya sudah ${option == 'on' ? 'diaktifkan' : 'dimatikan'}.`), m)
      setting[type] = status
      client.reply(m.chat, Func.texted('bold', `${Func.ucword(command)} berhasil ${option == 'on' ? 'diaktifkan' : 'dimatikan'}.`), m)
   },
   admin: true,
   group: true,
   isBotAdmin: true,
   cache: true,
   location: __filename
}