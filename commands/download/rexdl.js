exports.run = {
   usage: ['apk'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'whatsapp'), m)
         client.reply(m.chat, global.status.getdata, m)
         let json = await Api.rexdl(text)
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         if (text.match('rexdl.com')) {
            let teks = `❏  *P L A Y - S T O R E*\n\n`
            teks += '	◦  *Name* : ' + json.name + '\n'
            teks += '	◦  *Version* : ' + json.version + '\n'
            teks += '	◦  *Size* : ' + json.size + '\n'
            teks += '	◦  *Total File* : ' + json.data.length + '\n'
            teks += '	◦  *Updated* : ' + json.update + '\n\n'
            teks += global.db.setting.footer
            client.sendFile(m.chat, json.thumb, 'images.png', teks, m).then(async () => {
               json.data.map(async v => {
                  client.sendFile(m.chat, v.url, v.filename, '', m)
                  await Func.delay(1000)
               })
            })
         } else {
            let rows = []
            json.data.map(async (v, i) => {
               rows.push({
                  title: v.name,
                  rowId: `${isPrefix + command} ${v.url}`,
                  description: `[ ${v.category} | Publish : ${v.publish} ]`
               })
            })
            client.sendList(m.chat, '', `hasil pencarian : ${text}, Download Apps & Games Android · HOME · Aplikasi · Game · Tools ·`, '', 'Lihat semua!', rows, m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   cache: true,
   premium: true,
   limit: true,
   location: __filename
}