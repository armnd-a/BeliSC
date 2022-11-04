exports.run = {
   usage: ['menfes', 'menfess'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      if (!text) return client.reply(m.chat, Func.example(isPrefix, command, '628xxx | hai'), m)
      let [no, msg] = text.split`|`
      if (!no || !msg) return client.reply(m.chat, Func.example(isPrefix, command, '628xxx | hai'), m)
      let jid = no.trim() + '@s.whatsapp.net'
      if (await (await client.onWhatsApp(jid)).length == 0) return client.reply(m.chat, Func.texted('bold', `Nomor tidak valid.`), m)
      return client.reply(jid, msg.trim(), null).then(() => client.reply(m.chat, 'menfes berhasil terkirim..!', m))
   },
   cache: true,
   premium: true,
   location: __filename
}