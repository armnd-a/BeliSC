const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
exports.run = {
   usage: ['+log', '-log', 'changelog', 'log'],
   async: async (m, {
      client,
      args,
      text,
      isOwner,
      isPrefix,
      command
   }) => {
      try {
         let logs = typeof global.db.changelog == 'undefined' ? global.db.changelog = {} : global.db.changelog
         let id = Func.makeId(4)
         if (command == '+log') {
            if (!isOwner) return client.reply(m.chat, global.status.owner, m)
            if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'penambahan fitur changelog'), m)
            logs[id] = {
               log: text,
               at: new Date() * 1
            }
            client.reply(m.chat, Func.texted('bold', `Log berhasil ditambahkan dengan kode : "${id}".`), m)
         } else if (command == '-log') {
            if (!isOwner) return client.reply(m.chat, global.status.owner, m)
            if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'Z0JH'), m)
            if (!logs[args[0].toUpperCase()]) return client.reply(m.chat, Func.texted('bold', `Kode log tidak ada didalam database.`), m)
            delete logs[args[0].toUpperCase()]
            client.reply(m.chat, Func.texted('bold', `Log dengan kode "${args[0].toUpperCase()}" berhasil dihapus.`), m)
         } else if (/changelog|log/.test(command)) {
            let changelog = Object.entries(logs).sort((a, b) => b[1].at - a[1].at)
            if (changelog.length == 0) return client.reply(m.chat, Func.texted('bold', `Tidak ada riwayat perubahan (Changelog).`), m)
            let show = Math.min(20, changelog.length)
            let teks = `❏  *C H A N G E L O G (20)*\n\n`
            teks += Func.texted('bold', `“Informasi riwayat update, total terdapat ${Func.formatNumber(changelog.length)} log dan maksimal 20 log terbaru yang ditampilkan.”`) + '\n\n'
            teks += changelog.slice(0, show).map(([code, data], i) => `[ *${moment(data.at).format('DD/MM/YY HH:mm:ss')}* ] ➠ [ ${code} ] ➠ ${data.log}.`).join('\n')
            teks += `\n\n${global.db.setting.footer}`
            client.fakeStory(m.chat, teks, global.db.setting.header)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   cache: true,
   location: __filename
}