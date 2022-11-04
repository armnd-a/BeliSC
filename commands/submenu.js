exports.run = {
   usage: ['submenu'],
   async: async (m, {
      client,
      args,
      command,
      isPrefix
   }) => {
      try {
         const dial = args[0] ? args[0] : 1
         let button = [{
                buttonId: `${isPrefix}owner`,
                buttonText: {
                   displayText: 'OWNER'
                },
                type: 1
            }]
         if (dial == 1) return client.sendButton2(m.chat, global.db.setting.cover, submenu1(isPrefix), global.db.setting.footer, m, button, {
                    document: true
            }, {
                title: `Simple WhatsApp Bot\nAktif selama ${Func.toTime(process.uptime() * 1000)}`,
                thumbnail: await Func.fetchBuffer(global.db.setting.cover),
                fileName: Func.greeting(m.pushName)
            })
         if (dial == 2) return client.sendButton2(m.chat, global.db.setting.cover, submenu2(isPrefix), global.db.setting.footer, m, button, {
                    document: true
            }, {
                title: `Simple WhatsApp Bot\nAktif selama ${Func.toTime(process.uptime() * 1000)}`,
                thumbnail: await Func.fetchBuffer(global.db.setting.cover),
                fileName: Func.greeting(m.pushName)
            })
         if (dial == 3) return client.sendButton2(m.chat, global.db.setting.cover, submenu3(isPrefix), global.db.setting.footer, m, button, {
                    document: true
            }, {
                title: `Simple WhatsApp Bot\nAktif selama ${Func.toTime(process.uptime() * 1000)}`,
                thumbnail: await Func.fetchBuffer(global.db.setting.cover),
                fileName: Func.greeting(m.pushName)
            })
         if (dial == 4) return client.sendButton2(m.chat, global.db.setting.cover, submenu4(isPrefix), global.db.setting.footer, m, button, {
                    document: true
            }, {
                title: `Simple WhatsApp Bot\nAktif selama ${Func.toTime(process.uptime() * 1000)}`,
                thumbnail: await Func.fetchBuffer(global.db.setting.cover),
                fileName: Func.greeting(m.pushName)
            })
         if (dial == 5) return client.sendButton2(m.chat, global.db.setting.cover, submenu5(isPrefix), global.db.setting.footer, m, button, {
                    document: true
            }, {
                title: `Simple WhatsApp Bot\nAktif selama ${Func.toTime(process.uptime() * 1000)}`,
                thumbnail: await Func.fetchBuffer(global.db.setting.cover),
                fileName: Func.greeting(m.pushName)
            })
         if (dial == 6) return client.sendButton2(m.chat, global.db.setting.cover, submenu6(isPrefix), global.db.setting.footer, m, button, {
                    document: true
            }, {
                title: `Simple WhatsApp Bot\nAktif selama ${Func.toTime(process.uptime() * 1000)}`,
                thumbnail: await Func.fetchBuffer(global.db.setting.cover),
                fileName: Func.greeting(m.pushName)
            })
         if (dial == 7) return client.sendButton2(m.chat, global.db.setting.cover, submenu7(isPrefix), global.db.setting.footer, m, button, {
                    document: true
            }, {
                title: `Simple WhatsApp Bot\nAktif selama ${Func.toTime(process.uptime() * 1000)}`,
                thumbnail: await Func.fetchBuffer(global.db.setting.cover),
                fileName: Func.greeting(m.pushName)
            })
         if (dial == 8) return client.sendButton2(m.chat, global.db.setting.cover, submenu8(isPrefix), global.db.setting.footer, m, button, {
                    document: true
            }, {
                title: `Simple WhatsApp Bot\nAktif selama ${Func.toTime(process.uptime() * 1000)}`,
                thumbnail: await Func.fetchBuffer(global.db.setting.cover),
                fileName: Func.greeting(m.pushName)
            })
         if (dial == 9) return client.sendButton2(m.chat, global.db.setting.cover, submenu9(isPrefix), global.db.setting.footer, m, button, {
                    document: true
            }, {
                title: `Simple WhatsApp Bot\nAktif selama ${Func.toTime(process.uptime() * 1000)}`,
                thumbnail: await Func.fetchBuffer(global.db.setting.cover),
                fileName: Func.greeting(m.pushName)
            })
         if (dial ==10) return client.sendButton2(m.chat, global.db.setting.cover, submenu10(isPrefix), global.db.setting.footer, m, button, {
                    document: true
            }, {
                title: `Simple WhatsApp Bot\nAktif selama ${Func.toTime(process.uptime() * 1000)}`,
                thumbnail: await Func.fetchBuffer(global.db.setting.cover),
                fileName: Func.greeting(m.pushName)
            })
      } catch (e) {
         console.log(e)
      }
   },
   error: false,
   cache: true,
   location: __filename
}

