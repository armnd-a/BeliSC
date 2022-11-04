const fs = require('fs')
exports.run = {
	usage: ['truth', 'dare'],
	async: async (m, { client, text, command }) => {
		if (command == 'truth') {
			let fakta = JSON.parse(fs.readFileSync('./media/json/truth.json'))
    		let mix = Math.floor(Math.random() * fakta.length)
   		 let txt = fakta[mix]
   		    client.sendMessageModify(m.chat, `*❏ T R U T H*\n\n${txt}\n\n𝘁𝗿𝘂𝘁𝗵 𝗼𝗿 𝗱𝗮𝗿𝗲`, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/ba55209f87abd428edbf7.jpg'),
            url: 'https://chat.whatsapp.com/EARvthLENgw2yxhDUKDuMr'
         })
		} else if (command == 'dare') {
			let senja = JSON.parse(fs.readFileSync('./media/json/dare.json'))
    		let mix = Math.floor(Math.random() * senja.length)
   		 let txt = senja[mix]
			client.sendMessageModify(m.chat, `*❏ D A R E*\n\n${txt}\n\n𝘁𝗿𝘂𝘁𝗵 𝗼𝗿 𝗱𝗮𝗿𝗲`, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/ba55209f87abd428edbf7.jpg'),
            url: 'https://chat.whatsapp.com/EARvthLENgw2yxhDUKDuMr'
         })
		}
	},
	error: false
}