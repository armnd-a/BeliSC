exports.run = {
   usage: ['adventure'],
   async: async (m, {
      client,
      isPrefix,
      participants
   }) => {
      if (!global.db.setting.games) return client.reply(m.chat, Func.texted('bold', `Fitur game dinonaktifkan sementara oleh owner.`), m)
      if (!global.db.groups[m.chat].game) return client.reply(m.chat, Func.texted('bold', `Fitur game tidak diaktifkan di grup ini.`), m)
      client.adventure = client.adventure ? client.adventure : {}
      if (typeof client.adventure[m.sender] != "undefined" && client.adventure[m.sender] == true) return client.reply(m.chat, `*Tidak bisa melakukan adventure lagi karena anda sedang di dalam game bro.*`, m)
      let users = participants.map(v => v.id)
      var lawan
      lawan = Func.random(users)
      while (typeof global.db.users[lawan] == 'undefined') {
         lawan = Func.random(users)
      }
      let lamaPertarungan = Func.randomInt(1, 5)
      let kegiatan = ['mengocok', 'cipokan', 'gelud', 'mencari janda muda', 'menjual tengtop kakak', 'memuja kerang ajaib', 'gibahin admin', 'tertidur pulas', 'joged pargoy', 'nyari cewe sexy di tiktok', 'nonton bokep anime', 'berjualan bakso', 'ngegay', 'farming mangga tetangga', 'berenang', 'makan babi']
      let sifat = ['sangean', 'raja ngocok', 'ratu colmek', 'lord senja', 'kang bakso', 'kang gibah', 'culun', 'kang nyatir', 'jagoan', 'abang jago', 'pemuja elite', 'pemuja setan']
      client.reply(m.chat, `*Kamu* dan *@${lawan.replace(/@.+/, '')}* si ${Func.random(sifat)} dalam petualangan dan sedang ${Func.random(kegiatan)} bersama.\n\nTunggu ${lamaPertarungan} menit lagi.`, m)
      client.adventure[m.sender] = true
      await Func.delay(1000 * 60 * lamaPertarungan)
      let alasanKalah = ['cupu', 'tolol', 'kebanyakan coli', 'kurang tidur', 'pedang patah', 'tangan buntung', 'pincang', 'mimpi basah', 'dicurangi', 'belum ngopi', 'belum mandi', 'dengkul kopong', 'gay', 'dibenci owner', 'belum upgrade premium', 'berak pake wc duduk']
      let alasanMenang = ['hebat', 'tidak suka merokok', 'punya pedang panjang', 'punya pedang kuat', 'tidak suka coli', 'sudah ngopi pagi ini', 'disayang owner', 'bisa salto', 'jago', 'rajin nonton animek', 'tidak suka ngocok batang', 'tidak gay']
      let musuh = ['raja nyatir', 'komandan sange', 'gajah berkepala kuda', 'alucard afk', 'veteran', 'naga kepala tiga', 'anjing rabies', 'bapakmu', 'lord orochimaru', 'guru matematika', 'guru BK', 'kepala sekolah', 'koruptor', 'si kontol']
      let hasil = Func.randomInt(0, 1)
      if (hasil == 1) {
         let hadiah = Func.randomInt(1, 7)
         global.db.users[m.sender].point += Math.floor(global.db.users[m.sender].point / 100 * hadiah)
         client.reply(m.chat, `*Kamu* dan *@${lawan.replace(/@.+/, '')}* berhasil mengalahkan ${Func.random(musuh)} karena kalian berdua ${Func.random(alasanMenang)}\n\nHadiah Rp. ${Math.floor(global.db.users[m.sender].point / 100 * hadiah).toLocaleString()}`, m)
      } else {
         let denda = Func.randomInt(5, 10)
         global.db.users[m.sender].point -= Math.floor(global.db.users[m.sender].point / 100 * denda)
         client.reply(m.chat, `*Kamu* dan *@${lawan.replace(/@.+/, '')}* gagal mengalahkan ${Func.random(musuh)} karena kalian berdua ${Func.random(alasanKalah)}.\n\nUang kamu berkurang Rp. ${Math.floor(global.db.users[m.sender].point / 100 * denda).toLocaleString()}`, m)
      }
   },
   group: true,
   game: true,
   cache: true,
   location: __filename
}