exports.run = {
   usage: ['demote', 'kick'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      participants
   }) => {
      let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@` [1]) : text
      if (!text && !m.quoted) return client.reply(m.chat, Func.texted('bold', `tag / reply`), m)
      if (isNaN(number)) return client.reply(m.chat, Func.texted('bold', `nomor salah.`), m)
      if (number.length > 15) return client.reply(m.chat, Func.texted('bold', `ga gitu.`), m)
      try {
         if (text) {
            var user = number + '@s.whatsapp.net'
         } else if (m.quoted.sender) {
            var user = m.quoted.sender
         } else if (m.mentionedJid) {
            var user = number + '@s.whatsapp.net'
         }
      } catch (e) {} finally {
         let users = m.isGroup ? participants.find(u => u.id == user) : {}
         if (!users) return client.reply(m.chat, Func.texted('bold', `Orang nya sudah keluar kak.`), m)
         let ownerF = [global.client.user.id.split`@` [0], global.owner, ...global.db.setting.owners].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(user)
         if (ownerF) return client.reply(m.chat, Func.texted('bold', `Lu siapa?.`), m)
         if (user == client.user.id.split(':')[0] + 's.whatsapp.net') return client.reply(m.chat, Func.texted('bold', `dek?`), m)
         if (command == 'kick') return client.groupParticipantsUpdate(m.chat, [user], 'remove')
         if (command == 'demote') return client.groupParticipantsUpdate(m.chat, [user], 'demote')
      }
   },
   group: true,
   admin: true,
   botAdmin: true
}