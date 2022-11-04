const axios = require('axios')
const cheerio = require('cheerio')

module.exports = class Anoboy {
   baseUrl = 'https://62.182.83.93'
   search = query => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get(this.baseUrl + '/?s=' + query.replace(new RegExp('\s', 'g'), '+'))).data
            let $ = cheerio.load(html)
            let data = []
            $('div.column-content').find('a').each((i, e) => {
               if ($(e).find('h3').text().trim() != '') {
                  data.push({
                     title: $(e).find('h3').text().trim(),
                     up: $(e).find('.jamup').text().replace(new RegExp('UP', 'g'), '').replace(new RegExp('Wib', 'g'), 'WIB').trim(),
                     url: $(e).attr('href')
                  })
               }
            })
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
            resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   detail = url => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get(url)).data
            let $ = cheerio.load(html)
            let stream = [],
               download = [],
               td = []
            $('div.vmiror').each((i, e) => {
               let url = []
               $(e).find('a').each((i, e) => {
                  if (!/loading.html/.test($(e).attr('data-video'))) {
                     url.push({
                        quality: $(e).text().trim(),
                        url: $(e).attr('data-video').startsWith('http') ? $(e).attr('data-video') : this.baseUrl + $(e).attr('data-video')
                     })
                  }
               })
               stream.push({
                  provider: $(e).text().split`|` [0].trim(),
                  url
               })
            })
            $('div#colomb').find('span[style="margin-bottom: 8px;"]').each((i, e) => {
               let url = []
               $(e).find('a').each((i, e) => url.push({
                  quality: $(e).text().trim(),
                  url: $(e).attr('href')
               }))
               download.push({
                  provider: $(e).find('span').text().trim(),
                  url
               })
            })
            $('div.contenttable > table').find('td').each((i, e) => td.push($(e).text().trim()))
            let data = {
               thumbnail: $('div[class="sisi entry-content"]').find('amp-img').attr('src') || false,
               title: $('div[class="sisi entry-content"]').find('h3').text().trim(),
               sinopsis: $('div.contentdeks').text().trim(),
               studio: td[1],
               duration: td[3],
               genre: td[4],
               score: td[5]
            }
            return resolve({
               creator: global.creator,
               status: true,
               data,
               stream,
               download
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