exports.run = {
   usage: ['bcgc', 'bctag', 'bcm'],
   async: async (m, {
      client,
      text,
      command
   }) => {
      if (command == 'bcgc') {
            if (!m.quoted) return client.reply(m.chat, Func.texted('bold', `Reply Message.`), m)
            let group = await (await client.groupList()).map(v => v.id)
            let buttons = [{
               urlButton: {
                  displayText: `sewa bot`,
                  url: `http://nxr.my.id/HHFOR`
               }
            }]
            if (/image/.test(m.quoted.mtype)) {
               let media = await m.quoted.download()
               for (let i = 0; i < group.length; i++) {
                  if (!global.groups[group[i]].mute) {
                     await client.sendTemplateButton(group[i], media, m.quoted.text ? '乂  *B R O A D C A S T*\n\n' + m.quoted.text : '', '', buttons)
                     await Func.delay(1500)
                  }
               }
               client.reply(m.chat, Func.texted('bold', `Successfully send a message with template into ${group.length} groups.`), m)
            } else if (/video/.test(m.quoted.mtype)) {
               let media = await m.quoted.download()
               for (let i = 0; i < group.length; i++) {
                  if (!global.groups[group[i]].mute) {
                     await client.sendTemplateButton(group[i], media, m.quoted.text ? '乂  *B R O A D C A S T*\n\n' + m.quoted.text : '', '', buttons)
                     await Func.delay(1500)
                  }
               }
               client.reply(m.chat, Func.texted('bold', `Successfully send a message with template into ${group.length} groups.`), m)
            } else if (/conversation|extendedTextMessage/.test(m.quoted.mtype)) {
               for (let i = 0; i < group.length; i++) {
                  if (!global.groups[group[i]].mute) {
                     await client.sendTemplateButton(group[i], global.setting.cover, '\n' + m.quoted.text, '', buttons, {
                        document: true,
                        name: 'BROADCAST 🎉🎉🎉'
                     })
                     await Func.delay(1500)
                  }
               }
               client.reply(m.chat, Func.texted('bold', `Successfully send a message with template into ${group.length} groups.`), m)
            } else {
               for (let i = 0; i < group.length; i++) {
                  if (!global.groups[group[i]].mute) {
                     client.copyNForward(group[i], m.quoted.fakeObj)
                     await Func.delay(1500)
                  }
               }
               client.reply(m.chat, Func.texted('bold', `Successfully send a message into ${group.length} groups.`), m)
            }
         } else if (command == 'bctag') {
            if (!text) return client.reply(m.chat, `Where the message?`, m)
            let group = await (await client.groupList()).map(v => v.id)
            for (let i = 0; i < group.length; i++) {
               if (!global.groups[group[i]].mute) {
                  let member = await (await client.groupMetadata(group[i])).participants.map(v => v.id)
                  await client.reply(group[i], '乂  *B R O A D C A S T*\n\n' + text, null, {
                     contextInfo: {
                        mentionedJid: member
                     }
                  })
                  await Func.delay(1500)
               }
            }
            client.reply(m.chat, Func.texted('bold', `Successfully send a message with hidetag into ${group.length} groups.`), m)
         } else if (command == 'bcm') {
            if (!m.quoted) return client.reply(m.chat, Func.texted('bold', `Reply media message.`), m)
            if (!/image|video/.test(m.quoted.mtype)) client.reply(m.chat, Func.texted('bold', `Only for image and video message.`), m)
            let media = await m.quoted.download()
            let group = await (await client.groupList()).map(v => v.id)
            for (let i = 0; i < group.length; i++) {
               if (!global.groups[group[i]].mute) {
                  let member = await (await client.groupMetadata(group[i])).participants.map(v => v.id)
                  await client.sendFile(group[i], media, '', m.quoted.text ? '乂  *B R O A D C A S T*\n\n' + m.quoted.text : '', null, null, {
                     contextInfo: {
                        mentionedJid: member
                     }
                  })
                  await Func.delay(1500)
               }
            }
            client.reply(m.chat, Func.texted('bold', `Successfully send a message with hidetag into ${group.length} groups.`), m)
   }
   },
   owner: true
}