process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
const { useSingleFileAuthState, DisconnectReason, makeInMemoryStore } = require('@adiwajshing/baileys')
const session = process.argv[2] ? process.argv[2] : 'session'
const sessionFile = session + '.json'
const {
   state,
   saveState
} = useSingleFileAuthState(sessionFile)
const pino = require('pino'),
   path = require('path'),
   fs = require('fs')
const Spinnies = require('spinnies')
const spinnies = new Spinnies()
const StormDB = require('stormdb')
const engine = new StormDB.localFileEngine('./database.json', {
   serialize: data => {
      return JSON.stringify(data, null, 3)
   }
})
const database = new StormDB(engine)
const {
   Socket,
   Serialize,
   Scandir
} = require('./system/extra')
const {
   Function
} = require('./system/function')
global.Func = new Function
const {
   Scraper
} = require('./system/scraper')
global.scrap = new Scraper
const {
   NeoxrApi
} = require('./system/neoxrApi')

//
global.store = makeInMemoryStore({
   logger: pino().child({
      level: 'silent',
      stream: 'store'
   })
})

// Get free apikey register at https://api.neoxr.eu.org
global.Api = new NeoxrApi('pelerfaruq')

const start = async () => {
   global.client = Socket({
      logger: pino({
         level: 'silent'
      }),
      printQRInTerminal: true,
      browser: ["Multi-Device", "Safari", "3.0"],
      auth: state,
      version: [2, 2222, 11]
   })

   store.bind(client.ev)
   client.ev.on('connection.update', async (update) => {
      const {
         connection,
         lastDisconnect
      } = update
      if (connection === 'connecting') spinnies.add('start', {
         text: 'Tunggu sebentar . . .'
      })
      if (connection === 'open') spinnies.succeed('start', {
         text: `Terhubung, ke ${client.user.name}`
      })
      if (connection === 'close') lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut ? start() : spinnies.fail('start', {
         text: `Can't connect to Web Socket`
      })

      client.sql = new(require('./system/postgres'))
      const rows = await client.sql.fetch()
      if (rows) {
         global.db = rows.data
      } else {
          global.db = {
          users: {},
          chats: {},
          groups: {},
          statistic: {},
          sticker: {},
          setting: {},
          changelog: {}
          }
         global.db = JSON.parse(JSON.stringify(fs.readFileSync('./084c1260-8fbb-4893-a078-706cac919875.json', 'utf-8')))
         await client.sql.save(global.db)
      }
   })

   client.ev.on('messages.upsert', async chatUpdate => {
      try {
         m = chatUpdate.messages[0]
         if (!m.message) return
         Serialize(client, m)
         Scandir('./commands').then(files => {
            global.client.commands = Object.fromEntries(files.filter(v => v.endsWith('.js')).map(file => [path.basename(file).replace('.js', ''), require(file)]))
         }).catch(e => console.error(e))
         require('./system/config'), require('./handler')(client, m)
      } catch (e) {
         console.log(e)
      }
   })

   client.ev.on('group-participants.update', async (gc) => {
      let meta = await (await client.groupMetadata(gc.id))
      let member = gc.participants[0]
      let textwel = `*Selamat datang +tag digrup +grup*`
      let textleft = `*+tag keluar karena udah becek*`
      let readmore = String.fromCharCode(8206).repeat(4001)
      let deskripsi = await (await client.groupMetadata(gc.id)).desc.toString()
      let groupSet = global.db.groups[gc.id]
      let prefixes = global.db.setting.multiprefix ? global.db.setting.prefix[0] : global.db.setting.onlyprefix
      try {
         pic = await Func.fetchBuffer(await client.profilePictureUrl(member, 'image'))
      } catch {
         pic = await Func.fetchBuffer('./media/images/default.jpg')
      }
      if (gc.action == 'promote') client.reply(gc.id, Func.texted('bold', `@${member.split`@`[0]} sekarang adalah admin 🗿`))
      if (gc.action == 'demote') client.reply(gc.id, Func.texted('bold', `@${member.split`@`[0]} yhaha di unadmin`))
      if (gc.action == 'add') {
         if (groupSet.localonly) {
            if (typeof global.db.users[member] != 'undefined' && !global.db.users[member].whitelist && !member.startsWith('62') || !member.startsWith('62')) {
               client.reply(gc.id, Func.texted('bold', `Sorry @${member.split`@`[0]}, this group is only for indonesian people and you will removed automatically.`))
               client.updateBlockStatus(member, 'block')
               return await Func.delay(2000).then(() => client.groupParticipantsUpdate(gc.id, [member], 'remove'))
            }
         }
         if (groupSet.anti212) {
            if (member.startsWith('212')) {
               client.reply(gc.id, Func.texted('bold', `Hai @${member.split`@`[0]} moroccoan people 🖕, you look like an idiot, sorry i kick`))
               client.updateBlockStatus(member, 'block')
               return await Func.delay(2000).then(() => client.groupParticipantsUpdate(gc.id, [member], 'remove'))
            }
         }
         let txt = (groupSet.textwel != '' ? groupSet.textwel : textwel).replace('+tag', `@${member.split`@`[0]}`).replace('+grup', `${meta.subject}`)
         if (groupSet.welcome) client.sendMessageModify(gc.id, txt, null, {
                title: 'ılılllıllılllıllıılılllıllılllıllı\n© RIKKA BOT OFFICIAL',
                largeThumb: true,
                thumbnail: pic,
                url: '',
                
            })
      } else if (gc.action == 'remove') {
         let txt = (groupSet.textleft != '' ? groupSet.textleft : textleft).replace('+tag', `@${member.split`@`[0]}`).replace('+grup', `${meta.subject}`)
         if (groupSet.left) client.sendMessageModify(gc.id, txt, null, {
                title: 'ılılllıllılllıllıılılllıllılllıllı\n© RIKKA BOT OFFICIAL',
                largeThumb: true,
                thumbnail: pic,
                url: '',
         })
      }
   })
   
   
   client.ev.on('creds.update', saveState)
   setInterval(async () => {
      if (global.db) await client.sql.save()
   }, 10_000)
   return client
}

start()
