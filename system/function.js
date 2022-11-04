const axios = require('axios')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fs = require('fs')
const mime = require('mime-types')
const http = require('https')
const chalk = require('chalk')
const path = require('path')
const FormData = require('form-data')
const tt = require('tiktok-scraper')
const {
   read,
   MIME_JPEG,
   RESIZE_BILINEAR,
   AUTO
} = require('jimp')
const {
   fromBuffer
} = require('file-type')
const {
   green,
   blueBright,
   redBright
} = require('chalk')
const {
   tmpdir
} = require('os')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')

class Function {
   delay = time => new Promise(res => setTimeout(res, time))
   isUrl(str) {
      let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
         '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
         '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
         '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
         '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
         '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
      return !!pattern.test(str)
   }

   async fetchJson(url, head = {}) {
      let result = await (await fetch(url, {
         headers: head
      })).json()
      return result
   }
      
   async fetchBuffer(str) {
      return new Promise(async (resolve, reject) => {
         if (this.isUrl(str)) {
            let buff = await (await fetch(str)).buffer()
            resolve(buff)
         } else {
            let buff = fs.readFileSync(str)
            resolve(buff)
         }
      })
   }

   random(list) {
      return list[Math.floor(Math.random() * list.length)]
   }

   randomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
   }

   ucword(str) {
      return (str + '').replace(/^([a-z])|\s+([a-z])/g, function($1) {
         return $1.toUpperCase();
      })
   }
   
   arrayJoin = (arr) => {

      var construct = []

      for (var i = 0; i < arr.length; i++) construct = construct.concat(arr[i])

      return construct

   }
   
   simpFormat(str) {
      try {
         let dot = str.match(/./g)
         let split = str.split('.')
         let getF = parseInt(split[1].substring(1, -split[1].length))
         let e
         if (dot.filter(v => v == '.').length == 1) e = ' Rb'
         if (dot.filter(v => v == '.').length == 2) e = ' Juta'
         if (dot.filter(v => v == '.').length == 3) e = ' Miliar'
         if (getF != 0) {
            var output = split[0] + '.' + getF + e
         } else {
            var output = split[0] + e
         }
         return output
      } catch {
         return str
      }
   }

   socmed = (url) => {
      const regex = [
         /^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/,
         /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/,
         /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:stories\/)(?:\S+)?$/,
         /^(?:https?:\/\/)?(?:www\.)?(?:mediafire\.com\/)(?:\S+)?$/,
         /pin(?:terest)?(?:\.it|\.com)/,
         /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/,
         /http(?:s)?:\/\/(?:www\.|mobile\.)?twitter\.com\/([a-zA-Z0-9_]+)/,
         /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/,
         /^(?:https?:\/\/)?(?:podcasts\.)?(?:google\.com\/)(?:feed\/)(?:\S+)?$/
      ]
      return regex.some(v => url.match(v))
   }
   
   level = (xp) => {
      var XPAsli = xp
      var level = 1
      while (xp > 1) {
         xp /= 2
         if (xp < 1) {
            level == level
         } else {
            level += 1
         }
      }
      var XPLevel = 1
      while (XPAsli >= XPLevel) {
         XPLevel = XPLevel + XPLevel
      }
      var sisaXP = XPLevel - XPAsli
      if (sisaXP == 0) sisaXP = XPLevel + XPLevel
      let kurang = XPLevel - sisaXP
      return [level, XPLevel, sisaXP, kurang]
   }
   
   h2k = (integer) => {
      try {
         let SI_POSTFIXES = ['', ' Ribu', ' Juta', ' Miliar', ' Triliun', ' Kuadriliun', ' Kuintiliun', ' Sektiliun', ' Septiliun', ' Oktiliun', ' Noniliun', ' Desiliun', ' Undesiliun', ' Duodesiliun', ' Tredesiliun', ' Kuattodesiliun', ' Kuindesiliun', ' Gogolchunk', ' Gogol', ' Sekdesiliun', ' Septemdesiliun', ' Oktodesiliun', ' Novemdesiliun', ' Vigintiliun', ' Unvigintiliun', ' Duovigintiliun', ' Trevigintiliun', ' Mikriliun', ' Pentesiliun', ' Ikosiliun', ' Triakontiliun', ' Xoniliun', ' Tetresiliun', ' Googolplex']
         let number = Number(integer).toLocaleString()
         let dot = number.match(/,/g)
         let split = number.split(',')
         let zero = parseInt(split[1].substring(1, -split[1].length))
         let postfix
         for (let i = 0; i < SI_POSTFIXES.length; i++)
            if (dot.filter(v => v == ',').length == i) postfix = SI_POSTFIXES[i]
         switch (true) {
            case zero != 0:
               var output = split[0] + '.' + zero + postfix
               break
            default:
               var output = split[0] + postfix
         }
         return output
      } catch {
         return integer
      }
   }
   
   matcher = (string, array, options) => {
      function levenshtein(value, other, insensitive) {
         var cache = []
         var codes = []
         var length
         var lengthOther
         var code
         var result
         var distance
         var distanceOther
         var index
         var indexOther

         if (value === other) {
            return 0
         }

         length = value.length
         lengthOther = other.length

         if (length === 0) {
            return lengthOther
         }

         if (lengthOther === 0) {
            return length
         }

         if (insensitive) {
            value = value.toLowerCase()
            other = other.toLowerCase()
         }

         index = 0

         while (index < length) {
            codes[index] = value.charCodeAt(index)
            cache[index] = ++index
         }

         indexOther = 0

         while (indexOther < lengthOther) {
            code = other.charCodeAt(indexOther)
            result = distance = indexOther++
            index = -1

            while (++index < length) {
               distanceOther = code === codes[index] ? distance : distance + 1
               distance = cache[index]
               cache[index] = result =
                  distance > result ?
                  distanceOther > result ?
                  result + 1 :
                  distanceOther :
                  distanceOther > distance ?
                  distance + 1 :
                  distanceOther
            }
         }
         return result
      }

      function similarity(a, b, options) {
         var left = a || ''
         var right = b || ''
         var insensitive = !(options || {}).sensitive
         var longest = Math.max(left.length, right.length)
         return ((longest === 0 ?
            1 :
            (longest - levenshtein(left, right, insensitive)) / longest) * 100).toFixed(1)
      }

      let data = []
      let isArray = array.constructor.name == 'Array' ? array : [array] || []
      isArray.map(v => data.push({
         string: v,
         accuracy: similarity(string, v)
      }))
      return data
   }
   
   greeting = (name) => {
      let time = moment.tz('Asia/Jakarta').format('HH')
      let res = "Jangan lupa tidur kak"
      if (time >= 4) {
         res = `Selamat Pagi ${name}`
      }
      if (time > 10) {
         res = `Selamat Siang ${name}`
      }
      if (time >= 15) {
         res = `Selamat Sore ${name}`
      }
      if (time >= 18) {
         res = `Selamat Malam ${name}`
      }
      return res
   }
   
   formatNumber(integer) {
      let numb = parseInt(integer)
      return Number(numb).toLocaleString().replace(/,/g, '.')
   }

   formatSize(size) {
      function round(value, precision) {
         var multiplier = Math.pow(10, precision || 0)
         return Math.round(value * multiplier) / multiplier
      }
      var _1MB = 1024 * 1024
      var _1GB = 1024 * _1MB
      var _1TB = 1024 * _1GB
      if (size < 1024) {
         return size + ' B'
      } else if (size < _1MB) {
         return round(size / 1024, 1) + ' KB'
      } else if (size < _1GB) {
         return round(size / _1MB, 1) + ' MB'
      } else if (size < _1TB) {
         return round(size / _1GB, 1) + ' GB'
      } else {
         return round(size / _1TB, 1) + ' TB'
      }
      return ''
   }

   async getSize(str) {
      if (!isNaN(str)) return this.formatSize(str)
      let header = await (await axios.get(str)).headers
      return this.formatSize(header['content-length'])
   }

   filename(extension) {
      return `${Math.floor(Math.random() * 10000)}.${extension}`
   }

   getId(url) {
      let regEx = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|shorts\/|v=)([^#\&\?]*).*/
      let id = url.match(regEx)
      return id[2]
   }

   texted(type, text) {
      switch (type) {
         case 'bold':
            return '*' + text + '*'
            break
         case 'italic':
            return '_' + text + '_'
            break
         case 'monospace':
            return '```' + text + '```'
      }
   }

   download(url, filename, callback) {
      let file = fs.createWriteStream(filename)
      http.get(url, function(response) {
         response.pipe(file)
         file.on('finish', function() {
            file.close(callback)
         })
      })
   }

   getFile = (source, filename, referer) => {
      return new Promise(async (resolve) => {
         try {
            if (Buffer.isBuffer(source)) {
               let ext, mime
               try {
                  mime = await (await fromBuffer(source)).mime
                  ext = await (await fromBuffer(source)).ext        
               } catch {
                  mime = require('mime-types').lookup(filename ? filename.split`.` [filename.split`.`.length - 1] : 'txt')
                  ext = require('mime-types').extension(mime)
               }
               let extension = filename ? filename.split`.` [filename.split`.`.length - 1] : ext
               let size = Buffer.byteLength(source)
               let filepath = tmpdir() + '/' + (filename || Func.uuid() + '.' + ext)
               let file = fs.writeFileSync(filepath, source)
               let data = {
                  status: true,
                  file: filepath,
                  filename: path.basename(filepath),
                  mime: mime,
                  extension: ext,
                  size: await Func.getSize(size),
                  bytes: size
               }
               return resolve(data)
            } else {
               axios.get(source, {
                  responseType: 'stream',
                  headers: {
                     'Referer': referer || ''
                  }
               }).then(async (response) => {
                  let extension = filename ? filename.split`.` [filename.split`.`.length - 1] : mime.extension(response.headers['content-type'])
                  let file = fs.createWriteStream(`${tmpdir()}/${filename || Func.uuid() + '.' + extension}`)
                  response.data.pipe(file)
                  file.on('finish', async () => {
                     let data = {
                        status: true,
                        file: file.path,
                        filename: path.basename(file.path),
                        mime: mime.lookup(file.path),
                        extension: extension,
                        size: await Func.getSize(response.headers['content-length'] ? response.headers['content-length'] : 0),
                        bytes: response.headers['content-length'] ? response.headers['content-length'] : 0
                     }
                     resolve(data)
                     file.close()
                  })
               })
            }
         } catch (e) {
            console.log(e)
            resolve({
               status: false
            })
         }
      })
   }

   color(text, color) {
      return chalk.keyword(color || 'green').bold(text)
   }

   mtype(data) {
      function replaceAll(str) {
         let res = str.replace(new RegExp('```', 'g'), '')
            .replace(new RegExp('_', 'g'), '')
            .replace(new RegExp(/[*]/, 'g'), '')
         return res
      }
      let type = (typeof data.text !== 'object') ? replaceAll(data.text) : ''
      return type
   }

   toTime(ms) {
      let h = Math.floor(ms / 3600000)
      let m = Math.floor(ms / 60000) % 60
      let s = Math.floor(ms / 1000) % 60
      return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
   }

   toMinute(ms) {
      let minutes = Math.floor(ms / 60000)
      let seconds = ((ms % 60000) / 1000).toFixed(0)
      return minutes + ":" + (seconds < 10 ? '0' : '') + seconds
   }

   timeReverse(duration) {
      let milliseconds = parseInt((duration % 1000) / 100),
         seconds = Math.floor((duration / 1000) % 60),
         minutes = Math.floor((duration / (1000 * 60)) % 60),
         hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
         days = Math.floor(duration / (24 * 60 * 60 * 1000))
      let hoursF = (hours < 10) ? "0" + hours : hours
      let minutesF = (minutes < 10) ? "0" + minutes : minutes
      let secondsF = (seconds < 10) ? "0" + seconds : seconds
      let daysF = (days < 10) ? "0" + days : days
      // return hours + " Jam " + minutes + " Menit" + seconds + " Detik" + milliseconds;
      return daysF + "D " + hoursF + "H " + minutesF + "M"
   }

   switcher(status, isTrue, isFalse) {
      return (status) ? this.texted('bold', isTrue) : this.texted('bold', isFalse)
   }

   async uploadImage(buffer) {
      let {
         ext
      } = await fromBuffer(buffer)
      let form = new FormData
      form.append('file', buffer, 'tmp.' + ext)
      let res = await fetch('https://telegra.ph/upload', {
         method: 'POST',
         body: form
      })
      let img = await res.json()
      if (img.error) throw img.error
      return 'https://telegra.ph' + img[0].src
   }

   extractLink(text) {
      let urlRegex = /(https?:\/\/[^ ]*)/;
      let result = text.match(urlRegex)
      return result
   }

   generateLink(text) {
      let regex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
      return text.match(regex)
   }

   sizeLimit(str, max) {
      let data
      if (str.match('G') || str.match('GB') || str.match('T') || str.match('TB')) return data = {
         oversize: true
      }
      if (str.match('M') || str.match('MB')) {
         let first = str.replace(/MB|M|G|T/g, '').trim()
         if (isNaN(first)) return data = {
            oversize: true
         }
         if (first > max) return data = {
            oversize: true
         }
         return data = {
            oversize: false
         }
      } else {
         return data = {
            oversize: false
         }
      }
   }

   reload(file) {
      fs.watchFile(file, () => {
         fs.unwatchFile(file)
         console.log(redBright.bold('[ UPDATE ]'), blueBright(moment(new Date() * 1).format('DD/MM/YY HH:mm:ss')), green.bold('~ ' + path.basename(file)))
         delete require.cache[file]
         require(file)
      })
   }

   shorten(url) {
      return new Promise(async (resolve, reject) => {
         try {
            let params = new URLSearchParams()
            params.append('url', url)
            let html = await (await fetch('https://is.gd/create.php', {
               method: 'POST',
               body: params
            })).text()
            let $ = cheerio.load(html)
            let link = $('input[class="tb"]').attr('value')
            if (typeof link == 'undefined' || link == '') return resolve({
               creator: '@neoxrs – Wildan Izzudin',
               status: false
            })
            resolve({
               creator: '@neoxrs – Wildan Izzudin',
               status: true,
               data: {
                  url: link
               }
            })
         } catch {
            resolve({
               creator: '@neoxrs – Wildan Izzudin',
               status: false
            })
         }
      })
   }

   example(isPrefix, command, args) {
      return `• ${this.texted('bold', 'Contoh')} : ${isPrefix + command} ${args}`
   }

   toDate(ms) {
      let temp = ms
      let days = Math.floor(ms / (24 * 60 * 60 * 1000));
      let daysms = ms % (24 * 60 * 60 * 1000);
      let hours = Math.floor((daysms) / (60 * 60 * 1000));
      let hoursms = ms % (60 * 60 * 1000);
      let minutes = Math.floor((hoursms) / (60 * 1000));
      let minutesms = ms % (60 * 1000);
      let sec = Math.floor((minutesms) / (1000));
      if (days == 0 && hours == 0 && minutes == 0) {
         return "baru-baru ini"
      } else {
         return days + "Hari " + hours + "Jam " + minutes + "Menit";
      }
   }

   removeSpace(str) {
      return str.replace(/\s/gi, '-')
   }

   uuid() {
      var dt = new Date().getTime()
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
         var r = (dt + Math.random() * 16) % 16 | 0;
         var y = Math.floor(dt / 16);
         return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      })
      return uuid
   }

   cleanArray(arrayToClean) {
      const cleanedArray = []
      arrayToClean.forEach((val) => {
         if (typeof val !== "undefined") {
            cleanedArray.push(val)
         }
      });
      return cleanedArray
   }

   createThumb = async (source) => {
      let {
         file
      } = await this.getFile(source)
      let jimp = await read(await this.fetchBuffer(file))
      let buff = await jimp
         .quality(100)
         .resize(200, AUTO, RESIZE_BILINEAR)
         .getBufferAsync(MIME_JPEG)
      return buff
   }

   removeItem(arr, value) {
      let index = arr.indexOf(value)
      if (index > -1) arr.splice(index, 1)
      return arr
   }

   igFixed(url) {
      let count = url.split('/')
      if (count.length == 7) {
         let username = count[3]
         let destruct = this.removeItem(count, username)
         return destruct.map(v => v).join('/')
      } else return url
   }

   ttFixed(url) {
      if (!url.match(/(tiktok.com\/t\/)/g)) return url
      let id = url.split('/t/')[1]
      return 'https://vm.tiktok.com/' + id
   }

   getEmo(str) {
      return str.match(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug)
   }

   jsonRandom = (file) => {
      let json = JSON.parse(fs.readFileSync(file))
      return json[Math.floor(Math.random() * json.length)]
   }
   
   jsonFormat(obj) {
      return require('util').format(obj)
   }
   
   uploadToServer = async (file, filename) => {
      return new Promise(async (resolve, reject) => {
         try {
            let form = new FormData
            form.append('berkas', file, filename)
            let json = await (await fetch(client.server + '/upload.php', {
               method: 'POST',
               body: form
            })).json()
            resolve(json)
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }
   
   backupDatabase(file) {
      return new Promise(async (resolve, reject) => {
         try {
            let form = new FormData
            form.append('berkas', file, 'database.json')
            let json = await (await fetch(global.server + '/upload.php', {
               method: 'POST',
               body: form
            })).json()
            resolve(json)
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }
   
   asupan(str) {
      return new Promise(async (resolve, reject) => {
         try {
            let tiktok = await (await tt.hashtag(str)).collector
            if (tiktok.length == 0) return resolve({
               creator: global.creator,
               status: false
            })
            let video = tiktok[Func.randomInt(0, tiktok.length)]
            let links = await Api.tiktok(video.webVideoUrl)
            if (!links.status) return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               creator: global.creator,
               status: true,
               author: video.authorMeta.nickName + ' (@' + video.authorMeta.name + ')',
               caption: video.text,
               data: links.data
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   makeId = (length) => {
      var result = ''
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
   }
   
   telesticker(url) {
      return new Promise(async (resolve, reject) => {
         try {
            let packname = url.replace('https://t.me/addstickers/', '')
            let json = await (await axios.get(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(packname)}`, {
               headers: {
                  'User-Agent': 'GoogleBot'
               }
            })).data
            let data = []
            let id = json.result.stickers.map(v => v.thumb.file_id)
            for (let i = 0; i < id.length; i++) {
               let path = await (await axios.get(`https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${id[i]}`)).data
               data.push({
                  url: 'https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/' + path.result.file_path
               })
            }
            resolve({
               creator: global.creator,
               status: true,
               data
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }
   
   facebook(url) {
      return new Promise(async (resolve, reject) => {
         try {
            let header = {
               headers: {
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                  "Accept": "*/*",
                  "X-Requested-With": "XMLHttpRequest",
                  "Referer": "https://yt1s.io/",
                  "Referrer-Policy": "strict-origin-when-cross-origin"
               }
            }
            let params = new URLSearchParams()
            params.append('q', url)
            params.append('vt', 'facebook')
            let json = await (await fetch('https://yt1s.io/api/ajaxSearch/facebook', {
               method: 'POST',
               body: params,
               ...header
            })).json()
            if (typeof json.links.sd == 'undefined' && typeof json.links.hd == 'undefined') resolve({
               creator: global.creator,
               status: false
            })
            let data = [
               ((typeof json.links.sd != 'undefined') ? {
                  quality: 'SD',
                  url: json.links.sd,
                  response: 200
               } : {
                  quality: 'SD',
                  url: null,
                  response: 404
               }),
               ((typeof json.links.hd != 'undefined') ? {
                  quality: 'HD',
                  url: json.links.hd,
                  response: 200
               } : {
                  quality: 'HD',
                  url: null,
                  response: 404
               })
            ]
            resolve({
               creator: global.creator,
               status: true,
               data
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }
   
   toMP4(buffer) {
      return new Promise(async (resolve) => {
         try {
            let params = new FormData
            params.append('new-image', buffer, 'image.webp')
            params.append('new-image-url', '')
            let html = await (await fetch('https://s6.ezgif.com/webp-to-mp4', {
               method: 'POST',
               body: params
            })).text()
            let ch = cheerio.load(html)
            let target = 'https://ezgif.com/' + ch('form[class="form"]').attr('action')
            let file = ch('input[name="file"]').attr('value')
            let form = new URLSearchParams
            form.append('file', file)
            form.append('convert', 'Convert WebP to MP4!')
            let output = await (await fetch(target, {
               method: 'POST',
               body: form
            })).text()
            let $ = cheerio.load(output)
            let out = $('p.outfile').find('source').attr('src')
            if (typeof out == 'undefined') return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               creator: global.creator,
               status: true,
               url: 'https:' + out
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }
   
   ghstalk(username) {
      return new Promise(async (resolve) => {
         try {
            let json = await Func.fetchJson('https://api.github.com/users/' + username)
            if (typeof json.message != 'undefined') return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               creator: global.creator,
               status: true,
               data: json
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }
   
   screenshot(url, args = 1) {
      return new Promise(async (resolve, reject) => {
         try {
            let dimention
            if (args == 1) dimention = {
               'width': 1440,
               'height': 1024
            }
            if (args == 2) dimention = {
               'width': 375,
               'height': 812
            }
            let json = await (await axios.post('https://screenshot.neoxr.my.id/api', {
               'url': url,
               ...dimention,
               'scale': 2,
               'full': false,
               'isTweet': false,
               'format': 'jpeg'
            })).data
            resolve({
               creator: global.creator,
               status: true,
               data: json
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }
   
}

exports.Function = Function
