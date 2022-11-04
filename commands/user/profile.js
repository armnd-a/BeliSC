exports.run = {
   usage: ['profile'],
   async: async (m, {
      client,
      text,
      command,
      participants
   }) => {
      let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@` [1]) : text
      if (!text && !m.quoted) return client.reply(m.chat, Func.texted('bold', `Tag atau Reply pesan dia.`), m)
      if (isNaN(number)) return client.reply(m.chat, Func.texted('bold', `Nomor salah`), m)
      if (number.length > 15) return client.reply(m.chat, Func.texted('bold', `Salah ketik kak`), m)
      let _own = [...new Set([global.owner, ...global.db.setting.owners])]
      try {
         if (text) {
            var user = number + '@s.whatsapp.net'
         } else if (m.quoted.sender) {
            var user = m.quoted.sender
         } else if (m.mentionedJid) {
            var user = number + '@s.whatsapp.net'
         }
      } catch (e) {} finally {
         let users = global.db.users[user]
         if (typeof users == 'undefined') return client.reply(m.chat, Func.texted('bold', `User belum terdaftar di database`), m)
         let setting = global.db.setting
         let pic = await Func.fetchBuffer('./media/images/default.jpg')
         try {
            pic = await client.profilePictureUrl(user, 'image')
         } catch {} finally {
            let now = new Date() * 1
            let lastseen = (users.lastseen == 0) ? 'Never' : Func.toDate(now - users.lastseen)
            let usebot = (users.usebot == 0) ? 'Never' : Func.toDate(now - users.usebot)
            let caption = `❏  *U S E R - P R O F I L E*\n\n`
            caption += `	›  *Saldo* : Rp. ${Func.h2k(users.point)}\n`
            caption += `	›  *Limit* : ${(users.premium || _own.includes(user.split`@`[0])) ? '( ∞ ) Unlimited' : Func.formatNumber(users.limit)}\n`
            caption += `	›  *Level* : ${Func.level(global.db.users[m.sender].point)[0]}\n`
            caption += `	›  *Warning* : ${(m.isGroup) ? (typeof global.db.groups[m.chat].member[user] != 'undefined' ? global.db.groups[m.chat].member[user].warning : 0) + ' / 5' : users.warning + ' / 5'}\n`
            caption += `	›  *Pakai bot* : ${Func.formatNumber(users.hit)}\n`
            caption += `	›  *Aktif* : ${usebot}\n`
            caption += `	›  *Terakhir dilihat* : ${lastseen}\n`
            caption += `	›  *Tax Point* : ${Func.formatNumber(Math.ceil(users.point / 100 * 15).toFixed(0))} (15%)\n\n`
            caption += `❏  *U S E R - S T A T U S*\n\n`
            caption += `	›  *Banned* : ${Func.switcher(users.banned, 'ya', 'tidak')}\n`
            caption += `	›  *Whitelist* : ${Func.switcher(users.whitelist, 'ya', 'tidak')}\n`
            caption += `	›  *Owner* : ${Func.switcher(_own.includes(user.split`@`[0]), 'ya', 'bukan')}\n`
            caption += `	›  *Pesan pribadi* : ${Func.switcher(Object.keys(global.db.chats).includes(user), 'bisa', 'tidak')}\n`
            caption += `	›  *Premium* : ${Func.switcher(users.premium, 'ya', 'tidak')}\n`
            caption += `	›  *Sisa premium* : ${users.expired == 0 ? '-' : Func.timeReverse(users.expired - new Date * 1)}\n`
            caption += `	›  *Pacar* : ${typeof users.taken != 'undefined' && users.taken ? '@' + users.pasangan.split('@')[0] : 'jomblo'}\n\n`
            caption += global.db.setting.footer
            client.sendImage(m.chat, pic, caption, m)
         }
      }
   },
   error: false,
   group: true,
   cache: true,
   location: __filename
}