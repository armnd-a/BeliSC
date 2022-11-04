const fs = require('fs')
module.exports = async (client, m) => {
   let id = m.chat
   let reward = Func.randomInt(500, 500000)
   let body = typeof m.text == 'string' ? m.text : false
   let _true = fs.readFileSync(`./media/sticker/true.webp`)
   let _false = fs.readFileSync(`./media/sticker/false.webp`)
   if (!m.isGroup) return
   if (!global.db.setting.games && !global.db.groups[m.chat].game) return
   let playScore = 150000
   let ok
   let isWin = !1
   let isTie = !1
   let isSurrender = !1
   client.game = client.game ? client.game : {}
   let room = Object.values(client.game).find(room => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING')
   if (room) {
      if (!/^([1-9]|(me)?nyerah|surr?ender)$/i.test(m.text)) return !0
      isSurrender = !/^[1-9]$/.test(m.text)
      if (m.sender !== room.game.currentTurn) { // nek wayahku
         if (!isSurrender) return !0
      }
      if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
         client.reply(m.chat, {
            '-3': 'Game Over!',
            '-2': 'Invalid',
            '-1': 'Invalid Position!',
            0: 'Invalid Position!',
         } [ok], m)
         return !0
      }
      if (m.sender === room.game.winner) isWin = true
      else if (room.game.board === 511) isTie = true
      let arr = room.game.render().map(v => {
         return {
            X: '❌',
            O: '⭕',
            1: '1️⃣',
            2: '2️⃣',
            3: '3️⃣',
            4: '4️⃣',
            5: '5️⃣',
            6: '6️⃣',
            7: '7️⃣',
            8: '8️⃣',
            9: '9️⃣',
         } [v]
      })
      if (isSurrender) {
         room.game._currentTurn = m.sender === room.game.playerX
         isWin = true
      }
      let winner = isSurrender ? room.game.currentTurn : room.game.winner
      let str = `❏  *T I C T A C T O E*\n\n`
      str += `${arr.slice(0, 3).join('')}\n`
      str += `${arr.slice(3, 6).join('')}\n`
      str += `${arr.slice(6).join('')}\n\n`
      str += `${isWin ? `@${winner.split`@`[0]} Win! (+${Func.formatNumber(reward)} Point)\n\n` : isTie ? `Game over (+${Func.formatNumber(playScore)} Point)\n\n` : `Now it's ${['❌', '⭕'][1 * room.game._currentTurn]} : @${room.game.currentTurn.split`@`[0]} turn!\n\n`}`
      str += `❌ : @${room.game.playerX.split`@`[0]}\n`
      str += `⭕ : @${room.game.playerO.split`@`[0]}\n`
      str += `Send *nyerah* to surrender.\n`
      str += `*Room ID* : ${room.id}`
      let users = global.db.users
      if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat)
         room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat
      if (room.x !== room.o) await client.fakeStory(room.x, str, global.db.setting.header)
      await client.fakeStory(room.o, str, global.db.setting.header)
      if (isTie || isWin) {
         users[room.game.playerX].point += playScore
         users[room.game.playerO].point += playScore
         if (isWin) users[winner].point += reward - playScore
         delete client.game[room.id]
      }
   }

   client.bomb = client.bomb ? client.bomb : {}
   if (!(id in client.bomb) && m.quoted && /kotak/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `Sesi telah berakhir, silahkan kirim _${global.db.setting.multiprefix ? global.db.setting.prefix[0] : global.db.setting.onlyprefix}bomb_ untuk membuat sesi baru.`), m)
   if ((id in client.bomb) && !isNaN(body)) {
      let timeout = 180000
      let json = client.bomb[id][1].find(v => v.position == body)
      if (!json) return client.reply(m.chat, Func.texted('bold', `Untuk membuka kotak kirim angka 1 - 9`), m)
      if (json.emot == '💥') {
         json.state = true
         let bomb = client.bomb[id][1]
         let teks = `❏  *B O M B*\n\n`
         teks += `Duaarrr bangsat!\n\n`
         teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
         teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
         teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
         teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
         teks += `*Permainan selesai!*, kotak berisi bom terbuka : (- *${Func.formatNumber(reward)}*)`
         return client.sendMessageModify(m.chat, teks, m, {
            thumbnail: 'https://telegra.ph/file/287cbe90fe5263682121d.jpg',
            largeThumb: true
         }).then(() => {
            global.db.users[m.sender].point < reward ? global.db.users[m.sender].point = 0 : global.db.users[m.sender].point -= reward
            clearTimeout(client.bomb[id][2])
            delete client.bomb[id]
         })
      } else if (json.state) {
         return client.reply(m.chat, Func.texted('bold', `Kotak ${json.number} sudah di buka silahkan pilih kotak yang lain.`), m)
      } else {
         json.state = true
         let changes = client.bomb[id][1]
         let open = changes.filter(v => v.state && v.emot != '💥').length
         if (open >= 8) {
            let teks = `❏  *B O M B*\n\n`
            teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
            teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
            teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
            teks += `*Permainan selesai!* kotak berisi bom tidak terbuka : (+ *${Func.formatNumber(reward)}*)`
            return client.sendMessageModify(m.chat, teks, m, {
               thumbnail: 'https://telegra.ph/file/308a4f10cc4576a90b4a0.jpg',
               largeThumb: true
            }).then(() => {
               global.db.users[m.sender].point += reward
               clearTimeout(client.bomb[id][2])
               delete client.bomb[id]
            })
         } else {
            let teks = `❏  *B O M B*\n\n`
            teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
            teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
            teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
            teks += `Kotak berisi bom tidak terbuka : (+ *${Func.formatNumber(reward)}*)`
            client.reply(m.chat, teks, m).then(() => {
               global.db.users[m.sender].point += reward
            })
         }
      }
   }

   if (!m.quoted) return

   if (m.quoted && /Sisa|quizclue/i.test(m.quoted.text) && global.db.users[m.sender].point >= 1000) {
      client.quiz = client.quiz ? client.quiz : {}
      if (m.quoted && m.quoted.sender != client.decodeJid(client.user.id)) return
      if (!(id in client.quiz) && /Sisa|quizclue/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `🚩 Soal tersebut telah berakhir, silahkan kirim _${global.db.setting.multiprefix ? global.db.setting.prefix[0] : global.db.setting.onlyprefix}quiz_ untuk mendapatkan soal baru.`), m)
      if (body) {
         let json = JSON.parse(JSON.stringify(client.quiz[id][1]))
         const answer = body.toLowerCase()
         if ((client.quiz[id][3]).includes(answer)) return client.reply(m.chat, `*${answer}* sudah terjawab!\n\nSilahkan cari jawaban lain, denda : *- ${Func.formatNumber(reward)} Rupiah*`, m).then(() => {
            if (reward > users.point) {
               users.point = 0
            } else {
               users.point -= reward
            }
         })
         if (!json.jawaban.includes(answer)) return client.reply(m.chat, `Jawaban mu salah!, *- ${Func.formatNumber(reward)} Rupiah*`, m).then(() => {
            if (reward > users.point) {
               users.point = 0
            } else {
               users.point -= reward
            }
         })
         users.point += reward
         client.quiz[id][3].push(answer)
         if (!client.quiz[id][4][m.sender]) {
            client.quiz[id][4][m.sender] = {
               score: reward,
               answer: 1,
            }
         } else {
            client.quiz[id][4][m.sender].score += reward
            client.quiz[id][4][m.sender].answer += 1
         }
         var clue = ''
         for (let i = 0; i < json.jawaban.length; i++) {
            if (client.quiz[m.chat][3].includes(json.jawaban[i])) {
               clue += '```' + Func.ucword(json.jawaban[i]) + '```\n'
            } else {
               clue += '```' + Func.ucword(json.jawaban[i].replace(/[abcdefghijklmnopqrstuvwxyz]/g, '_')) + '```\n'
            }
         }
         let pop = clue.split('\n')
         pop.pop()
         if (client.quiz[id][3].length == json.jawaban.length) {
            let people = Object.entries(client.quiz[id][4]).sort((a, b) => b[1].score - a[1].score)
            let teks = `❏  *F A M I L Y - 1 0 0*\n\n`
            teks += people.map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '🥈' : i == 2 ? '🥉' : '') + '\n    *Benar* : ' + data.answer + '  –  *Mendapatkan* : ' + Func.formatNumber(data.score)).join('\n')
            teks += `\n\n`
            teks += `❏  *J A W A B A N*\n\n`
            teks += pop.map((v, i) => (i + 1) + '. ' + v).join('\n')
            teks += `\n\nPermainan selesai!, silahkan kirim *.quiz* untuk mendapatkan soal baru`
            return client.reply(m.chat, teks, m).then(() => {
               clearTimeout(client.quiz[id][2])
               delete client.quiz[id]
            })
         } else {
            let people = Object.entries(client.quiz[id][4]).sort((a, b) => b[1].score - a[1].score)
            let teks = `❏  *F A M I L Y - 1 0 0*\n\n`
            teks += people.map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '🥈' : i == 2 ? '🥉' : '') + '\n    *Benar* : ' + data.answer + '  –  *Mendapatkan* : ' + Func.formatNumber(data.score)).join('\n')
            teks += `\n\n`
            teks += `❏  *J A W A B A N*\n\n`
            teks += pop.map((v, i) => (i + 1) + '. ' + v).join('\n')
            teks += `\n\nSisa *${json.jawaban.length - client.quiz[id][3].length}* jawaban belum terjawab.`
            return client.reply(m.chat, teks, m)
         }
      }
   }

   //
   if (m.quoted && /picskip/i.test(m.quoted.text)) {
      client.whatpic = client.whatpic ? client.whatpic : {}
      if (!(id in client.whatpic) && /picskip/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `Ketik ${global.db.setting.multiprefix ? global.db.setting.prefix[0] : global.db.setting.onlyprefix}tebakgambar untuk memulai game baru`), m)
      if (m.quoted.id == client.whatpic[id][0].key.id) {
         let json = JSON.parse(JSON.stringify(client.whatpic[id][1]))
         if (['Timeout', ''].includes(m.text)) return !0
         if (m.text.toLowerCase() == json.jawaban.toLowerCase()) {
            await client.sendSticker(m.chat, _true, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*+ Rp. ${Func.formatNumber(reward)}*`, m)
               global.db.users[m.sender].point += reward
               clearTimeout(client.whatpic[id][3])
               delete client.whatpic[id]
            })
         } else {
            let isPoint = global.db.users[m.sender]
            if (isPoint.point == 0) return client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            })
            isPoint.point < reward ? isPoint.point = 0 : isPoint.point -= reward
            await client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*- Rp. ${Func.formatNumber(reward)}*`, m)
            })
         }
      }
   }

   if (m.quoted && m.quoted.sender != client.user.id.split(':')[0] + '@s.whatsapp.net') return
   if (m.quoted && /Apa hasil dari/i.test(m.quoted.text)) {
      client.math = client.math ? client.math : {}
      if (!(id in client.math) && /^Apa hasil dari/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `Ketik ${global.db.setting.multiprefix ? global.db.setting.prefix[0] : global.db.setting.onlyprefix}math untuk memulai game baru`), m)
      let math = JSON.parse(JSON.stringify(client.math[id][1]))
      if (m.text == math.result) {
         global.db.users[m.sender].point += math.bonus
         clearTimeout(client.math[id][3])
         delete client.math[id]
         await client.sendSticker(m.chat, _true, m, {
            pack: global.db.setting.sk_pack,
            author: global.db.setting.sk_author
         }).then(() => {
            client.reply(m.chat, Func.texted('bold', `+ Rp. ${math.bonus}`), m)
         })
      } else {
         if (--client.math[id][2] == 0) {
            clearTimeout(client.math[id][3])
            delete client.math[id]
            await client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `_Game over because 3x wrong answer, and the answer is_ : *${math.result}*`, m)
            })
         } else await client.sendSticker(m.chat, _false, m, {
            pack: global.db.setting.sk_pack,
            author: global.db.setting.sk_author
         }) // client.reply(m.chat, Func.texted('bold', `${client.math[id][2]} chances to answer.`), m)}
      }
   }

   if (m.quoted && /Siapakah aku?\?/i.test(m.quoted.text)) {
      client.whoami = client.whoami ? client.whoami : {}
      if (!(id in client.whoami) && /Siapakah aku?\?/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `Ketik ${global.db.setting.multiprefix ? global.db.setting.prefix[0] : global.db.setting.onlyprefix}whoami untuk memulai game baru`), m)
      if (m.quoted.id == client.whoami[id][0].id) {
         let json = JSON.parse(JSON.stringify(client.whoami[id][1]))
         if (['Timeout', ''].includes(m.text)) return !0
         if (m.text.toLowerCase() == json.jawaban.toLowerCase()) {
            await client.sendSticker(m.chat, _true, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*+ Rp. ${Func.formatNumber(reward)}*`, m)
               global.db.users[m.sender].point += reward
               clearTimeout(client.whoami[id][3])
               delete client.whoami[id]
            })
         } else {
            let isPoint = global.db.users[m.sender]
            if (isPoint.point == 0) return client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            })
            isPoint.point < reward ? isPoint.point = 0 : isPoint.point -= reward
            await client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*- Rp. ${Func.formatNumber(reward)}*`, m)
            })
         }
      }
   }

   if (m.quoted && /cluedong/i.test(m.quoted.text)) {
      client.caklontong = client.caklontong ? client.caklontong : {}
      if (!(id in client.caklontong) && /cluedong/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `telat lu njirr...`), m)
      if (m.quoted.id == client.caklontong[id][0].id) {
         let json = JSON.parse(JSON.stringify(client.caklontong[id][1]))
         if (['Timeout', ''].includes(m.text)) return !0
         if (m.text.toLowerCase() == json.jawaban.toLowerCase()) {
            await client.sendSticker(m.chat, _true, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*+ Rp. ${Func.formatNumber(reward)}*`, m)
               global.db.users[m.sender].point += reward
               clearTimeout(client.caklontong[id][3])
               delete client.caklontong[id]
            })
         } else {
            let isPoint = global.db.users[m.sender]
            if (isPoint.point == 0) return client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            })
            isPoint.point < reward ? isPoint.point = 0 : isPoint.point -= reward
            await client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*- Rp. ${Func.formatNumber(reward)}*`, m)
            })
         }
      }
   }

   if (m.quoted && /apatuh/i.test(m.quoted.text)) {
      client.tebaktebakan = client.tebaktebakan ? client.tebaktebakan : {}
      if (!(id in client.tebaktebakan) && /apatuh/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `telat lu njirr...`), m)
      if (m.quoted.id == client.tebaktebakan[id][0].id) {
         let json = JSON.parse(JSON.stringify(client.tebaktebakan[id][1]))
         if (['Timeout', ''].includes(m.text)) return !0
         if (m.text.toLowerCase() == json.jawaban.toLowerCase()) {
            await client.sendSticker(m.chat, _true, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*+ Rp. ${Func.formatNumber(reward)}*`, m)
               global.db.users[m.sender].point += reward
               clearTimeout(client.tebaktebakan[id][3])
               delete client.tebaktebakan[id]
            })
         } else {
            let isPoint = global.db.users[m.sender]
            if (isPoint.point == 0) return client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            })
            isPoint.point < reward ? isPoint.point = 0 : isPoint.point -= reward
            await client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*- Rp. ${Func.formatNumber(reward)}*`, m)
            })
         }
      }
   }

   if (m.quoted && /kasihclue/i.test(m.quoted.text)) {
      client.tebaklirik = client.tebaklirik ? client.tebaklirik : {}
      if (!(id in client.tebaklirik) && /kasihclue/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `telat lu njirr...`), m)
      if (m.quoted.id == client.tebaklirik[id][0].id) {
         let json = JSON.parse(JSON.stringify(client.tebaklirik[id][1]))
         if (['Timeout', ''].includes(m.text)) return !0
         if (m.text.toLowerCase() == json.jawaban.toLowerCase()) {
            await client.sendSticker(m.chat, _true, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*+ Rp. ${Func.formatNumber(reward)}*`, m)
               global.db.users[m.sender].point += reward
               clearTimeout(client.tebaklirik[id][3])
               delete client.tebaklirik[id]
            })
         } else {
            let isPoint = global.db.users[m.sender]
            if (isPoint.point == 0) return client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            })
            isPoint.point < reward ? isPoint.point = 0 : isPoint.point -= reward
            await client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*- Rp. ${Func.formatNumber(reward)}*`, m)
            })
         }
      }
   }

   if (m.quoted && /brainwhat/i.test(m.quoted.text)) {
      client.brainout = client.brainout ? client.brainout : {}
      if (!(id in client.brainout) && /brainwhat/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `Ketik ${global.db.setting.multiprefix ? global.db.setting.prefix[0] : global.db.setting.onlyprefix}brainout untuk memulai game baru`), m)
      if (m.quoted.id == client.brainout[id][0].id) {
         let json = JSON.parse(JSON.stringify(client.brainout[id][1]))
         if (['Timeout', ''].includes(m.text)) return !0
         if (m.text.toLowerCase() == json.jawaban.toLowerCase()) {
            await client.sendSticker(m.chat, _true, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*+ Rp. ${Func.formatNumber(reward)}*`, m)
               global.db.users[m.sender].point += reward
               clearTimeout(client.brainout[id][3])
               delete client.brainout[id]
            })
         } else {
            let isPoint = global.db.users[m.sender]
            if (isPoint.point == 0) return client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            })
            isPoint.point < reward ? isPoint.point = 0 : isPoint.point -= reward
            await client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*- Rp. ${Func.formatNumber(reward)}*`, m)
            })
         }
      }
   }

   if (m.quoted && /wordclue/i.test(m.quoted.text)) {
      client.whatword = client.whatword ? client.whatword : {}
      if (!(id in client.whatword) && /wordclue/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `Ketik ${global.db.setting.multiprefix ? global.db.setting.prefix[0] : global.db.setting.onlyprefix}whatword untuk memulai game baru`), m)
      if (m.quoted.id == client.whatword[id][0].id) {
         let json = JSON.parse(JSON.stringify(client.whatword[id][1]))
         if (['Timeout', ''].includes(m.text)) return !0
         if (m.text.toLowerCase() == json.jawaban.toLowerCase()) {
            await client.sendSticker(m.chat, _true, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*+ Rp. ${Func.formatNumber(reward)}*`, m)
               global.db.users[m.sender].point += reward
               clearTimeout(client.whatword[id][3])
               delete client.whatword[id]
            })
         } else {
            let isPoint = global.db.users[m.sender]
            if (isPoint.point == 0) return client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            })
            isPoint.point < reward ? isPoint.point = 0 : isPoint.point -= reward
            await client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*- Rp. ${Func.formatNumber(reward)}*`, m)
            })
         }
      }
   }

   if (m.quoted && /songclue/i.test(m.quoted.text)) {
      client.whatsong = client.whatsong ? client.whatsong : {}
      if (!(id in client.whatsong) && /songclue/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `Ketik ${global.db.setting.multiprefix ? global.db.setting.prefix[0] : global.db.setting.onlyprefix}whatsong untuk memulai game baru`), m)
      if (m.quoted.id == client.whatsong[id][0].id) {
         let json = JSON.parse(JSON.stringify(client.whatsong[id][1]))
         if (['Timeout', ''].includes(m.text)) return !0
         if (m.text.toLowerCase() == json.title.toLowerCase()) {
            await client.sendSticker(m.chat, _true, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*+ Rp. ${Func.formatNumber(reward)}*`, m)
               global.db.users[m.sender].point += reward
               clearTimeout(client.whatsong[id][4])
               delete client.whatsong[id]
            })
         } else {
            let isPoint = global.db.users[m.sender]
            if (isPoint.point == 0) return client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            })
            isPoint.point < reward ? isPoint.point = 0 : isPoint.point -= reward
            await client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*- Rp. ${Func.formatNumber(reward)}*`, m)
            })
         }
      }
   }

   if (m.quoted && /ridskip/i.test(m.quoted.text)) {
      client.riddle = client.riddle ? client.riddle : {}
      if (!(id in client.riddle) && /ridskip/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `Ketik ${global.db.setting.multiprefix ? global.db.setting.prefix[0] : global.db.setting.onlyprefix}riddle untuk memulai game baru`), m)
      if (m.quoted.id == client.riddle[id][0].id) {
         let json = JSON.parse(JSON.stringify(client.riddle[id][1]))
         if (['Timeout', ''].includes(m.text)) return !0
         if (m.text.toLowerCase() == json.jawaban.toLowerCase()) {
            await client.sendSticker(m.chat, _true, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*+ Rp. ${Func.formatNumber(reward)}*`, m)
               global.db.users[m.sender].point += reward
               clearTimeout(client.riddle[id][3])
               delete client.riddle[id]
            })
         } else {
            let isPoint = global.db.users[m.sender]
            if (isPoint.point == 0) return client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            })
            isPoint.point < reward ? isPoint.point = 0 : isPoint.point -= reward
            await client.sendSticker(m.chat, _false, m, {
               pack: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, `*- Rp. ${Func.formatNumber(reward)}*`, m)
            })
         }
      }
   }
}