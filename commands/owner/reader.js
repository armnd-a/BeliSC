const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
exports.run = {
   usage: ['reader', 'dibaca'],
   async: async (m, {
      client
   }) => {
      try {
         if (!m.quoted) return client.reply(m.chat, Func.texted('bold', `Reply pesan bot`), m)
         if (client.decodeJid(client.user.id) != m.quoted.sender) return client.reply(m.chat, Func.texted('bold', `Reply pesan melbot`), m)
         const msg = await m.quoted.info()
         if (msg.userReceipt.length == 0) return client.reply(m.chat, Func.texted('bold', `Tidak terdeteksi telah dibaca`), m)
         let text = '*PESAN*\n\n'
         msg.userReceipt.map(v => {
        	let read = v.readTimestamp
			let unread = v.receiptTimestamp
			let time = typeof read != 'undefined' ? read : unread
		    text += `	• @${v.userJid.replace(/@.+/, '')}\n`
			text += `	• Waktu : ${moment(time * 1000).format('DD/MM/YY HH:mm:ss')}\n`
			text += `	• Status : *${typeof read != 'undefined' ? 'Dibaca' : 'Diterima'}*\n`    
         }).join('\n')
         text += '\n' + global.db.setting.footer
         client.fakeStory(m.chat, text.trim(), global.db.setting.header)
      } catch (e) {
         client.reply(m.chat, Func.texted('bold', `Tidak dapat memuat pesan`), m)
      }
   },
   error: false,
   group: true,
   cache: true,
   location: __filename
}