const submenu1 = (prefix) => {
return `⬣━━━⬡ ​𝗨𝗔𝗡𝗚 & 𝗟𝗜𝗠𝗜𝗧
 ⬡ ​ .​buy
 ⬡ ​ .​buyguard
 ⬡ ​ .​claim
 ⬡ ​ .​guard
 ⬡ ​ .​transfer *@tag* nominal
 ⬡ ​ .​limit
 ⬡ ​ .​me
 ⬡ ​ .​point
 ⬡ ​ .​profile
 ⬡ ​ .​toplocal
 ⬡ ​ .​topglobal
 ⬡ ​ .​topuser
 ⬡ ​ .​topuserlocal 
⬣━━━⬡`
}

const submenu2 = (prefix) => {
return `⬣━━━⬡ 𝗦𝗘𝗔𝗥𝗖𝗛
 ⬡ ​ .alquran
 ⬡ ​ .​whatanime
 ⬡ ​ .​wattpad *judul*
 ⬡ ​ .​drakor *judul*
 ⬡ ​ .​anime *judul*
 ⬡ ​ .​film *judul*
 ⬡ ​ .​google <query>
 ⬡ ​ .​githubstalk
 ⬡ ​ .igstalk
 ⬡ ​ .​ytsearch <query> 
 ⬡ ​ .​whatmusic <caption / reply> 
⬣━━━⬡`
}
	
const submenu3 = (prefix) => {
return `⬣━━━⬡ ​𝗙𝗨𝗡 𝗚𝗔𝗠𝗘
 ⬡ ​ .​attack
 ⬡ ​ .​adventure
 ⬡ ​ .​barbar
 ⬡ ​ .​brainout
 ⬡ ​ .​coin *A* / *B*
 ⬡ ​ .​math *mode*
 ⬡ ​ .​riddle
 ⬡ ​ .​slot
 ⬡ ​ .​spin *point*
 ⬡ ​ .​ttt
 ⬡ ​ .​ttt *room*
 ⬡ ​ .​tictactoe
 ⬡ ​ .​tebaklirik
 ⬡ ​ .​tebaktebakan
 ⬡ ​ .​caklontong
 ⬡ ​ .​whatsong
 ⬡ ​ .​whatword
 ⬡ ​ .​whoami
 ⬡ ​ .​truth
 ⬡ ​ .​dare
 ⬡ ​ .​apakah
 ⬡ ​ .​kapankah
 ⬡ ​ .​siapakah
 ⬡ ​ .​susunkata 
 ⬡ ​ .​tebakkata 
 ⬡ ​ .​tebakgambar 
⬣━━━⬡`
}

const submenu4 = (prefix) => {
return `⬣━━━⬡ ​𝗥𝗔𝗡𝗗𝗢𝗠 𝗜𝗠𝗔𝗚𝗘 
 ⬡ ​ .​loli
 ⬡ ​ .​waifu 
 ⬡ ​ .ahegao
 ⬡ ​ .ass
 ⬡ ​ .bdsm
 ⬡ ​ .blowjob
 ⬡ ​ .cuckold
 ⬡ ​ .cum
 ⬡ ​ .ero
 ⬡ ​ .femdom
 ⬡ ​ .foot
 ⬡ ​ .gangbang
 ⬡ ​ .glasses
 ⬡ ​ .hentaigifs
 ⬡ ​ .jahy
 ⬡ ​ .manga
 ⬡ ​ .masturbation
 ⬡ ​ .nsfwNeko
 ⬡ ​ .orgy
 ⬡ ​ .pussy
 ⬡ ​ .yuri
⬣━━━⬡`
}

