exports.run = {
   usage: ['abs'],
   async: async (m, {
      client,
      isPrefix,
      participants
   }) => {
      let id = m.chat
      let member = participants.map(v => v.id)
      client.absen = client.absen ? client.absen : {}
      if (id in client.absen) return client.reply(m.chat, Func.texted('bold', `^ absen sebelumnya belum selesai.`), client.absen[id][0])
      client.absen[id] = [
         await client.reply(m.chat, Func.texted('bold', `🚩 Absen di mulai berlangsung selama 15 menit, jika tidak ingin di kick dari grup silahkan kirim ${isPrefix}hadir untuk kehadiran.`), m, {
            contextInfo: {
               mentionedJid: member
            }
         }),
         [],
         setTimeout(() => {
            if (client.absen[id]) {
               if (client.absen[id][1].length == 0) {
                  client.reply(m.chat, Func.texted('bold', `🚩 15 menit berlalu, absen selesai dan tidak ada yang hadir.`), client.absen[id][0])
               } else {
                  let d = new Date
                  let date = d.toLocaleDateString('id', {
                     day: 'numeric',
                     month: 'long',
                     year: 'numeric'
                  })
                  let teks = `乂  *A B S E N*\n\n`
                  teks += `Tanggal : ${date}, Total : ${client.absen[id][1].length}\n\n`
                  teks += client.absen[id][1].map((v, i) => `	◦  @${v.split`@`[0]}`).join('\n')
                  teks += `\n\n15 menit berlalu, sesi absen telah selesai.`
                  client.reply(m.chat, teks, client.absen[id][0])
               }
            }
            delete client.absen[id]
         }, 900_000)
      ]
   },
   group: true,
   admin: true
}