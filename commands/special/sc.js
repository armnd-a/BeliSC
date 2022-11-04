exports.run = {
   usage: ['sc', 'tqto'],
   async: async (m, {
      client
   }) => {
      const buttons = [{
      buttonId: '.owner',
      buttonText: {
         displayText: 'OWNER'
      },
      type: 1
   }
]

const buttonMessage = {
   caption: "*BIG THANKS TO*\n\n• wildan Izzuddin\n• acuy\n• faruq\n• mel\n• adara cantik\n• aprildv\n• DiaryNikii\n• All creator bot",
   footer: 'Rikka bot',
   buttons: buttons,
   document: {
       url: 'https://telegra.ph/file/b7ad2a779a31241f0af1a.jpg'
    },
   headerType: 4,
   mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
   fileName: Func.greeting(m.pushName),
   fileLength: '990000000000000',
   pageCount: 1000,
   contextInfo: {
      externalAdReply: {
         mediaUrl: 'https://github.com',
         mediaType: 2,
         renderLargerThumbnail: false,
         showAdAttribution: true,
         title: `Script BOT? Klik ini\nAktif selama ${Func.toTime(process.uptime() * 1000)}`,
         thumbnail: await Func.fetchBuffer('https://telegra.ph/file/b7ad2a779a31241f0af1a.jpg'),
         sourceUrl: 'https://wa.me/6285807264974?text=script+nya+pengen+dong+bang'
      }
   }
}

return client.sendMessage(m.chat, buttonMessage)
   },
   error: false
}
