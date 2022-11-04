exports.run = {
   usage: ['gc', 'modify'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return
         if (command == 'gc') {
            let jid = args[0]
            let rows = [{
               title: 'sewa 1 hari',
               rowId: `${isPrefix}modify ${jid} 1D`,
               description: `Rp. 2.000`
            }, {
               title: 'sewa 1 minggu',
               rowId: `${isPrefix}modify ${jid} 7D`,
               description: `Rp. 5.000`
            }, {
               title: 'sewa 1 bulan',
               rowId: `${isPrefix}modify ${jid} 30D`,
               description: `Rp. 10.000`
            }, {
               title: 'sewa permanen',
               rowId: `${isPrefix}modify ${jid} 1`,
               description: `Rp. 25.000`
            }, {
               title: 'dapatkan link',
               rowId: `${isPrefix}modify ${jid} 2`,
               description: `mendapatkan link group`
            }, {
               title: 'keluar',
               rowId: `${isPrefix}modify ${jid} 3`,
               description: `mengeluarkan bot`
            }, {
               title: 'mute',
               rowId: `${isPrefix}modify ${jid} 4`,
               description: `mematikan bot di group`
            }, {
               title: 'unmute',
               rowId: `${isPrefix}modify ${jid} 5`,
               description: `menghidupkan bot di group`
            }, {
               title: 'tutup',
               rowId: `${isPrefix}modify ${jid} 6`,
               description: `untuk menutup group`
            }, {
               title: 'buka',
               rowId: `${isPrefix}modify ${jid} 7`,
               description: `untuk membuka group`
            }, {
               title: 'info',
               rowId: `${isPrefix}modify ${jid} 8`,
               description: `mendapatkan info group`
            }, {
               title: 'reset',
               rowId: `${isPrefix}modify ${jid} 9`,
               description: `reset expired group`
            }]
            client.sendList(m.chat, '', `Pilih set untuk ${await (await client.groupMetadata(jid)).subject}`, '', 'tampilkan!', rows, m)
         } else if (command == 'modify') {
            if (!args[1]) return
            let jid = args[0]
            let dial = args[1]
            let groupMetadata = await (await client.groupMetadata(jid))
            let groupName = groupMetadata.subject
            let adminList = await client.groupAdmin(jid)
            let admin = adminList.includes((client.user.id.split`:` [0]) + '@s.whatsapp.net')
            let now = new Date() * 1
            if (/1D|7D|30D/.test(dial)) {
               let day = 86400000 * parseInt(dial.replace('D', ''))
               global.db.groups[jid].expired = now + day
               global.db.groups[jid].stay = false
               return client.reply(m.chat, Func.texted('bold', `❏ EXPIRED GROUP*\n\n*Berhasil menetapkan selama ${dial.replace('D', ' hari')} di group ${groupName}.`), m)
            } else if (dial == 1) {
               global.db.groups[jid].expired = 0
               global.db.groups[jid].stay = true
               return client.reply(m.chat, Func.texted('bold', `❏ EXPIRED GROUP*\n\nBerhasil menetapkan *PERMANEN* digroup *${groupName}.`), m)
            } else if (dial == 2) {
               if (!admin) return client.reply(m.chat, Func.texted('bold', `❏ G E T - L I N K*\n\nGagal mendapatkan link group ${groupName} karena bot bukan *admin`), m)
               client.reply(m.chat, 'https://chat.whatsapp.com/' + (await client.groupInviteCode(jid)), m)
            } else if (dial == 3) {
               await client.reply(jid, Func.texted('bold', `🌤️ Bot diperintahkan keluar oleh Owner`)).then(() => {
                  client.groupLeave(jid).then(() => {
                     global.db.groups[jid].expired = 0
                     global.db.groups[jid].stay = false
                     return client.reply(m.chat, Func.texted('bold', `📢 Berhasil keluar dari grup ${groupName}.`), m)
                  })
               })
            } else if (dial == 4) {
               global.db.groups[jid].mute = true
               client.reply(m.chat, Func.texted('bold', `📢 Bot berhasil di mute di grup ${groupName}.`), m)
            } else if (dial == 5) {
               global.db.groups[jid].mute = false
               client.reply(m.chat, Func.texted('bold', `📢 Bot berhasil di unmute di grup ${groupName}.`), m)
            } else if (dial == 6) {
               if (!admin) return client.reply(m.chat, Func.texted('bold', `📢 Tidak bisa menutup grup ${groupName} karena bot bukan admin.`), m)
               client.groupSettingUpdate(jid, 'announcement').then(() => {
                  client.reply(jid, Func.texted('bold', `📢 Grup telah di tutup oleh bot.`)).then(() => {
                     client.reply(m.chat, Func.texted('bold', `📢 Berhasil menutup grup ${groupName}.`), m)
                  })
               })
            } else if (dial == 7) {
               if (!admin) return client.reply(m.chat, Func.texted('bold', `📢 Tidak bisa membuka grup ${groupName} karena bot bukan admin.`), m)
               client.groupSettingUpdate(jid, 'not_announcement').then(() => {
                  client.reply(jid, Func.texted('bold', `📢 Grup telah di buka kembali oleh bot.`)).then(() => {
                     client.reply(m.chat, Func.texted('bold', `📢 Berhasil membuka grup ${groupName}.`), m)
                  })
               })
            } else if (dial == 8) {
               let set = global.db.groups[jid]
               let time = set.stay ? 'PERMANEN' : (set.expired == 0 ? '-' : Func.timeReverse(set.expired - new Date() * 1))
               let member = groupMetadata.participants.map(u => u.id).length
               let pic = await client.profilePictureUrl(jid, 'image')
               let data = {
                  name: groupName,
                  member,
                  time,
                  set,
                  admin
               }
               return client.sendMessageModify(m.chat, pic, steal(data) + '\n\n' + global.db.setting.footer, m, {
            largeThumb: true,
            thumbnail: pic
            })
            } else if (dial == 9) {
               global.db.groups[jid].expired = 0
               global.db.groups[jid].stay = false
               client.reply(m.chat, Func.texted('bold', `⏰ Durasi bot di dalam grup ${groupName} berhasil di reset.`), m)
            }
         }
      } catch (e) {
         console.log(e)
      }
   },
   owner: true,
   cache: true,
   location: __filename
}

const steal = (data) => {
   return `❏  *G R O U P - S T A L K*

	›  *Name* : ${data.name}
	›  *Member* : ${data.member}
	›  *Expired* : ${data.time}
	›  *Status* : ${Func.switcher(data.set.mute, 'OFF', 'ON')}
	›  *Bot Admin* : ${Func.switcher(data.admin, 'iya', 'tidak')}`
}