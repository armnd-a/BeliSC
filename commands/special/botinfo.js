exports.run = {
   usage: ['sewabot', 'sewa', 'hargabot'],
   async: async (m, {
      client
   }) => {
      client.sendMessageModify(m.chat, info(), m, {
            title: 'Jasa Sewa Bot',
            largeThumb: true,
            thumbnailUrl: 'https://telegra.ph/file/20b22b4902ccf84615a0a.jpg'
            })
   },
   error: false,
   cache: true,
   location: __filename
}

let info = () => {
   return `*❏ SEWA BOT*

Untuk fitur bot bisa baca menu sampai selesai ya kak, dicoba coba dulu biar tau ( Ketik *.menu* )
Silahkan hubungi owner ( Ketik *.owner* ) jika ingin menyewa bot untuk grup chat kalian

➠ Sewa (Join Grup) harga 10K / bulan dan akan keluar otomatis saat masa aktif sudah habis, apabila bot di kick dari grup sengaja atau tidak sengaja tidak bisa di join kan lagi (Hangus).

➠ Pembayaran saat ini hanya tersedia via Dana dan Rekening Bank.

➠ Proses transaksi seperti pada umumnya, chat owner terlebih dahulu untuk menanyakan nomor tujuan transfer setelah itu screenshot bukti pembayaran.

➠ *Penting!* simpan nomor owner dan join ke dalam grup official dibawah untuk mengetahui update nomor bot terbaru apabila ter-banned.

Untuk upgrade premium hanya Rp. 10.000 per bulan ( *.infopremium* )`
}
