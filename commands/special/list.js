let moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
exports.run = {
   usage: ['list'],
   async: async (m, {
      client,
      args,
      isPrefix
   }) => {
      let rows = [{
            title: 'BANNED',
            rowId: `${isPrefix}list 1`,
            description: ``
         }, {
            title: 'PREMIUM',
            rowId: `${isPrefix}list 2`,
            description: ``
         }, {
            title: 'MODERATOR',
            rowId: `${isPrefix}list 3`,
            description: ``
         }, {
            title: 'ASUPAN',
            rowId: `${isPrefix}list 4`,
            description: ``
         }, {
            title: 'FITUR ERROR',
            rowId: `${isPrefix}list 5`,
            description: ``
         }, {
            title: 'USER VIP',
            rowId: `${isPrefix}list 6`,
            description: ``
         }, {
            title: 'PRIVATE CHAT',
            rowId: `${isPrefix}list 7`,
            description: ``
         }]
      if (!args || !args[0]) return client.sendList(m.chat, '', 'Pilih tipe list yang ingin Anda lihat.', '', 'Tap!', rows, m)  
      let users = global.db.users       
      if (args[0] == 1) {
         userBan = []
         for (let jid in users) {
            if (users[jid].banned) userBan.push(jid)
         }
         if (userBan.length == 0) return client.reply(m.chat, Func.texted('bold', `Tidak ada user yang terbanned kak.`), m)
         return client.reply(m.chat, `❏  *L I S T B A N*\n\n*${userBan.length} pengguna terdeteksi diblokir dari bot.”*\n\n${userBan.map(v => '	◦  @' + v.replace(/@.+/, '')).join('\n') + '\n\n' + global.db.setting.footer}`, m)
      } else if (args[0] == 2) {
         userPrem = []
         for (let jid in users) {
            if (users[jid].premium) userPrem.push(jid)
         }
         if (userPrem.length == 0) return client.reply(m.chat, Func.texted('bold', `tidak ada user premium`), m)
         return client.reply(m.chat, `❏  *U S E R - P R E M I U M*\n\n*“${userPrem.length} sultan adalah user premium 💎”*\n\n${userPrem.map(v => '	◦  @' + v.replace(/@.+/, '') + '\n	     *Sisa premium* :  ' + moment(global.db.users[v].expired).format('dddd, DD MMMM Y')).join('\n') + '\n\n' + global.db.setting.footer}`, m)
      } else if (args[0] == 3) {
         const data = global.db.setting.mods
         if (data.length == 0) return client.reply(m.chat, Func.texted('bold', `Tidak ada moderator`), m)
         let teks = `❏  *L I S T - M O D*\n\n`
         teks += data.map(tag => '◦ @' + tag.replace(/@.+/, '')).join('\n') + '\n\n'
         teks += global.db.setting.footer
         client.reply(m.chat, teks, m)
      } else if (args[0] == 4) {
         let asupan = global.db.setting.asupan
         if (asupan.length == 0) return client.reply(m.chat, Func.texted('bold', `Tidak ada daftar asupan kak.`), m)
         return client.reply(m.chat, `❏  *L I S T - A S U P A N*\n\n*“${asupan.length} list asupan pengguna bot.”*\n\n${asupan.map(v => '	◦  ' + v).join('\n') + '\n\n' + global.db.setting.footer}`, m)
      } else if (args[0] == 5) {
         let error = global.db.setting.errorCmd
         if (error.length == 0) return client.reply(m.chat, Func.texted('bold', `Tidak ada fitur yang terdeteksi error / dinonaktifkan kak.`), m)
         return client.reply(m.chat, `❏  *L I S T - E R R O R*\n\n*${error.length} fitur bot terdeteksi error / dinonaktifkan.”*\n\n${error.map(v => '	◦  ' + isPrefix + v).join('\n') + '\n\n' + global.db.setting.footer}`, m)
      } else if (args[0] == 6) {
         userVip = []
         for (let jid in users) {
            if (users[jid].vip) userVip.push(jid)
         }
         if (userVip.length == 0) return client.reply(m.chat, Func.texted('bold', `Tidak ada user vip`), m)
         return client.reply(m.chat, `❏  *L I S T - V I P*\n\n${userVip.map(v => '	◦  @' + v.replace(/@.+/, '')).join('\n') + '\n\n' + global.db.setting.footer}`, m)   
      } else if (args[0] == 7) {
         let chats = Object.entries(global.db.chats).sort((a, b) => b[1].lastseen - a[1].lastseen).filter(([v, x]) => v.endsWith('.net'))
         if (chats.length == 0) return client.reply(m.chat, Func.texted('bold', `Null Data.`), m)
         return client.reply(m.chat, `❏  *L I S T - C H A T*\n\n*Terdeteksi ${chats.length} orang menggunakan bot di pesan pribadi.*\n\n${chats.map(([v, x]) => '	◦  @' + v.replace(/@.+/, '') + '\n	     *Total chat* : ' + Func.formatNumber(x.chat) + '\n	     *Terakhir chat* : ' + moment(x.lastseen).format('DD/MM/YY HH:mm:ss')).join('\n') + '\n\n' + global.db.setting.footer}`, m)
      }
   },
   error: false
}
