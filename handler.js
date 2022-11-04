const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
module.exports = async (client, m, chatUpdate) => {
   try {
      require('./system/database')(m)
      const isOwner = [client.user.id, global.owner, ...global.db.setting.owners].map(v => v + '@s.whatsapp.net').includes(m.sender)
      const isMod = global.db.setting.mods.map(v => v + '@s.whatsapp.net').includes(m.sender) || isOwner
      const isVip = (typeof global.db.users[m.sender] != 'undefined' && global.db.users[m.sender].vip) || isOwner
      const isPrem = (typeof global.db.users[m.sender] != 'undefined' && global.db.users[m.sender].premium) || isVip || isOwner
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat) : {}
      const participants = m.isGroup ? groupMetadata.participants : [] || []
      const adminList = m.isGroup ? await client.groupAdmin(m.chat) : [] || []
      const isAdmin = m.isGroup ? adminList.includes(m.sender) : false
      const isBotAdmin = m.isGroup ? adminList.includes((client.user.id.split`:` [0]) + '@s.whatsapp.net') : false
      const groupSet = global.db.groups[m.chat],
         users = global.db.users[m.sender],
         chats = global.db.chats[m.chat],
         setting = global.db.setting
      require('./system/exec')(client, m, isOwner)
      await client.readMessages([m.key])
      if (m.fromMe && /audio|video|sticker|image|document/.test(m.mtype)) global.db.setting.uploadSize += m.msg.fileLength.low
      if (!m.fromMe && /audio|video|sticker|image|document/.test(m.mtype)) global.db.setting.receiveSize += m.msg.fileLength.low
      if (m.isGroup) groupSet.activity = new Date() * 1
      typeof users != 'undefined' ? users.lastseen = new Date() * 1 : ''
      if (typeof chats != 'undefined') chats.lastseen = new Date() * 1, chats.chat += 1
      if (m.isGroup && !m.fromMe) {
         let now = new Date() * 1
         if (typeof groupSet.member[m.sender] == 'undefined') {
            groupSet.member[m.sender] = {
               lastseen: now,
               warning: 0,
               whitelist: false,
            }
         } else {
            groupSet.member[m.sender].lastseen = now
         }
      }
      if (m.isBot || m.chat.endsWith('broadcast') || users.banTemp != 0) return
      if (m.isGroup && !isBotAdmin && groupSet.localonly) groupSet.localonly = false
      if (m.isGroup && !isBotAdmin && groupSet.spamProtect) groupSet.spamProtect = false
      if (m.isGroup && !groupSet.stay && (new Date * 1) >= groupSet.expired && groupSet.expired != 0) {
         return client.reply(m.chat, Func.texted('bold', `Masa aktif bot di grup ini sudah habis, saatnya bot keluar dari grup.`)).then(async () => {
            groupSet.expired = 0
            await Func.delay(2000).then(() => client.groupLeave(m.chat))
         })
      }
      if (!m.fromMe && (new Date * 1) >= users.expired && users.expired != 0 && users.premium) {
         return client.reply(m.sender, Func.texted('bold', `Paket premium Anda telah habis, terima kasih telah membeli premium.`), m).then(() => {
            users.expired = 0
            users.premium = false
         })
      }
      setInterval(async () => {
         let day = 86400000 * 1,
            now = new Date() * 1
         for (let jid in global.db.chats) {
            if (now - global.db.chats[jid].lastseen > day) delete global.db.chats[jid]
         }
         if (m.isGroup) {
            let member = participants.map(v => v.id)
            Object.entries(groupSet.member).map(([v, x]) => {
               if (!member.includes(v)) delete groupSet.member[v]
            })
         }
      }, 3000)
      let getPrefix = (typeof m.text != 'object') ? m.text.trim().split('\n')[0].split(' ')[0] : ''
      if (setting.multiprefix ? setting.prefix.includes(getPrefix.slice(0, 1)) : setting.onlyprefix == getPrefix.slice(0, 1)) {
         var myPrefix = getPrefix.slice(0, 1)
      }
      if (!/afk/.test(m.text) && m.isGroup) {
         if (users.afk > -1) {
            client.sendMessageModify(m.chat, `Kamu kembali online, setelah afk selama ${Func.texted('bold', Func.toTime(new Date - users.afk))}\n\n• ${Func.texted('bold', 'Alasan')} : ${users.afkReason ? users.afkReason : 'tanpa alasan'}`, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/1516cce7b073923f3a581.jpg')
            })
            users.afk = -1
            users.afkReason = ''
         }
      }
      if (!m.fromMe && !m.isGroup && !users.banned) {
         if (setting.groupmode && !isOwner && !isPrem) {
            if (!users.whitelist && m.text && (m.text.charAt(0) == myPrefix || Func.socmed(m.text)) && !/owner|premium|sewabot|batu|gunting|kertas/.test(m.text)) return client.sendMessageModify(m.chat, Func.texted('bold', `bot sedang dalam mode : khusus group*\n\nTidak bisa menggunakan bot di pesan pribadi\njika kamu ingin menggunakan di pesan pribadi\n*silahkan upgrade premium hanya 10rb*\nSilahkan ketik *.owner / .premium`), m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/73cb2b865ab3beef12bf1.jpg'),
            url: 'https://chat.whatsapp.com/EARvthLENgw2yxhDUKDuMr'
         })            
         }
         if (m.msg && m.msg.type == 0) {
            const copy = await client.deleteObj(m, client)
            if (m.isGroup && groupSet.antidelete) {
               if (copy) {
                  client.reply(m.chat, Func.texted('bold', `💀 Anti delete ...`), m).then(async () => {
                     await client.copyNForward(m.chat, copy)
                  })
               }
            }
         }
         require('./system/logs')(client, m, myPrefix)
         if (typeof m.text != 'object' && m.text.startsWith(myPrefix)) {
            if (typeof users != 'undefined') users.point += Func.randomInt(100, 55000)
            users.hit += 1
            users.usebot = new Date() * 1
            if (!isOwner) {
               if (new Date() * 1 - chats.command > 5000) { // < 5s per-command
                  chats.command = new Date() * 1
               } else {
                  if (!m.fromMe) return
               }
            }
         }
      }
      if (((m.isGroup && !groupSet.banned) || !m.isGroup) && !users.banned) {
         if (typeof m.text != 'object' && m.text == myPrefix) {
            if (m.isGroup && groupSet.mute) return
            let old = new Date()
            let banchat = setting.self ? true : false
            if (!banchat) {
               await client.reply(m.chat, Func.texted('bold', `Checking . . .`), m)
               return client.reply(m.chat, Func.texted('bold', `Response Speed : ${((new Date - old)*1)}ms`), m)
            } else {
               await client.reply(m.chat, Func.texted('bold', `Checking . . .`), m)
               return client.reply(m.chat, Func.texted('bold', `Response Speed : ${((new Date - old)*1)}ms (sedang perbaikan)`), m)
            }
         }
      }
      if (typeof m.text != 'object' && !m.fromMe && m.isGroup && isBotAdmin && !isAdmin) {
         if (groupSet.nolink) {        
            if (m.text.includes(await client.groupInviteCode(m.chat))) return
            if (m.text.match(/(chat.whatsapp.com)/gi)) {
               client.sendFile(m.chat, require('fs').readFileSync('./media/audio/kick.mp3'), '', '', m, {
                  ptt: true
               }).then(() => {
                  client.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
               })
            }
         }
         if (groupSet.novirtex) {
            if (m.text.match(/(৭৭৭৭৭৭৭৭|๒๒๒๒๒๒๒๒|๑๑๑๑๑๑๑๑|ดุท้่เึางืผิดุท้่เึางื)/gi) || m.text.length > 10000) {
               client.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            }
         }
         if (groupSet.nobadword && !groupSet.member[m.sender].whitelist && !users.whitelist) {
            let txc = global.db.setting.toxic
            if ((new RegExp('\\b' + txc.join('\\b|\\b') + '\\b')).test(m.text.toLowerCase())) {
               var cBad = groupSet.member[m.sender].warning += 1
               var warning = groupSet.member[m.sender].warning
               if (warning > 4) {
                  client.reply(m.chat, Func.texted('bold', `di diemin ngelunjak, gue kick mampus lu`), m).then(() => {
                     client.groupParticipantsUpdate(m.chat, [m.sender], 'remove').then(() => {
                        groupSet.member[m.sender].warning = 0
                        client.sendFile(m.chat, require('fs').readFileSync('./media/audio/tmpq7mpzzl9.mp3'), '', '', m, {
                           ptt: true
                        })
                     })
                  })
               } else {
                  client.reply(m.chat, `❏  *W A R N I N G*\n\nAnda mendapat peringatan : [ ${warning} / 5 ]\n\nJangan berkata kasar !\n5 peringatan = kick !`, m).then(() => {
                     client.sendFile(m.chat, require('fs').readFileSync('./media/audio/meme-de-creditos-finales.mp3'), '', '', m, {
                        ptt: true
                     })
                  })
               }
            }
         }
      }
      let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
      for (let jid of jids) {
         let is_user = global.db.users[jid]
         if (!is_user) continue
         let afkTime = is_user.afk
         if (!afkTime || afkTime < 0) continue
         let reason = is_user.afkReason || ''
         if (!m.fromMe) {
            client.reply(m.chat, `*Dia sedang afk* : @${jid.split('@')[0]}\n• *Alasan* : ${reason ? reason : '-'}\n• *Selama* : [ ${Func.toTime(new Date - afkTime)} ]`, m)
         }
      }
      if (setting.self)
         if (!m.fromMe && !isOwner) return
      require('./system/games')(client, m)
      require('./system/customize')(client, m, setting, myPrefix, participants, isOwner, isPrem)
      if (m.isGroup && groupSet.adminmode && !isAdmin) return
      if (typeof m.text !== 'object' && setting.errorCmd.includes(m.text.split` ` [0].substring(1).trim())) {
         return client.reply(m.chat, Func.texted('bold', `Maaf Fitur ${m.text.split` `[0].trim()} sedang error!`), m)
      }

      function join(arr) {
         var construct = []
         for (var i = 0; i < arr.length; i++) construct = construct.concat(arr[i])
         return construct
      }
      let cmds = global.client.commands != null ? Object.values(global.client.commands) : []
      let collect = []
      for (let i = 0; i < cmds.length; i++) collect.push(cmds[i].run.usage)
      if (typeof m.text !== 'object') {
         let thisCmd = m.text.split` ` [0].replace(myPrefix, '').trim()
         if (join(collect).includes(thisCmd)) {
            if (typeof global.db.statistic[thisCmd] == 'undefined') {
               global.db.statistic[thisCmd] = {
                  hitstat: 1,
                  lasthit: new Date * 1,
                  sender: m.sender.split`@` [0]
               }
            } else {
               if (!/bot|help|menu|stat|gc/.test(thisCmd)) {
                  global.db.statistic[thisCmd].hitstat += 1
                  global.db.statistic[thisCmd].lasthit = new Date * 1
                  global.db.statistic[thisCmd].sender = m.sender.split`@` [0]
               }
            }
         }
      }
      if (m.isGroup && groupSet.notify && !users.banned && !m.fromMe) {
         users.spam += 1
         let spam = users.spam
         if (spam >= 3) setTimeout(() => {
            users.spam = 0
         }, 3 * 1000)
         if (m.isGroup && !isAdmin && isBotAdmin && !users.banned && groupSet.spamProtect && spam == 6) {
            return await client.groupSettingUpdate(m.chat, 'announcement').then(async () => {
               client.updateBlockStatus(m.sender, 'block')
               client.reply(m.chat, Func.texted('bold', `Spam protect, group closing automatically and will open after 1 minute.`), m)
               users.spam = 0
               setTimeout(() => {
                  client.groupSettingUpdate(m.chat, 'not_announcement')
               }, 60000)
            })
         } else
         if (m.isGroup && !isAdmin && !users.banned && spam == 6) {
            return client.reply(m.chat, `*Over spam, you got temporarily banned for 1 minute.*`, m).then(() => {
               users.banTemp = new Date() * 1
            })
         }
         if (m.isGroup && groupSet.notify) {
            if (spam == 5) return client.reply(m.chat, `*Hi @${m.sender.split('@')[0]} don't spam, cooldown 5 seconds.*`)
         }
      } else if (!m.isGroup && !m.fromMe && !users.banned) {
         users.spam += 1
         let spam = users.spam
         if (spam >= 2) setTimeout(() => {
            users.spam = 0
         }, 3 * 1000)
         if (spam == 4) return client.reply(m.chat, Func.texted('bold', `Don't spam idiots!`), m)
         if (spam == 5) return client.reply(m.chat, Func.texted('bold', `Over spam you can't use this bot anymore, goodbye idiot.`), m).then(async () => {
            await Func.delay(1000).then(() => {
               users.banned = true
               client.updateBlockStatus(m.sender, 'block')
            })
         })
      }
      if (new Date() * 1 - users.banTemp > 60000) {
         users.banTemp = 0
      }
      let isPrefix
      if (typeof m.text != 'object' && m.text && m.text.length != 1 && (isPrefix = (myPrefix || '')[0])) {
         let args = m.text.replace(isPrefix, '').split` `.filter(v => v)
         let command = args.shift().toLowerCase()
         let start = m.text.replace(isPrefix, '')
         let clean = start.trim().split` `.slice(1)
         let text = clean.join` `
         const is_commands = Object.fromEntries(Object.entries(global.client.commands).filter(([name, prop]) => prop.run.usage))
         let commands = Func.arrayJoin(Object.values(is_commands).map(v => v.run.usage))
         let matcher = Func.matcher(command, commands).filter(v => v.accuracy >= 60)
         if (!commands.includes(command) && matcher.length > 0 && !setting.self) {
            if (!m.isGroup || (m.isGroup && !groupSet.mute)) return client.reply(m.chat, `mungkin maksud kamu :\n\n${matcher.map(v => '👉 *' + isPrefix + v.string + '* (' + v.accuracy + '%)').join('\n')}`, m)
         }
         for (let name in global.client.commands) {
            let cmd = global.client.commands[name].run
            let turn = cmd.usage instanceof Array ? cmd.usage.includes(command) : cmd.usage instanceof String ? cmd.usage == command : false
            //// cmd.usage.constuctor.name == 'Array' ? cmd.usage.includes(command) : cmd.usage.constructor.name == 'String' ? cmd.usage == command : false
            if (!m.text.startsWith('>') && !m.text.startsWith('=>') && !m.text.startsWith('?>') && !m.text.startsWith('$')) {
               if (!m.text.startsWith(myPrefix)) return
            }
            if (!turn) continue
            let group = global.db.groups[m.chat]
            let user = global.db.users[m.sender]
            if (!['activation', 'oactivation', 'ogcmanage', 'groups', 'info'].includes(name) && group && (group.banned || group.mute)) return
            if (!['me', 'owner'].includes(name) && user && user.banned) return
            if (typeof cmd.cache != 'undefined' && cmd.cache && typeof cmd.location != 'undefined') {
               let file = require.resolve(cmd.location)
               Func.reload(file)
            }
            if (typeof cmd.error != 'undefined' && cmd.error) {
               client.reply(m.chat, global.status.errorF, m)
               continue
            }
            if (typeof cmd.mod != 'undefined' && cmd.mod && !isMod) {
               client.reply(m.chat, global.status.moderator, m)
               continue
            }
            if (typeof cmd.owner != 'undefined' && cmd.owner && !isOwner) {
               client.reply(m.chat, global.status.owner, m)
               continue
            }
            if (typeof cmd.premium != 'undefined' && cmd.premium && !isPrem) {
               client.reply(m.chat, global.status.premium, m)
               continue
            }
            if (typeof cmd.vip != 'undefined' && cmd.vip && !isVip) {
               client.reply(m.chat, global.status.vip, m)
               continue
            }
            if (typeof cmd.limit != 'undefined' && cmd.limit && !isPrem && !isOwner && global.db.users[m.sender].limit > 0) {
               global.db.users[m.sender].limit -= cmd.limit || 1
            }
            if (typeof cmd.limit != 'undefined' && cmd.limit && !isPrem && global.db.users[m.sender].limit < 1) {
               client.fakeGroupLink2(m.chat, Func.texted('bold', `❏ LIMIT HABIS*\n\nCara mendapatkan limit :\n1. Beli limit ( *.buy 10* )\n2. Daily claim ( *.claim* )\n\n*Upgrade premium : unlimited limit`), global.db.setting.header, m.sender, m)
               continue
            }
            if (typeof cmd.group != 'undefined' && cmd.group && !m.isGroup) {
               client.reply(m.chat, global.status.group, m)
               continue
            } else if (typeof cmd.botAdmin != 'undefined' && cmd.botAdmin && !isBotAdmin) {
               client.reply(m.chat, global.status.botAdmin, m)
               continue
            } else if (typeof cmd.admin != 'undefined' && cmd.admin && !isAdmin) {
               client.reply(m.chat, global.status.admin, m)
               continue
            }
            if (typeof cmd.private != 'undefined' && cmd.private && m.isGroup) {
               client.reply(m.chat, global.status.private, m)
               continue
            }
            cmd.async(m, {
               client,
               args,
               text,
               isPrefix,
               command,
               participants,
               isOwner,
               isAdmin,
               isBotAdmin,
               isPrem
            })
            break
         }
      }
   } catch (e) {
      console.log(e)
   }
}

Func.reload(require.resolve(__filename))