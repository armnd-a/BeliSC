exports.run = {
   usage: ['igstalk'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'chyangrhaa'), m)
         client.reply(m.chat, global.status.getdata, m)
         let json = await Api.igstalk(args[0])
         if (!json.status) return client.reply(m.chat, Func.texted('bold', `Harap ketik username dengan benar kak!`), m)
         let caption = `	◦  *Nama* : ${json.data.name}*\n`
         caption += `	◦  *Username* : ${json.data.username}\n`
         caption += `	◦  *Postingan* : ${json.data.post}\n`
         caption += `	◦  *Diikuti* : ${json.data.follower}\n`
         caption += `	◦  *Mengikuti* : ${json.data.following}\n`
         caption += `	◦  *Bio* : ${json.data.about}\n`
         caption += `	◦  *Akun private* : ${Func.switcher(json.data.private, 'di private', 'tidak di private')}\n\n`
         caption += global.db.setting.footer
         client.sendMessageModify(m.chat, caption, m, {
            title: '❏  I N S T A G R A M - S T A L K',
            largeThumb: true,
            thumbnail: await Func.fetchBuffer(json.data.photo)
            })
      } catch {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: 5,
   cache: true,
   location: __filename
}