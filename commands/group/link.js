exports.run = {
   usage: ['link', 'getlink'],
   async: async (m, {
      client
   }) => {
      await client.sendMessage(m.chat, {
             text: `*LINK GROUP*\n\nJangan Lupa Salin Terus Share Biar Rame`,
             templateButtons: [{
             index: 1,
             urlButton: {
             displayText: `Salin tautan`,
             url: `https://www.whatsapp.com/otp/copy/https://chat.whatsapp.com/${(await client.groupInviteCode(m.chat))}`
            }
          }],
          footer: 'Simple WhatsApp Bot'
        })
   },
   group: true,
   botAdmin: true
}