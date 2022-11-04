exports.run = {
   usage: ['ping'],
   async: async (m, {
      client,
      text
   }) => {
      client.reply(m.chat, text || '❏ *Download* : 80.61 mbps\n❏ *Upload* : 1006.27 mbps\n❏ *Response* : 3365 ms', m)
   },
   error: false,
   cache: true,
   location: __filename
}