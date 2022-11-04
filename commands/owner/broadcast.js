exports.run = {
   usage: ['bcgc', 'bctag', 'bcm'],
   async: async (m, {
      client,
      text,
      command
   }) => {
      if (command == 'bcgc') {
         if (!m.quoted) return client.reply(m.chat, Func.texted('bold', `Reply pesan nya kak.`), m)
         let group = await (await client.groupList()).map(v => v.id)
         let buttons = [{
            urlButton: {
               displayText: `sewa bot`,
               url: `https://wa.me/62882002088799?text=topup+bang`
            }
         }]
         if (/image/.test(m.quoted.mtype)) {
            let media = await m.quoted.download()
            for (let i = 0; i < group.length; i++) {
               if (!global.db.groups[group[i]].mute) {
                  await client.sendTemplateButton(group[i], media, m.quoted.text ? '❏  *B R O A D C A S T*\n\n' + m.quoted.text : '', '', buttons)
                  await Func.delay(1500)
               }
            }
            client.reply(m.chat, Func.texted('bold', `Berhasil terkirim ke ${group.length} groups.`), m)
         } else if (/video/.test(m.quoted.mtype)) {
            let media = await m.quoted.download()
            for (let i = 0; i < group.length; i++) {
               if (!global.db.groups[group[i]].mute) {
                  await client.sendTemplateButton(group[i], media, m.quoted.text ? '❏  *B R O A D C A S T*\n\n' + m.quoted.text : '', '', buttons)
                  await Func.delay(1500)
               }
            }
            client.reply(m.chat, Func.texted('bold', `Berhasil terkirim ke ${group.length} groups.`), m)
         } else if (/conversation|extendedTextMessage/.test(m.quoted.mtype)) {
            for (let i = 0; i < group.length; i++) {
               if (!global.db.groups[group[i]].mute) {
                  await client.sendTemplateButton(group[i], global.db.setting.cover, '\n' + m.quoted.text, '', buttons, {
                     document: true,
                     name: 'BROADCAST 🎉🎉🎉'
                  })
                  await Func.delay(1500)
               }
            }
            client.reply(m.chat, Func.texted('bold', `Berhasil terkirim ke ${group.length} groups.`), m)
         } else {
            for (let i = 0; i < group.length; i++) {
               if (!global.db.groups[group[i]].mute) {
                  client.copyNForward(group[i], m.quoted.fakeObj)
                  await Func.delay(1500)
               }
            }
            client.reply(m.chat, Func.texted('bold', `Berhasil terkirim ke ${group.length} groups.`), m)
         }
      } else if (command == 'bctag') {
         if (!text) return client.reply(m.chat, `Dimana pesannya?`, m)
         let group = await (await client.groupList()).map(v => v.id)
         for (let i = 0; i < group.length; i++) {
            if (!global.db.groups[group[i]].mute) {
               let member = await (await client.groupMetadata(group[i])).participants.map(v => v.id)
               await client.reply(group[i], '❏  *B R O A D C A S T*\n\n' + text, null, {
                  contextInfo: {
                     mentionedJid: member
                  }
               })
               await Func.delay(1500)
            }
         }
         client.reply(m.chat, Func.texted('bold', `Berhasil terkirim ke ${group.length} groups.`), m)
      } else if (command == 'bcm') {
         if (!m.quoted) return client.reply(m.chat, Func.texted('bold', `Reply pesan media.`), m)
         if (!/image|video/.test(m.quoted.mtype)) client.reply(m.chat, Func.texted('bold', `Hanya untuk pesan image dan video.`), m)
         let media = await m.quoted.download()
         let group = await (await client.groupList()).map(v => v.id)
         for (let i = 0; i < group.length; i++) {
            if (!global.db.groups[group[i]].mute) {
               let member = await (await client.groupMetadata(group[i])).participants.map(v => v.id)
               await client.sendFile(group[i], media, '', m.quoted.text ? '❏  *B R O A D C A S T*\n\n' + m.quoted.text : '', null, null, {
                  contextInfo: {
                     mentionedJid: member
                  }
               })
               await Func.delay(1500)
            }
         }
         client.reply(m.chat, Func.texted('bold', `Berhasil terkirim ke ${group.length} groups.`), m)
      }
   },
   owner: true
}