const submenu5 = (prefix) => {
return `⬣━━━⬡ 𝗢𝗧𝗛𝗘𝗥
 ⬡ ​ .​sadboy
 ⬡ ​ .​sadgirl
 ⬡ ​ .​bucin
 ⬡ ​ .​senja
 ⬡ ​ .​fakta
 ⬡ ​ .​tag *text*
 ⬡ ​ .​tagme
 ⬡ ​ .​wame *text*
 ⬡ ​ .​react *emoji*
 ⬡ ​ .​artinama *nama*
 ⬡ ​ .​artinama2 *nama* 	
 ⬡ ​ .​urban *word*
 ⬡ ​ .​sindiran
 ⬡ ​ .​kataanime
 ⬡ ​ .​desahancewek
 ⬡ ​ .​desahancowok
⬣━━━⬡`
}

const submenu6 = (prefix) => {
return `⬣━━━⬡ 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗥
 ⬡ ​ .​toimg <reply> 
 ⬡ ​ .tomp4 <reply> 
 ⬡ ​ .​tourl <caption / reply> 
 ⬡ ​ .​tovn *reply audio* 
 ⬡ ​ .​short ​<url> 
⬣━━━⬡`
}

const submenu7 = (prefix) => {
return `⬣━━━⬡ ​𝗦𝗧𝗜𝗖𝗞𝗘𝗥
 ⬡ ​ .​emo *emoticon*
 ⬡ ​ .​emojimix
 ⬡ ​ .​flat *emoticon*
 ⬡ ​ .​smeme *text | text*
 ⬡ ​ .​sticker/s/sk	
 ⬡ ​ .​swm *pack | author*
⬣━━━⬡`
}
	
const submenu8 = (prefix) => {
return `⬣━━━⬡ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥
 ⬡ ​ .​play <query> 
 ⬡ ​ .​alquran 
 ⬡  .wallpaper <query>
 ⬡ ​ .​ig ​<url>	
 ⬡ ​ .​igstory *username*
 ⬡ ​ .​mediafire ​<url>
 ⬡ ​ .​asupan *request* / *hastag*
 ⬡ ​ .​bokep
 ⬡ ​ .​ometv
 ⬡ ​ .​viral 
 ⬡ ​ .​fb ​<url>
 ⬡ ​ .​pin ​<url>	
 ⬡ ​ .​apk <query>
 ⬡ ​ .​pinterest <query>	
 ⬡ ​ .​sticker <query>
 ⬡ ​ .​tiktok ​<url>
 ⬡ ​ .​tikmp3 ​<url>
 ⬡ ​ .​tikwm ​<url>
 ⬡ ​ .​twitter ​<url>
 ⬡ ​ .​video <query>
 ⬡ ​ .​ythd ​<url>
 ⬡ ​ .​ytmp3 ​<url>
 ⬡ ​ .​ytmp4 ​<url>
 ⬡ ​ .​twitter <url> 
 ⬡ ​ .​tiktok <url> 
 ⬡ ​ .​nhentaipdf <code> 
 ⬡ ​ .​pinterest <query / url> 
 ⬡ ​ .​soundcloud <query / url> 
⬣━━━⬡`
}

