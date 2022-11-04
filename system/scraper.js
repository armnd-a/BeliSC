const axios = require('axios')
const cheerio = require('cheerio')
const yts = require('yt-search')
const {
   decode
} = require('html-entities')
const y2mate = require('../lib/y2mate')
global.creator = `instagram : @chyangrhaa`
const drakorasia = new (require('../lib/drakor'))
const anoboy = new (require('../lib/anoboy'))
const movie = new (require('../lib/movie'))

class Scraper {

   async youtube(url, type = 'combine') {
      if (type == 'combine') {
         var json = await y2mate.yt(url)
      } else if (type == 'audio') {
         var json = await y2mate.yta(url)
      } else if (type == 'video') {
         var json = await y2mate.ytv(url)
      }
      return json
   }

   async ytvh(url) {
      let json = await y2mate.ytvh(url)
      return json
   }
   
   async film(str) {
      let json = str.match('167.99.64.64') ? await movie.detail(str) : await movie.search(str)
      return json
   }
   
   drakor = async (str) => {
      let json = str.match('173.212.240.190') ? await drakorasia.detail(str) : await drakorasia.search(str)
      return json
   }

   chatAI = (text) => {
      return new Promise(async (resolve) => {
         try {
            let json = await (await axios.get('http://api.brainshop.ai/get?bid=164728&key=MKPsfkgXLZPGrWoH&uid=neoxr&msg=' + encodeURI(text))).data
            if (typeof json.cnt == 'undefined') return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               cretor: global.creator,
               status: true,
               msg: json.cnt
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
   
   play(query, audio = true, combine = false) {
      let yts = require('yt-search')
      return new Promise(async (resolve, reject) => {
         try {
            let yt = await (await yts.search(query)).all[0]
            if (typeof yt == 'undefined') return resolve({
               creator: global.creator,
               status: false,
               msg: 'Not found!'
            })
            let json = combine ? await y2mate.yt(yt.url) : audio ? await y2mate.yta(yt.url) : await y2mate.ytv(yt.url)
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
   
   artinama = (nama) => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get(`https://www.primbon.com/arti_nama.php?nama1=${nama}&proses=+Submit%21+`)).data
            let $ = cheerio.load(html)
            let data = {}
            data.arti = $('#body').text().split('ARTI NAMA\n')[1].split('Nama:\n')[0].trim()
            if (!data.arti) return resolve({
               creator: global.creator,
               status: false
            })
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
   
   wallpaper = (query) => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get('https://www.wallpaperflare.com/search?wallpaper=' + query)).data
            let $ = cheerio.load(html)
            let data = []
            $('li[itemprop="associatedMedia"]').each((i, e) => data.push({
               size: $(e).find('meta[itemprop="contentSize"]').attr('content'),
               dimention: $(e).find('span.res').text().replace(new RegExp('px', 'g'), '').replace(/x/i, ' × ').trim(),
               url: $(e).find('img').attr('data-src')
            }))
            if (data.length == 0) return resolve({
               creator: global.creator,
               status: false
            })
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
   
   whatanime(url) {
      return new Promise(async (resolve) => {
         try {
            let json = await (await axios.get('https://api.trace.moe/search?url=' + encodeURIComponent(url))).data
            if (json.error) return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               creator: global.creator,
               status: true,
               data: json.result[0]
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
   
	anime = async (str) => {
      let json = str.match('62.182.83.93') ? await anoboy.detail(str) : await anoboy.search(str)
      return json
   }
   
   pinterest = (querry) => {
      return new Promise(async (resolve, reject) => {
         try {
            axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
               headers: {
                  "cookie": "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
               }
            }).then(({
               data
            }) => {
               const $ = cheerio.load(data)
               const result = []
               const img = []
               $('div > a').get().map(b => {
                  const link = $(b).find('img').attr('src')
                  result.push(link)
               });
               result.forEach(v => {
                  if (v == undefined) return
                  img.push({
                     url: v.replace(/236/g, '736')
                  })
               })
               img.shift()
               if (img.length == 0) return resolve({
                  creator: global.creator,
                  status: false
               })
               resolve({
                  creator: global.creator,
                  status: true,
                  data: img
               })
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
   
   ig = (url) => {   
	return new Promise(async(resolve, reject) => {
		try {
            let html = await (await axios.get('https://www.instagramsave.com/download-instagram-videos.php')).data
            let soup = cheerio.load(html)
            let token = soup('meta[name="#token"]').attr('value')
		    let header = {
               headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
					"sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
					"cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg",
					"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
		        }
            }
            let form = new URLSearchParams
            form.append('url', url)
            form.append('_token', token)
            let json = await (await axios.post('https://www.instagramsave.com/system/action.php', form, header)).data
            if (!json.status) return resolve({
               creator: global.creator,
               status: false
            })
            let $ = cheerio.load(json.html)
            let data = {
               video: $($('a')[0]).attr('href'),
               audio: $($('a')[1]).attr('href')
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
   
   tiktok = (url) => {
      return new Promise(async (resolve, reject) => {
         try {
            let html = await (await axios.get('https://tikdown.org/')).data
            let soup = cheerio.load(html)
            let token = soup('meta[name="csrf-token"]').attr('content')
            let header = {
               headers: {
                  "Accept": "application/json, text/javascript, */*; q=0.01",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                  "Referer": "https://tikdown.org/",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "X-CSRF-TOKEN": token
               }
            }
            let form = new URLSearchParams
            form.append('url', url)
            form.append('_token', token)
            let json = await (await axios.post('https://tikdown.org/getAjax', form, header)).data
            if (!json.status) return resolve({
               creator: global.creator,
               status: false
            })
            let $ = cheerio.load(json.html)
            let data = {
               video: $($('a')[0]).attr('href'),
               audio: $($('a')[1]).attr('href')
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

   urban(q) {
      return new Promise(async (resolve, reject) => {
         try {
            let html = await (await axios.get('https://www.urbandictionary.com/define.php?term=' + q)).data
            let $ = cheerio.load(html)
            let content = [],
               author = []
            $('div.meaning').each((i, e) => content.push($(e).text()))
            $('div.contributor').each((i, e) => author.push($(e).text()))
            if (content.lenght == 0 || author.lengh == 0) return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  content: content[0].trim(),
                  author: author[0].trim()
               }
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
}

exports.Scraper = Scraper