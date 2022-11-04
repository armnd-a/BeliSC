const fs = require('fs')
exports.run = {
	usage: ['fakta', 'senja', 'kataanime', 'sindiran'],
	async: async (m, { client, text, command }) => {
		if (command == 'fakta') {
			let fakta = JSON.parse(fs.readFileSync('./media/json/fakta.json'))
    		let mix = Math.floor(Math.random() * fakta.length)
   		 let txt = fakta[mix]
			client.reply(m.chat, `“${txt}”`, m)
		} else if (command == 'senja') {
			let senja = JSON.parse(fs.readFileSync('./media/json/senja.json'))
    		let mix = Math.floor(Math.random() * senja.length)
   		 let txt = senja[mix]
			client.reply(m.chat, `“${txt}”`, m)
		} else if (command == 'kataanime') {
			let kataanime = JSON.parse(fs.readFileSync('./media/json/kataanime.json'))
    		let mix = Math.floor(Math.random() * kataanime.length)
   		 let txt = kataanime[mix]
			client.reply(m.chat, `“${txt}”`, m)	
		} else if (command == 'sindiran') {
			let sindiran = JSON.parse(fs.readFileSync('./media/json/sindiran.json'))
    		let mix = Math.floor(Math.random() * sindiran.length)
   		 let txt = sindiran[mix]
			client.reply(m.chat, `“${txt}”`, m)
		}
	},
	error: false
}