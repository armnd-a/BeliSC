exports.run = {
   usage: ['dnsiii', 'donasi'],
   async: async (m, {
      client
   }) => {
      client.sendMessageModify(m.chat, info(), m, {
            title: 'D O N A S I',
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/73e119fb7339beee795ce.jpg')
            })         
   },
   error: false,
   cache: true,
   location: __filename
}

let info = () => {
   return `*❏ D O N A S I*
┏━━⬣ 
┃Mari berdonasi bersama kami
┃untuk meringankan user beban
┃
┃Bagi Anda yang memiliki saldo lebih
┃bisa di donasikan melalui berikut ini.
┃
┃D A N A : [ 0822-8354-1084 ]
┃P U L S A : [ 0822-8354-1084 ]
┃P U L S A : [ 0878-2340-6145 ]
┃O V O : [ 0822-8354-1084 ]
┗⬣

note : *donasi seikhlasnya aja*`
}
