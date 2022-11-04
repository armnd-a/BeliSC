const Tesseract = require('tesseract.js')
exports.run = {
   usage: ['ocr', 'copy'],
   async: async (m, {
      client,
      command
   }) => {
      try {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await client.downloadMediaMessage(q)
            if (!/image/.test(type)) return client.reply(m.chat, Func.texted('bold', `Berikan caption atau reply foto dengan perintah ${isPrefix + command}`), m)
            client.reply(m.chat, global.status.getdata, m)
            const result = await (await Tesseract.recognize(img, 'eng')).data.text
            client.reply(m.chat, result, m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `Berikan caption atau reply foto dengan perintah ${isPrefix + command}`), m)
            let img = await q.download()
            if (!img) return client.reply(m.chat, Func.texted('bold', `Berikan caption atau reply foto dengan perintah ${isPrefix + command}`), m)
            client.reply(m.chat, global.status.getdata, m)
     	    const result = await (await Tesseract.recognize(img, 'eng')).data.text
            client.reply(m.chat, result, m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   quota: true
}