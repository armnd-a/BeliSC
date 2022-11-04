exports.run = {
   usage: ['addown', 'delown', 'addmod', 'delmod'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      let owners = global.db.setting.owners
      let mods = global.db.setting.mods
      let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@` [1]) : text
      if (!text && !m.quoted) return client.reply(m.chat, Func.texted('bold', `tag atau balas target obrolan`), m)
      if (isNaN(number)) return client.reply(m.chat, Func.texted('bold', `Nomor tidak valid`), m)
      if (number.length > 15) return client.reply(m.chat, Func.texted('bold', `Format tidak valid.`), m)
      try {
         if (text) {
            var user = number
         } else if (m.quoted.sender) {
            var user = m.quoted.sender.split`@` [0]
         } else if (mentionedJid) {
            var user = number
         }
      } catch (e) {} finally {
         if (command == 'addown') {
            if (owners.includes(user)) return client.reply(m.chat, Func.texted('bold', `Target has become owner.`), m)
            owners.push(user)
            client.reply(m.chat, Func.texted('bold', `@${user} sekarang adalah owner`), m)
         } else if (command == 'delown') {
            if (!owners.includes(user)) return client.reply(m.chat, Func.texted('bold', `Target tidak ada dalam daftar owner`), m)
            owners.forEach((data, index) => {
               if (data === user) owners.splice(index, 1)
            })
            client.reply(m.chat, Func.texted('bold', `@${user} berhasil dihapus dari owner`), m)
         } else if (command == 'addmod') {
            if (mods.includes(user)) return client.reply(m.chat, Func.texted('bold', `Target telah menjadi moderator`), m)
            mods.push(user)
            client.reply(m.chat, Func.texted('bold', `@${user} sekarang menjadi moderator melbot`), m)
         } else if (command == 'delmod') {
            if (!mods.includes(user)) return client.reply(m.chat, Func.texted('bold', `Target sebelumnya bukan moderator.`), m)
            mods.forEach((data, index) => {
               if (data === user) mods.splice(index, 1)
            })
            client.reply(m.chat, Func.texted('bold', `@${user} berhasil dihapus dari moderator melbot`), m)
         } 
      }
   },
   owner: true
}