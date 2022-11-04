const TicTacToe = require('../../system/tictactoe')
exports.run = {
   usage: ['ttt', 'tictactoe', 'tttexit'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Fitur game untuk sementara dinonaktifkan oleh owner`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Fitur game tidak diaktifkan di grup ini.`), m)
      client.game = client.game ? client.game : {}
      if (/tttexit/i.test(command)) {
         delete client.game[Object.values(client.game).find(room => room.state === 'WAITING').id]
         return client.reply(m.chat, `Berhasil keluar dari permainan.`, m)
      } else {
         if (Object.values(client.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) return client.reply(m.chat, `You are still in the game, send *${isPrefix}tttexit* to leave.`, m)
         let room = Object.values(client.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
         if (room) {
            // client.reply(m.chat, `Game started!`, m)
            room.o = m.chat
            room.game.playerO = m.sender
            room.state = 'PLAYING'
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
               }[v]
            })
            let str = `❏  *T I C T A C T O E*\n\n`
			str += `${arr.slice(0, 3).join('')}\n`
			str += `${arr.slice(3, 6).join('')}\n`
			str += `${arr.slice(6).join('')}\n\n`
			str += `Waiting for @${room.game.currentTurn.split('@')[0]} to start!\n`
			str += `Send *nyerah* to surrender.\n`
			str += `*Room ID* : ${room.id}`
            if (room.x !== room.o) await client.fakeStory(room.x, str, global.db.setting.header)
            await client.fakeStory(room.o, str, global.db.setting.header)
         } else {
            room = {
               id: 'tictactoe-' + (+new Date),
               x: m.chat,
               o: '',
               game: new TicTacToe(m.sender, 'o'),
               state: 'WAITING'
            }
            if (text) room.name = text
            client.reply(m.chat, '_Waiting for partner_' + (text ? ' _send the command_ *' + isPrefix + command + ' ' + text + '*' : ''), m)
            client.game[room.id] = room
         }
      }
   },
   error: false,
   group: true,
   cache: true,
   location: __filename
}