exports.run = {
   usage: ['textwel', 'textleft'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      let setup = global.db.groups[m.chat]
      if (command == 'textwel') {
         if (!text) return client.reply(m.chat, formatWel(isPrefix, command), m)
         setup.textwel = text
         await client.reply(m.chat, Func.texted('bold', `Successfully set.`), m)
      } else if (command == 'textleft') {
         if (!text) return client.reply(m.chat, formatLef(isPrefix, command), m)
         setup.textleft = text
         await client.reply(m.chat, Func.texted('bold', `Successfully set.`), m)
      }
   },
   admin: true
}

const formatWel = (prefix, command) => {
   return `ini penjelasan dan cara menggunakannya :

*1.* +tag : untuk menyebutkan anggota baru di pesan selamat datang.
*2.* +grup : untuk mendapatkan nama grup.

• *Contoh* : ${prefix + command} Hi Kontol +tag, selamat datang di +grup`
}

const formatLef = (prefix, command) => {
   return `ini penjelasan dan cara menggunakannya

*1.* +tag : untuk menyebutkan anggota baru di pesan selamat datang.
*2.* +grup : untuk mendapatkan nama grup.

• *Example* : ${prefix + command} Good by kontol +tag`
}