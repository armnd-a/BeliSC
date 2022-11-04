exports.run = {
   usage: ['me'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      let user = global.db.users[m.sender]
      let pic = await Func.fetchBuffer('./media/images/default.jpg')
      let _own = [...new Set([global.owner, ...global.db.setting.owners])]
      try {
         pic = await client.profilePictureUrl(m.sender, 'image')
      } catch {} finally {
         let name = m.pushName || 'No Name'
         let now = new Date() * 1
         let lastseen = (user.lastseen == 0) ? 'Never' : Func.toDate(now - user.lastseen)
         let usebot = (user.usebot == 0) ? 'Never' : Func.toDate(now - user.usebot)
         let caption = `❏  *U S E R - P R O F I L E*\n\n`
         caption += `	›  *Name* : ${name}\n`
         caption += `	›  *Saldo* : Rp. ${Func.h2k(user.point)}\n`
         caption += `	›  *Limit* : ${(user.premium || _own.includes(m.sender.split`@`[0])) ? '( ∞ ) Unlimited' : Func.formatNumber(user.limit)}\n`
         caption += `	›  *Level* : ${Func.level(global.db.users[m.sender].point)[0]}\n`
         caption += `	›  *Warning* : ${(m.isGroup) ? (typeof global.db.groups[m.chat].member[m.sender] != 'undefined' ? global.db.groups[m.chat].member[m.sender].warning : 0) + ' / 5' : user.warning + ' / 5'}\n`
         caption += `	›  *Pakai bot* : ${Func.formatNumber(user.hit)}\n`
         caption += `	›  *Aktif* : ${usebot}\n`
         caption += `	›  *Terakhir dilihat* : ${lastseen}\n\n`
         caption += `❏  *U S E R - S T A T U S*\n\n`
         caption += `	›  *Banned* : ${Func.switcher(user.banned, 'iya', 'tidak')}\n`
         caption += `	›  *Whitelist* : ${Func.switcher(user.whitelist, 'iya', 'tidak')}\n`
         caption += `	›  *Owner* : ${Func.switcher(_own.includes(m.sender.split`@`[0]), 'iya', 'bukan')}\n`
         caption += `	›  *Pesan pribadi* : ${Func.switcher(Object.keys(global.db.chats).includes(m.sender), 'bisa', 'tidak')}\n`
         caption += `	›  *Premium* : ${Func.switcher(user.premium, 'iya', 'tidak')}\n`
         caption += `	›  *Sisa premium* : ${user.expired == 0 ? '-' : Func.timeReverse(user.expired - new Date * 1)}\n` 
         caption += `	›  *Pacar* : ${typeof user.taken != 'undefined' && user.taken ? '@' + user.pasangan.split('@')[0] : 'jomblo'}\n\n`
         caption += global.db.setting.footer
         client.sendMessageModify(m.chat, caption, m, {
             title: '🔒 USER REGISTERED IN SQL DATABASE',
             largeThumb: true,
             thumbnail: pic
         })
      }
   },
   error: false,
   cache: true,
   location: __filename
}
