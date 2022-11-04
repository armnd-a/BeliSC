exports.run = {
   usage: ['cekabsen'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      let id = m.chat
      client.absen = client.absen ? client.absen : {}
      if (!(id in client.absen)) return client.reply(m.chat, Func.texted('bold', `🚩 Absen tidak sedang berlangsung, untuk memulai absen silahkan kirim ${isPrefix}abs`), m)
      let absen = client.absen[id][1]
      let d = new Date
      let date = d.toLocaleDateString('id', {
         day: 'numeric',
         month: 'long',
         year: 'numeric'
      })
      let teks = `乂  *A B S E N*\n\n`
      teks += `Tanggal : ${date}, Total : ${absen.length}\n\n`
      teks += absen.map((v, i) => `	◦  @${v.split`@`[0]}`).join('\n')
      teks += `\n\nSilahkan kirim *${isPrefix}hadir* untuk absen kehadiran dan *${isPrefix}cekabsen* untuk mengecek absen.`
      client.fakeStory(m.chat, teks, global.db.setting.header)
   },
   group: true
}