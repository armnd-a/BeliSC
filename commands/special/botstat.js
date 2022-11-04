let moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
exports.run = {
   usage: ['stat', 'botstat'],
   async: async (m, {
      client
   }) => {
      let groups = await (await client.groupList()).length
      let chats = Object.keys(global.db.chats).filter(v => v.endsWith('.net')).length
      let users = Object.keys(global.db.users).length
      let stat = Object.keys(global.db.statistic)
      class Hit extends Array {
         total(key) {
            return this.reduce((a, b) => a + (b[key] || 0), 0)
         }
      }
      let sum = new Hit(...Object.values(global.db.statistic))
      let hitstat = sum.total('hitstat') != 0 ? sum.total('hitstat') : 0
      let system = global.db.setting
      let procUp = process.uptime() * 1000
      let uptime = Func.toTime(procUp)
      let banned = 0
      for (let jid in global.db.users) global.db.users[jid].banned ? banned++ : ''
      let whitelist = 0
      for (let jid in global.db.users) global.db.users[jid].whitelist ? whitelist++ : ''
      let point = [...new Set(Object.entries(global.db.users).filter(([v, x]) => v.point != 0).map(([v, x]) => x.point))]
      let limit = [...new Set(Object.entries(global.db.users).filter(([v, x]) => v.limit != 0).map(([v, x]) => x.limit))]
      let hit = [...new Set(Object.entries(global.db.users).filter(([v, x]) => v.hit != 0).map(([v, x]) => x.hit))]
      let online = [...new Set(Object.entries(global.db.users).filter(([v, x]) => v.lastseen != 0).map(([v, x]) => x.lastseen))]
      let avg = {
         point: Func.formatNumber((point.reduce((a, b) => a + b) / point.length).toFixed(0)),
         limit: Func.formatNumber((limit.reduce((a, b) => a + b) / limit.length).toFixed(0)),
         hit: Func.formatNumber((hit.reduce((a, b) => a + b) / hit.length).toFixed(0)),
         online: (online.reduce((a, b) => a + b) / online.length).toFixed(0),
      }
      await client.fakeStory(m.chat, await botstat(groups, chats, users, system, banned, whitelist, hitstat, uptime, avg), global.db.setting.header, [m.sender])
   },
   error: false,
   cache: true,
   location: __filename
}

let botstat = async (groups, chats, users, system, banned, whitelist, hitstat, uptime, avg) => {
   return `┌─〔 Status 〕
├ ${Func.texted('bold', `Aktif selama ${uptime}`)}
├ ${Func.texted('bold', groups)} Grup
├ ${Func.texted('bold', chats)} Chat Pribadi
├ ${Func.texted('bold', Func.simpFormat(Func.formatNumber(hitstat)))} Total Hit
├ ${Func.texted('bold', users)} Pengguna
├ ${Func.texted('bold', whitelist)} Whitelist
├ ${Func.texted('bold', banned)} Banned
├ ${Func.texted('bold', setting.errorCmd.length)} Fitur Error
└────
┌─〔 Pengaturan 〕
├ ${Func.switcher(system.autodownload, '✅', '❌')}  Auto Download
├ ${Func.switcher(system.games, '✅', '❌')}  Fitur game
├ ${Func.switcher(system.self, '✅', '❌')}  Self Mode
├ ${Func.switcher(system.groupmode, '✅', '❌')}  Group Mode
├ Prefix : ${system.multiprefix ? ' ( ' + system.prefix.map(v => v).join(' ') + ' )' : ' ( ' + system.onlyprefix + ' )'}
└────
┌─〔 Internet 〕
├ ${Func.texted('bold', await Func.getSize(setting.uploadSize))} Total Terkirim
├ ${Func.texted('bold', await Func.getSize(setting.receiveSize))} Total Terima
└────

${global.db.setting.footer}`
}