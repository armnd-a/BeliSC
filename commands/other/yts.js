const yts = require('yt-search')
exports.run = {
   usage: ['yts', 'ytfind', 'ytsearch'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      isOwner
   }) => {
      try {
         if (!text) return client.reply(m.chat, `• ${Func.texted('bold', `Example`)} : ${isPrefix + command} lathi`, m)
         if (!isOwner && text.match(/(bugil|bokep|hentai|sex|desah)/gi)) {
            client.updateBlockStatus(m.sender, 'block')
            let user = global.db.users
            user[m.sender].banned = true
            let banned = 0
            for (let jid in user) {
               if (user[jid].banned) banned++
            }
            return client.reply(m.chat, `“${text}”\n\nKata kunci tidak diperbolehkan, gunakan bot ini untuk hal-hal positif! dan sekarang nomor Anda telah *banned* dan *blocked.*\n\njika Anda ingin *unban* bayar 5k, kirim ke *${isPrefix}owner*`, m)
         }
         let yt = await (await yts(text)).all
         if (yt.length == 0) return client.reply(m.chat, global.status.fail, m)
         let music = [],
            video = []
         yt.map(v => {
            music.push({
               views: v.views,
               title: v.title,
               rowId: `${isPrefix}yta ${v.url}`,
               description: `🥀 MUSIC | Durasi : ${v.timestamp} | Dilihat : ${Func.simpFormat(Func.formatNumber(v.views))}`
            })
            video.push({
               views: v.views,
               title: v.title,
               rowId: `${isPrefix}ytv ${v.url}`,
               description: `🎬 ️VIDEO | Durasi : ${v.timestamp} | Dilihat : ${Func.simpFormat(Func.formatNumber(v.views))}`
            })
         })
         let rows = music.concat(video).sort((a, b) => b.views - a.views)
         client.sendList(m.chat, '', `Hasil pencarian untuk ${text}\n\nsilahkan pilih dibawah ini ada video/music yang anda inginkan`, ' 🥀 MUSIC / 🎬 VIDEO', 'Lihat!', rows, m)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   cache: true,
   location: __filename
}