const submenu9 = (prefix) => {
return `⬣━━━⬡ 𝗚𝗥𝗢𝗨𝗣
 ⬡ ​ .​link 
 ⬡ ​ .​leave 
 ⬡ ​ .​revoke
 ⬡ ​ .​afk *alasan* 
 ⬡ ​ .​pacaran
 ⬡ ​ .​groupinfo
 ⬡ ​ .​tagall [teks] 
 ⬡ ​ .​hidetag [teks] 
 ⬡ ​ .​group [option] 
 ⬡ ​ .​mute
 ⬡ ​ .​tagall
 ⬡ ​ .​hidetag
 ⬡ ​ .​kick
 ⬡ ​ .​demote
 ⬡ ​ .​mark
 ⬡ ​ .​unmark
 ⬡ ​ .​revoke
 ⬡ ​ .​absen
 ⬡ ​ .​link
 ⬡ ​ .​sider
 ⬡ ​ .​kicksider
 ⬡  .anti212
 ⬡ ​ .​antilink *on / off*
 ⬡ ​ .​antivirtex *on / off*
 ⬡ ​ .​filter *on / off*
 ⬡ ​ .​game *on / off*
 ⬡ ​ .​localonly *on / off*
 ⬡ ​ .​left *on / off*
 ⬡ ​ .​notify *on / off*
 ⬡ ​ .​protect *on / off*
 ⬡ ​ .​welcome *on / off*
 ⬡ ​ .​group *close / open*
 ⬡ ​ .​contact *@tag*
 ⬡ ​ .​setdesc *text*
 ⬡ ​ .​setname *text*
 ⬡ ​ .​textwel *text*
 ⬡ ​ .​textleft *text*
 ⬡ ​ .​demote <@tag / reply> 
 ⬡ ​ .​setppgrup 
⬣━━━⬡`
}

const submenu10 = (prefix) => {
return `⬣━━━⬡ 𝗢𝗪𝗡𝗘𝗥
 ⬡   $ 
 ⬡   > / >> 
 ⬡ ​ .​oautodownload *on / off*
 ⬡ ​ .​oantilink *on / off*
 ⬡ ​ .​oantivirtex *on / off*
 ⬡ ​ .​ofilter *on / off*
 ⬡ ​ .​ogame *on / off*
 ⬡ ​ .​olocalonly *on / off*
 ⬡ ​ .​oleft *on / off*
 ⬡ ​ .​onotify *on / off*
 ⬡ ​ .​oprotect *on / off*
 ⬡ ​ .​omute *1 / 0*
 ⬡ ​ .​ohidetag *text*
 ⬡ ​ .​oleave
 ⬡ ​ .​okick *reply / mention*
 ⬡ ​ .​otagall *text*
 ⬡ ​ .​owelcome
 ⬡ ​ .​addown
 ⬡ ​ .​delown
 ⬡ ​ .​addmod
 ⬡ ​ .​delmod
 ⬡ ​ .​listcmd
 ⬡ ​ .​setcmd 
 ⬡ ​ .​delcmd
 ⬡ ​ .setprefix *prefix*
 ⬡ ​ .setmsg *text*
 ⬡ ​ .setcover *reply foto*
 ⬡ ​ .setheader *text*
 ⬡ ​ .setfooter *text*
 ​⬡  .setlink 
 ⬡ ​ .​backup
 ⬡ ​ .​ban
 ⬡ ​ .​bcgc
 ⬡ ​ .​block
 ⬡ ​ .​db
 ⬡ ​ .​unblock
 ⬡ ​ .​unban
 ⬡ ​ .​omark
 ⬡ ​ .​ounmark
 ⬡ ​ .​spamtag
 ⬡ ​ .​addlist
 ⬡ ​ .​getlist
 ⬡ ​ .​dellist
 ⬡ ​ .​self 
 ⬡ ​ .​public 
 ⬡ ​ .​restart 
 ⬡ ​ .​join <url> 
 ⬡ ​ .​setprefix [prefix] 
 ⬡ ​ .​setppbot <caption / reply / url>
 ⬡ ​ .​setmenu
 ⬡ ​ .​storage
 ⬡ ​ .​check
 ⬡ ​ .​stat
 ⬡ ​ .​groups
 ⬡ ​ .​list
 ⬡ ​ .​tools
⬣━━━⬡ `
}