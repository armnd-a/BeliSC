exports.run = {
   usage: ['acc', 'reject', 'batu', 'gunting', 'kertas'],
   async: async (m, {
      client,
      isPrefix,
      command
   }) => {
      try {
         client.suit = client.suit ? client.suit : {}
         let room = Object.values(client.suit).find(room => room.id && room.status && [room.p, room.p2].includes(m.sender))
         if (room) {
            let win = ''
            let tie = false
            if (m.sender == room.p2 && /(acc|reject)/.test(command) && m.isGroup && room.status == 'wait') {
               if (command == 'reject') {
                  client.reply(m.chat, Func.texted('bold', `@${room.p2.split`@`[0]} menolak tantangan bermain suit, suit dibatalkan`), m)
                  delete client.suit[room.id]
                  return !0
               }
               room.status = 'play'
               room.asal = m.chat
               clearTimeout(room.waktu)
               let teks = `Suit telah dikirimkan ke chat @${room.p.split`@`[0]} dan @${room.p2.split`@`[0]}. Silahkan pilih suit dichat masing².`
               client.reply(m.chat, Func.texted('bold', teks), m)
               let buttons = [{
                  buttonId: `${isPrefix}batu`,
                  buttonText: {
                     displayText: 'Batu ✊'
                  },
                  type: 1
               }, {
                  buttonId: `${isPrefix}gunting`,
                  buttonText: {
                     displayText: 'Gunting ✌️'
                  },
                  type: 1
               }, {
                  buttonId: `${isPrefix}kertas`,
                  buttonText: {
                     displayText: 'Kertas 🤚'
                  },
                  type: 1
               }]
               let infos = `Apabila menang akan mendapat *+${Func.formatNumber(room.poin)} Rupiah* dan apabila kalah Saldo mu dikurangi sebesar *-${Func.formatNumber(room.poin_lose)} Rupiah*`
               if (!room.pilih) client.sendButtonText(room.p, infos, '', buttons)
               if (!room.pilih2) client.sendButtonText(room.p2, infos, '', buttons)
               room.waktu_milih = setTimeout(() => {
                  if (!room.pilih && !room.pilih2) client.reply(m.chat, Func.texted('bold', `Sesi game Suit telah dihapus karena terlalu lama tidak ada aktivitas.`))
                  else if (!room.pilih || !room.pilih2) {
                     win = !room.pilih ? room.p2 : room.p
                     client.reply(m.chat, Func.texted('bold', `@${(room.pilih ? room.p2 : room.p).split`@`[0]} tidak memilih suit, game berakhir.`))
                     global.db.users[win == room.p ? room.p : room.p2].exp += room.poin
                     global.db.users[win == room.p ? room.p2 : room.p].exp -= room.poin_lose
                  }
                  delete client.suit[room.id]
                  return !0
               }, room.timeout)
            }
            let jwb = m.sender == room.p
            let jwb2 = m.sender == room.p2
            let g = /gunting/i
            let b = /batu/i
            let k = /kertas/i
            let reg = /(gunting|batu|kertas)/i
            if (jwb && reg.test(command) && !room.pilih && !m.isGroup) {
               room.pilih = reg.exec(command.toLowerCase())[0]
               room.text = command
               client.reply(m.chat, Func.texted('bold', `Kamu telah memilih ${command}${!room.pilih2 ? `, silahkan tunggu lawan memilih suit.` : ''}`), m)
               if (!room.pilih2) client.reply(room.p2, Func.texted('bold', `Lawan sudah memilih suit sekarang giliranmu memilih suit.`))
            }
            if (jwb2 && reg.test(m.text) && !room.pilih2 && !m.isGroup) {
               room.pilih2 = reg.exec(command.toLowerCase())[0]
               room.text2 = command
               client.reply(m.chat, Func.texted('bold', `Kamu telah memilih ${command}${!room.pilih ? `, silahkan tunggu lawan memilih suit.` : ''}`), m)
               if (!room.pilih) client.reply(room.p, Func.texted('bold', `Lawan sudah memilih suit sekarang giliranmu memilih suit.`))
            }
            let stage = room.pilih
            let stage2 = room.pilih2
            if (room.pilih && room.pilih2) {
               clearTimeout(room.waktu_milih)
               if (b.test(stage) && g.test(stage2)) win = room.p
               else if (b.test(stage) && k.test(stage2)) win = room.p2
               else if (g.test(stage) && k.test(stage2)) win = room.p
               else if (g.test(stage) && b.test(stage2)) win = room.p2
               else if (k.test(stage) && b.test(stage2)) win = room.p
               else if (k.test(stage) && g.test(stage2)) win = room.p2
               else if (stage == stage2) tie = true
               let teks = `❏  *S U I T (PVP)*\n\n`
               teks += `Status : *${tie ? 'Draw!' : 'Normal!'}*\n\n`
               teks += `@${room.p.split`@`[0]} (${room.text}) ${tie ? '' : room.p == win ? `Menang [ *Rp. +${room.poin}* ]` : `Kalah [ *Rp. -${room.poin_lose}* ]`}\n`
               teks += `@${room.p2.split`@`[0]} (${room.text2}) ${tie ? '' : room.p2 == win ? `Menang [ *Rp. +${room.poin}* ]` : `Kalah [ *Rp. -${room.poin_lose}* ]`}`
               client.reply(room.asal, teks, m, {
                  mentions: [room.p, room.p2]
               })
               if (!tie) {
                  global.db.users[win == room.p ? room.p : room.p2].point += room.poin
                  global.db.users[win == room.p ? room.p2 : room.p].point -= room.poin_lose
               }
               delete client.suit[room.id]
            }
         }
      } catch (e) {
         client.reply(m.chat, Func.jsonFormat(e.message), m)
      }
   },
   error: false,
   game: true,
   cache: true,
   location: __filename
}