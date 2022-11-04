const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
exports.run = {
   usage: ['groups'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      let groups = await client.groupList()
      let rows = []
      for (let i = 0; i < groups.length; i++) {
         if (groups[i].id in global.db.groups) {
            let v = global.db.groups[groups[i].id]
            rows.push({
               title: groups[i].subject,
               rowId: `${isPrefix}gc ${groups[i].id}`,
               description: `[ ${v.stay ? 'PERMANEN' : (v.expired == 0 ? 'NOT SET' : Func.timeReverse(v.expired - new Date() * 1))} | ${groups[i].participants.length} | ${(v.mute ? 'OFF' : 'ON')} | ${moment(v.activity).format('DD/MM/YY HH:mm:ss')} ]`
            })
         } else global.db.groups[groups[i].id] = {
            activity: new Date * 1,
            banned: false,
            mute: false,
            game: false,
            welcome: false,
            textwel: 'selamat datang +tag di +grup',
            left: false,
            textleft: '',
            notify: false,
            spamProtect: false,
            localonly: false,
            nodelete: true,
            nobadword: false,
            nolink: true,
            novirtex: false,
            expired: 0,
            stay: false,
            member: {}
         }
      }
      client.sendList(m.chat, '', `${groups.length} group telah sewabot 🎊`, '', 'Lihat!', rows, m)
   },
   owner: false,
   cache: true,
   location: __filename
}