exports.run = {
   usage: ['ks', 'kicksider'],
   async: async (m, {
      client,
      args,
      participants
   }) => {
      if (!args || !args[0]) return client.reply(m.chat, Func.texted('bold', `Silahkan pilih, ketik 1 untuk kick anggota yang join doang dan ketik 2 untuk kick anggota tidak aktif selama lebih dari 7 hari`), m)
      let member = participants.filter(u => u.admin == null).map(u => u.id)
      var day = 86400000 * 7,
         now = new Date() * 1
      let sider = []
      member.map(v => {
         if ((typeof global.db.users[v] == 'undefined' && typeof global.db.groups[m.chat].member[v] == 'undefined') && v != client.user.id.split(':')[0] + '@s.whatsapp.net') sider.push(v)
      })
      if (args[0] == 1) {
         if (sider.length == 0) return client.reply(m.chat, `Null data`, m)
         sider.map(async v => {
            await Func.delay(2000).then(async () => await client.groupParticipantsUpdate(m.chat, [v], 'remove'))
         })
      } else if (args[0] == 2) {
         let lastseen = Object.entries(global.db.groups[m.chat].member).sort((a, b) => a[1].lastseen - b[1].lastseen).filter(([v, x]) => x.lastseen != 0 && ((now - x.lastseen > day) || (now - global.db.users[v].lastseen > day)) && !global.db.users[v].premium && !x.whitelist && !global.db.users[v].whitelist && v != client.user.id.split(':')[0] + '@s.whatsapp.net')
         if (lastseen.length == 0) return client.reply(m.chat, `Null data`, m)
         lastseen.map(async ([v, x]) => {
            await Func.delay(2000).then(async () => await client.groupParticipantsUpdate(m.chat, [v], 'remove'))
         })
      } else client.reply(m.chat, Func.texted('bold', `salah bang!`), m)
   },
   error: false,
   owner: true,
   botAdmin: true,
   group: true
}