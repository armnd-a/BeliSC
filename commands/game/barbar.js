const cron = require('node-cron')
exports.run = {
   usage: ['barbar', 'attack'],
   async: async (m, {
      client,
      isPrefix,
      command,
      participants
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Fitur game dinonaktifkan sementara oleh owner.`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Fitur game tidak diaktifkan di grup ini.`), m)
      let user = global.db.users[m.sender]
      client.barbar = client.barbar ? client.barbar : []
      if (user.point == 0) return client.reply(m.chat, Func.texted('bold', `Kamu tidak punya point untuk bermain game Barbar`), m)
      if (user.point < 1000) return client.reply(m.chat, Func.texted('bold', `Untuk bermain minimal kamu harus mempunyai saldo 1000`), m)
      if (command == 'barbar') client.sendMessageModify(m.chat, help(isPrefix), m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/7f93dd6215141914a7d08.jpg')
         })
      let data = global.db.users
      const percent = Func.randomInt(1, 10)
      const member = participants.map(v => v.id)
      const player = member.filter(v => data[v] && data[v].point != 0 && v != m.sender)
      const select = Func.random(player)
      const attack = Func.random(['menusuk mata lawan menggunakan tusuk gigi sampai lawan meninggal',
         'membakar lawan sehingga menjadi orang hitam',
         'memakan lawan sampai lawan menjadi tulang berulang',
         'mengubur lawan hidup hidup seperti mayat',
         'memotong titit lawan',
         'membunuh lawan dengan bantuan kobo',
         'memindahkan dimensi lawan masuk ke dunia anime sehingga lawan menjadi gepeng',
         'menendang lawan sampai ke dunia animek'
      ])
      const denda = parseInt(((50 / 100) * data[m.sender].point).toFixed(0))
      // const keys = Func.random([0, 1])
      // const dock = Func.random([0, 1])
      let turned = client.barbar.find(player => player.id == m.sender)
      if (!turned) {
         client.barbar.push({
            id: m.sender,
            win: 0,
            cooldown: 0
         })
      }
      const cooldown = new Date(turned.cooldown + 5000)
      if (new Date - turned.cooldown < 5000) return client.reply(m.chat, `💀 Cooldown 5 detik, denda *- ${Func.formatNumber(denda)}* (50%)`, m).then(() => data[m.sender].point -= denda)
      // const LevelE = Func.level(data[select].point)[0]
      // const LevelS = Func.level(data[m.sender].point)[0]
      if (client.barbar.length != 0) {
         cron.schedule('*/6 * * * * *', async () => client.barbar.map(v => v.win == 0))
      }
      turned.cooldown = new Date() * 1
      if (turned.win >= 5) {
         if (data[m.sender].guard >= 10) {
            data[m.sender].guard = 0
            if (turned.win > 0) turned.win -= 1
            let teks = `❏  *F I G H T*\n\n`
            teks += `Lawan Anda Adalah : @84888725073 – Level : [ ∞ ]\n\n`
            teks += `*Draw!*, guard yang kamu miliki habis total dan menjadi orang hitam karena melawan Pencipta BOT dengan level Infinity`
            client.sendMessageModify(m.chat, teks, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/daaed3fe6806190113c94.jpg')
            })
         } else {
            const restrict = Func.randomInt(5, 50)
            const point = parseInt(((restrict / 100) * data[m.sender].point).toFixed(0))
            data[m.sender].point -= point
            data[m.sender].guard = 0
            if (turned.win > 0) turned.win -= 1
            let teks = `❏  *F I G H T*\n\n`
            teks += `Lawan Anda Adalah : @84888725073 – Level : [ ∞ ]\n\n`
            teks += `*Kalah!*, lawanmu adalah Owner bot dengan level infinity, guardmu habis total & saldo mu berkurang *- ${Func.formatNumber(point)}* Rupiah (${restrict}%)`
            client.sendMessageModify(m.chat, teks, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/daaed3fe6806190113c94.jpg')
            })
         }
      } else {
         if (Func.level(data[select].point)[0] > Func.level(data[m.sender].point)[0]) {
            if (data[m.sender].guard >= 10) {
               if (data[select].premium && data[m.sender].premium) {
                  let teks = `❏  *F I G H T*\n\n`
                  teks += `Lawan Anda Adalah : @${select.replace(/@.+/g, '')} – Level : ${Func.level(data[select].point)[0]}\n\n`
                  teks += `*Draw!*, kamu dan lawanmu sama sama kaum elit global.`
                  client.sendMessageModify(m.chat, teks, m, {
                  largeThumb: true,
                  thumbnail: await Func.fetchBuffer('https://telegra.ph/file/d91cfbb8cc8888505cb6e.jpg')
                  })
               } else if (data[select].premium) {
                  const point = parseInt(((percent / 100) * data[m.sender].point).toFixed(0))
                  data[m.sender].point -= point
                  data[select].point += point
                  if (turned.win > 0) turned.win -= 1
                  let teks = `❏  *F I G H T*\n\n`
                  teks += `Lawan Anda Adalah : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data[select].point)[0]} ]\n\n`
                  teks += `*Kalah!*, lawanmu adalah bagian dari elit global, guard yang kamu miliki tidak berguna saldo mu berkurang sebanyak *- ${Func.formatNumber(point)}* Rupiah (${percent}%)`
                  client.sendMessageModify(m.chat, teks, m, {
                  largeThumb: true,
                  thumbnail: await Func.fetchBuffer('https://telegra.ph/file/fadce055e089a1c8d4967.jpg')
                  })
               } else {
                  data[m.sender].guard -= 10
                  let teks = `❏  *F I G H T*\n\n`
                  teks += `Lawan Anda Adalah : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data[select].point)[0]} ]\n\n`
                  teks += `*Draw!*, levelmu lebih rendah dari level lawan & karena kamu mempunyai guard saldo mu aman.`
                  client.sendMessageModify(m.chat, teks, m, {
                  largeThumb: true,
                  thumbnail: await Func.fetchBuffer('https://telegra.ph/file/bb0c0475cee406b64d51d.jpg')
                  })
               }
            } else {
               if (data[select].premium && data[m.sender].premium) {
                  let teks = `❏  *F I G H T*\n\n`
                  teks += `Lawan Anda Adalah : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data[select].point)[0]} ]\n\n`
                  teks += `*Draw!*, kamu dan lawanmu sama sama kaum elit global.`
                  client.sendMessageModify(m.chat, teks, m, {
                  largeThumb: true,
                  thumbnail: await Func.fetchBuffer('https://telegra.ph/file/bb0c0475cee406b64d51d.jpg')
                  })
               } else if (data[select].premium) {
                  const point = parseInt(((percent / 100) * data[m.sender].point).toFixed(0))
                  data[m.sender].point -= point
                  data[select].point += point
                  if (turned.win > 0) turned.win -= 1
                  let teks = `❏  *F I G H T*\n\n`
                  teks += `Lawan Anda Adalah : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data[select].point)[0]} ]\n\n`
                  teks += `*Kalah!*, lawanmu adalah bagian dari elit global, saldo mu berkurang sebanyak *- ${Func.formatNumber(point)}* Rupiah (${percent}%)`
                  client.sendMessageModify(m.chat, teks, m, {
                  largeThumb: true,
                  thumbnail: await Func.fetchBuffer('https://telegra.ph/file/d3f5cc0c7015b967a3a1b.jpg')
                  })
               } else {
                  const restrict = data[m.sender].point > 500000000 ? 50 : percent
                  const point = parseInt(((restrict / 100) * data[m.sender].point).toFixed(0))
                  data[m.sender].point -= point
                  data[select].point += point
                  if (turned.win > 0) turned.win -= 1
                  let teks = `❏  *F I G H T*\n\n`
                  teks += `Lawan Anda Adalah : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data[select].point)[0]} ]\n\n`
                  teks += `*Kalah!*, levelmu lebih rendah dari level lawan, saldo mu berkurang sebanyak *- ${Func.formatNumber(point)}* Rupiah (${percent}%)`
                  client.sendMessageModify(m.chat, teks, m, {
                  largeThumb: true,
                  thumbnail: await Func.fetchBuffer('https://telegra.ph/file/d3f5cc0c7015b967a3a1b.jpg')
                  })
               }
            }
         } else {
            if (data[select].guard >= 10) {
               if (data[select].premium && data[m.sender].premium) {
                  let teks = `❏  *F I G H T*\n\n`
                  teks += `Lawan Anda Adalah : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data[select].point)[0]} ]\n\n`
                  teks += `*Draw!*, kamu dan lawanmu sama sama kaum elit global.`
                  client.sendMessageModify(m.chat, teks, m, {
                  largeThumb: true,
                  thumbnail: await Func.fetchBuffer('https://telegra.ph/file/d91cfbb8cc8888505cb6e.jpg')
                  })
               } else if (data[m.sender].premium) {
                  const point = parseInt(((percent / 100) * data[select].point).toFixed(0))
                  data[select].point -= point
                  data[m.sender].point += point
                  turned.win += 1
                  let teks = `❏  *F I G H T*\n\n`
                  teks += `Lawan Anda Adalah : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data[select].point)[0]} ]\n\n`
                  teks += `*Menang!*, karena kamu bagian dari elit global, guard yang di miliki lawan tidak berguna & kamu mendapatkan *+ ${Func.formatNumber(point)}* Rupiah (${percent}%)`
                  client.sendMessageModify(m.chat, teks, m, {
                  largeThumb: true,
                  thumbnail: await Func.fetchBuffer('https://telegra.ph/file/91e65d058ce84d16a3787.jpg')
                  })
               } else {
                  data[select].guard -= 10
                  let teks = `❏  *F I G H T*\n\n`
                  teks += `Lawan Anda Adalah : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data[select].point)[0]} ]\n\n`
                  teks += `*Draw!*, lawan terlindungi oleh guard.`
                  client.sendMessageModify(m.chat, teks, m, {
                  largeThumb: true,
                  thumbnail: await Func.fetchBuffer('https://telegra.ph/file/bb0c0475cee406b64d51d.jpg')
                  })
               }
            } else {
               const point = parseInt(((percent / 100) * data[select].point).toFixed(0))
               data[select].point -= point
               data[m.sender].point += point
               turned.win += 1
               let teks = `❏  *F I G H T*\n\n`
               teks += `Lawan Anda Adalah : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data[select].point)[0]} ]\n\n`
               teks += `*Menang!*, kamu berhasil ${attack}, dan mendapatkan *+ ${Func.formatNumber(point)}* Rupiah (${percent}%)`
               client.sendMessageModify(m.chat, teks, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer('https://telegra.ph/file/fadce055e089a1c8d4967.jpg')
               })
            }
         }
      }
   },
   group: true,
   game: true
}

const help = prefix => {
   return `❏  *G A M E - B A R B A R*

Game ini adalah game bertarung antar sesama anggota grup, berikut adalah alur permainannya :

 ​• Saldo setiap anggota grup punya potensi untuk bisa di ambil oleh anggota lain dengan fitur ini.
 ​• Pemain yang menang akan mendapatkan Saldo dari pemain yang kalah.
 ​• Point yang di tambahkan dan di kurangkan sebesar 1 - 10 persen.
 ​• Point akan terlindungi apabila pemain mempunyai *Guard*, kirim *${prefix}buyguard* untuk membeli guard.
 ​• Sekali proteksi di butuhkan 10 guard, beli guard sebanyak mungkin agar saldo tetap aman.
 ​• Pemain dengan status Elit Global (Premium) bisa membypass guard lawan.
 ​• Untuk bermain silahkan kirim perintah *${prefix}attack*.
 ​• 5 detik / eksekusi, jika spam akan terkena denda sebesar 50%.`
}