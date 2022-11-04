const google = require('googlethis')
exports.run = {
   usage: ['google'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      isOwner
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, `nodejs tutorial`), m)
         if (!isOwner && text.match(/(bugil|bokep|hentai|sex|desah)/gi)) {
            client.updateBlockStatus(m.sender, 'block')
            let user = global.db.users
            user[m.sender].banned = true
            let banned = 0
            for (let jid in user) {
               if (user[jid].banned) banned++
            }
            return client.reply(m.chat, `“${text}”\n\nKata kata itu membuat kami semangat untuk membanned nya 😻\n\nJika kamu ingin *unban* dan *unblock* bayar dengan harga 5k, ketik *${isPrefix}owner*`, m)
         }
         const options = {
            page: 0,
            safe: false,
            additional_params: {
               hl: 'en'
            }
         }
         client.reply(m.chat, global.status.getdata, m)
         let json = await google.search(text, options)
         if (json.results.length == 0) return client.reply(m.chat, global.status.fail, m)
         let teks = `*Hasil pencarian...*\n\n`
         json.results.map((v, i) => {
            teks += '*' + (i + 1) + '. ' + v.title + '*\n'
            teks += '	◦  *Snippet* : ' + v.description + '\n'
            teks += '	◦  *Link* : ' + v.url + '\n\n'
         })
         client.sendMessageModify(m.chat, teks, m, {
            title: 'G O O G L E - S E A R C H',
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/fdc3e9526c8b95e962e5e.jpg')
            })         
      } catch (e) {
         return client.reply(m.chat, require('util').format(e), m)
      }
   },
   error: false
}