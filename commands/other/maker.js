exports.run = {
   usage: ['blackpink', 'blood', 'breakwall', 'glow', 'joker', 'magma', 'matrix', 'multicolor', 'neon', 'papercut', 'slice'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'neoxr'), m)
      if (text.length > 10) return client.reply(m.chat, `Teks terlalu panjang minimal 10 karakter.`, m)
      client.reply(m.chat, global.status.wait, m)
      let result = await Api.maker(command, text)
      client.sendFile(m.chat, result, '', '', m)
   },
   error: false,
   cache: true,
   location: __filename
}