const axios = require('axios'),
   cheerio = require('cheerio'),
   qs = require('qs'),
   fetch = require('node-fetch'),
   cookie = require('cookie'),
   FormData = require('form-data')

module.exports = class Tiktok {
   init = {
      site: '' || 'https://downvideo.quora-wiki.com',
      set target(url) {
         return this.site = url
      }
   }

   origin = (url) => {
      return new Promise(async (resolve) => {
         try {
            let form = {
               data: {
                  'url': url,
                  'token': ''
               }
            }
            let json = await (await axios.post(this.init.site + '/system/action.php', qs.stringify(form.data), {
               headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
               }
            })).data
            resolve({
               creator: global.creator,
               status: true,
               ...json
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

   expander = (url) => {
      return new Promise(async (resolve, reject) => {
         try {
            let Go = await fetch('https://unshorten.it/', {
               method: 'GET',
               headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                  "Referer": "https://unshorten.it",
                  "Referrer-Policy": "strict-origin-when-cross-origin"
               }
            })
            let isCookie = Go.headers.get('set-cookie').split(',').map((v) => cookie.parse(v)).reduce((a, c) => {
               return {
                  ...a,
                  ...c
               }
            }, {})
            let isHtml = await Go.text()
            isCookie = {
               'csrftoken': isCookie['csrftoken']
            }
            isCookie = Object.entries(isCookie).map(([name, value]) => cookie.serialize(name, value)).join(' ')
            let $ = cheerio.load(isHtml)
            let token = $("input[name='csrfmiddlewaretoken']").attr('value')
            let form = new FormData
            form.append('short-url', url)
            form.append('csrfmiddlewaretoken', token)
            let json = await (await fetch('https://unshorten.it/main/get_long_url', {
               method: 'POST',
               headers: {
                  Accept: "*/*",
                  "Accept-Language": "en-US,enq=0.9",
                  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                  "Referer": "https://unshorten.it",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  Cookie: isCookie,
                  ...form.getHeaders()
               },
               body: form
            })).json()
            if (!json.success) resolve({
               creator: global.creator,
               status: false
            })
            return resolve({
               creator: global.creator,
               status: true,
               data: {
                  short: url,
                  long: json.long_url
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

   getLongUrl = async url => {
      var res = await this.expander(url)
      return res.data
   }

   fetchInfo = (url) => {
      return new Promise(async (resolve) => {
         try {
            const expand = await this.getLongUrl(url)
            const parse = await (await require('tiktok-scraper').getVideoMeta(expand.long)).collector[0]
            if (!parse.videoMeta) return resolve({
               creator: global.creator,
               status: false
            })
            return resolve({
               creator: global.creator,
               status: true,
               data: parse
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false,
               server: this.init.site,
            })
         }
      })
   }

   fetchData = async url => {
      try {
         let json = await this.origin(url)
         if (!json.status) return json
         let downloads = []
         json.medias.map((v, i) => {
            downloads.push({
               type: (i === 1) ? 'no_watermark' : (i === 2) ? 'audio' : v.quality,
               url: v.url,
               extension: v.extension,
               size: v.formattedSize
            })
         })
         let info = await this.fetchInfo(url)
         if (!info.status) return ({
            creator: global.creator,
            status: false
         })
         return ({
            creator: global.creator,
            status: true,
            data: info.data,
            downloads
         })
      } catch (e) {
         console.log(e)
         return ({
            creator: global.creator,
            status: false
         })
      }
   }
}