exports.run = {
   usage: ['githubstalk', 'ghstalk'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'melbot'), m)
         client.reply(m.chat, global.status.getdata, m)
         let json = await Func.ghstalk(args[0])
         if (!json.status) return client.reply(m.chat, Func.texted('bold', `Harap masukin username dengan benar dek!`), m)
         let caption = `❏  *G I T H U B - U S E R*\n\n`
         caption += `	◦  *Name* : ${json.data.name}\n`
         caption += `	◦  *Username* : ${json.data.login}\n`
         caption += `	◦  *Company* : ${json.data.company || '-'}\n`
         caption += `	◦  *Blog* : ${json.data.blog || '-'}\n`
         caption += `	◦  *Location* : ${json.data.location || '-'}\n`
         caption += `	◦  *Gist* : ${json.data.public_gists}\n`
         caption += `	◦  *Repo* : ${json.data.public_repos}\n`
         caption += `	◦  *Diikuti* : ${json.data.followers}\n`
         caption += `	◦  *Mengikuti* : ${json.data.following}\n`
         caption += `	◦  *Bio* : ${json.data.bio}\n\n`
         caption += global.db.setting.footer
         client.sendMessageModify(m.chat, caption, m, {
            title: 'G I T H U B - S T A L K',
            largeThumb: true,
            thumbnail: await Func.fetchBuffer(json.data.avatar_url)
            })
      } catch {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   cache: true,
   location: __filename
}