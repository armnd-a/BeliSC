exports.run = {
   usage: ['infopremium', 'premium'],
   async: async (m, {
      client
   }) => {
      client.fakeGroupLink(m.chat, info(), global.db.setting.header, m.sender, m)
   },
   error: false,
   cache: true,
   location: __filename
}

let info = () => {
   return `*❏ INFO PREMIUM*
  
Dengan mendaftar menjadi user premium anda akan mendapatkan keuntungan sebagai berikut :

1. Bisa menggunakan semua fitur
2. mendapatkan unlimited limit
3. bisa memainkan di pesan pribadi

Silahkan hubungi owner ( *.owner* ) untuk melakukan upgrade premium hanya dengan Rp. 10.000 per bulan

Invite bot ke GC kalian ? ketik *.sewabot*`
}
