exports.run = {
   usage: ['picskip', 'quizskip'],
   async: async (m, {
      client,
      isPrefix,
      command
   }) => {
      var id = m.chat
      if (command == 'picskip') {
         client.whatpic = client.whatpic ? client.whatpic : {}
         if ((id in client.whatpic)) return client.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan whatpic berhasil di hapus.`), m).then(() => delete client.whatpic[id])
      } else if (command == 'quizskip') {
         client.quiz = client.quiz ? client.quiz : {}
         if ((id in client.quiz)) return client.reply(m.chat, Func.texted('bold', `🚩 Sesi permainan quiz berhasil di hapus.`), m).then(() => {
            clearTimeout(client.quiz[id][2])
            delete client.quiz[id]
         })
      }
   },
   group: true,
   limit: true,
   game: true
}