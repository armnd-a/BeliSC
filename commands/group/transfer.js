exports.run = {
   usage: ['tf', 'transfer'],
   async: async (m, {
      client,
      args,
      isPrefix,
      command
   }) => {
      if (m.quoted) {
         if (m.quoted.isBot) return client.reply(m.chat, Func.texted('bold', `🚩 Tidak bisa melakukan transfer kepada bot simpen aja buat kamu.`), m)
         if (!args || !args[0]) return client.reply(m.chat, Func.texted('bold', `🚩 Berikan nominal saldo yang akan di transfer.`), m)
         if (isNaN(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 Saldo harus berupa angka.`), m)
         let nominal = parseInt(args[0])
         let ppn = parseInt(((25 / 100) * nominal).toFixed(0))
         let point = global.db.users[m.sender].point
         let target = client.decodeJid(m.quoted.sender)
         if (target == m.sender) return client.reply(m.chat, Func.texted('bold', `Kalo ga niat transfer jangan transfer ya ganteng/cantik.`), m)
         if (nominal > point) return client.reply(m.chat, Func.texted('bold', `🚩 Saldo kamu tidak cukup untuk melakukan transfer.`), m)
         if ((nominal + ppn) > point) return client.reply(m.chat, Func.texted('bold', `🚩 Saldo kamu tidak cukup untuk membayar pajak transfer sebesar 25%`), m)
         if (nominal < 10000) return client.reply(m.chat, Func.texted('bold', `🚩 Nominal Saldo untuk di transfer minimal 10rb.`), m)
         global.db.users[m.sender].point -= (nominal + ppn)
         global.db.users[target].point += nominal
         let teks = `❏  *T R A N S F E R*\n\n`
         teks += `“Berhasil melakukan transfer kepada *@${target.replace(/@.+/g, '')}* dengan nominal _${Func.formatNumber(nominal)} rupiah_”\n\n`
         teks += `🛒 *Pajak* : ${Func.formatNumber(ppn)} [25%]\n`
         teks += `💸 *Sisa Saldo* : ${Func.formatNumber(global.db.users[m.sender].point)}`
         client.reply(m.chat, teks, m)
      } else if (m.mentionedJid.length != 0) {
         if (!args || !args[1]) return client.reply(m.chat, Func.texted('bold', `🚩 Berikan nominal saldo yang akan di transfer.`), m)
         if (isNaN(args[1])) return client.reply(m.chat, Func.texted('bold', `🚩 Saldo harus berupa angka.`), m)
         let nominal = parseInt(args[1])
         let ppn = parseInt(((25 / 100) * nominal).toFixed(0))
         let point = global.db.users[m.sender].point
         let target = client.decodeJid(m.mentionedJid[0])
         if (target == client.decodeJid(client.user.id)) return client.reply(m.chat, Func.texted('bold', `🚩 Tidak bisa melakukan transfer kepada bot simpen aja buat kamu.`), m)
         if (target == m.sender) return client.reply(m.chat, Func.texted('bold', `Kalo ga niat transfer jangan transfer ya ganteng/cantik.`), m)
         if (nominal > point) return client.reply(m.chat, Func.texted('bold', `🚩 Saldo Kamu tidak cukup untuk melakukan transfer.`), m)
         if ((nominal + ppn) > point) return client.reply(m.chat, Func.texted('bold', `🚩 Saldo Kamu tidak cukup untuk membayar pajak transfer sebesar 25%`), m)
         if (nominal < 10000) return client.reply(m.chat, Func.texted('bold', `🚩 Nominal Saldo untuk di transfer minimal 10rb.`), m)
         global.db.users[m.sender].point -= (nominal + ppn)
         global.db.users[target].point += nominal
         let teks = `❏  *T R A N S F E R*\n\n`
         teks += `“Berhasil melakukan transfer kepada *@${target.replace(/@.+/g, '')}* dengan nominal _${Func.formatNumber(nominal)} rupiah_”\n\n`
         teks += `🛒 *Pajak* : ${Func.formatNumber(ppn)} [25%]\n`
         teks += `💸 *Sisa Point* : ${Func.formatNumber(global.db.users[m.sender].point)}`
         client.reply(m.chat, teks, m)
      } else {
         let teks = `• *Contoh* :\n\n`
         teks += `${isPrefix + command} @0 10000\n`
         teks += `${isPrefix + command} 10000 (reply chat target)`
         client.reply(m.chat, teks, m)
      }
   },
   error: false,
   limit: true,
   group: true
}