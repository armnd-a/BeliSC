exports.run = {
   usage: ['apakah', 'kapankah', 'siapakah'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      participants
   }) => {
      if (command == 'apakah') {
      	if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'saya ganteng'), m)
      	let random = Func.random(['benar', 'Mungkin iya', 'yo nda tau', 'kepo lu', 'mungkin tidak', 'jelas dong'])
      	let teks = `*Pertanyaan* : ${command} ${text}\n`
      	teks += `*Jawaban*: ${random}`
      	client.reply(m.chat, teks, m)
      } else if (command == 'kapankah') {
      	if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'saya coli'), m)
      	let time = Func.randomInt(1, 30)
      	let unit = Func.random(['detik', 'menit', 'jam', 'hari', 'minggu', 'bulan', 'tahun', 'dekade', 'abad'])
      	let teks = `*Pertanyaan* : ${command} ${text}\n`
      	teks += `*Jawaban*: ${time} ${unit} lagi . . .`
      	client.reply(m.chat, teks, m)
      } else if (command == 'siapakah') {
      	if (!text) return client.reply(m.chat, Func.example(isPrefix, command, 'kang coli'), m)
      	let member = participants.map(v => v.id)
      	let who = Func.random(member)
      	let teks = `*Pertanyaan* : ${command} ${text}?\n`
      	teks += `*Jawaban*: @${who.replace(/@.+/, '')}`
    	  client.reply(m.chat, teks, m)
      }
   },
   error: false,
   group: true,
   limit: 5,
   cache: true,
   location: __filename
}