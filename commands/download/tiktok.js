const Tiktok = new(require('../../lib/tiktok'))
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
exports.run = {
   usage: ['tiktok', 'tikwm', 'tikmp3', 'tikori'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(isPrefix, command, 'https://vm.tiktok.com/ZSd3VmA8X'), m)
         if (!args[0].match('tiktok.com')) return client.reply(m.chat, global.status.invalid, m)
         client.reply(m.chat, global.status.getdata, m)
         let json = await Tiktok.fetchData(Func.ttFixed(args[0]))
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let caption = `⬣━━━━⬡ Tiktok Downloader\n\n`
         caption += json.data.text + '\n\n'
         caption += '	⬡ Akun: : ' + json.data.authorMeta.nickName + '\n'
         caption += '	⬡ Like: ' + Func.h2k(json.data.diggCount) + '\n'
         caption += '	⬡ Share: : ' + Func.h2k(json.data.shareCount) + '\n'
         caption += '	⬡ Views: : ' + Func.h2k(json.data.playCount) + '\n'
         caption += '	⬡ Comment: ' + Func.h2k(json.data.commentCount) + '\n'
         caption += '	⬡ Kualitas : ' + json.data.videoMeta.ratio + '\n'
         caption += '	⬡ Ukuran : ' + json.data.videoMeta.width + ' × ' + json.data.videoMeta.height + '\n'
         caption += '	⬡ Upload : ' + moment(new Date - json.data.createTime).format('dddd, DD MMM Y') + '\n\n'
         caption += `⬣━━━⬡\n\n`                  
         caption += global.db.setting.footer
         const video = json.downloads.find(v => v.type == 'no_watermark')
         const videoWM = json.downloads.find(v => v.type == 'watermark')
         const music = json.downloads.find(v => v.type == 'audio')
         if (command == 'tiktok') {     
            if (!video) return client.reply(m.chat, global.status.fail, m)
            client.sendButton(m.chat, video.url, caption, ``, m, [{
               buttonId: `${isPrefix}extract ${video.url}`,
               buttonText: {
                  displayText: 'Audio'
               },
               type: 1
            }])
         } else if (command == 'tikwm') {
            if (!videoWM) return client.reply(m.chat, global.status.fail, m)
            client.sendButton(m.chat, videoWM.url, caption, ``, m, [{
               buttonId: `${isPrefix}tikmp3 ${args[0]}`,
               buttonText: {
                  displayText: 'Convert'
               },
               type: 1
            }, {
               buttonId: `${isPrefix}tikori ${args[0]}`,
               buttonText: {
                  displayText: 'Original'
               },
               type: 1
            }])
         } else if (command == 'tikmp3') {
            return !video ? client.reply(m.chat, global.status.fail, m) : client.sendFile(m.chat, video.url, 'audio.mp3', '', m)
         } else if (command == 'tikori') {
            return !music ? client.reply(m.chat, global.status.fail, m) : client.sendFile(m.chat, music.url, 'audio.mp3', '', m)
         } 
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   quota: true,
   cache: true,
   location: __filename
}