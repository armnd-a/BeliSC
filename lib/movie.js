const axios = require('axios')
const cheerio = require('cheerio')

module.exports = class Movie {
   search = query => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get('http://167.99.64.64/?s=' + query.replace(new RegExp('\s', 'g'), '+') + '&post_type%5B%5D=post&post_type%5B%5D=tv')).data
            let $ = cheerio.load(html)
            let data = []
            $('article').each((i, e) => {
               let genre = []
               $(e).find('div.gmr-movie-on > a').each((i, e) => genre.push($(e).text().trim()))
               data.push({
                  title: $(e).find('h2').text().trim(),
                  rating: $(e).find('div.gmr-rating-item').text().trim(),
                  duration: $(e).find('div.gmr-duration-item').text().trim(),
                  genre,
                  quality: $(e).find('div.gmr-quality-item').text().trim(),
                  url: $(e).find('h2 > a').attr('href')
               })
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

   jsonId = url => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get(url)).data
            let $ = cheerio.load(html)
            const js = JSON.parse($('script[class="yoast-schema-graph"]').html())
            const select = js['@graph'].find(v => v['@type'] == 'Article')
            return resolve({
               thumbnail: select.thumbnailUrl,
               title: select.headline,
               genre: select.articleSection.map(v => v).join(', ')
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
            let state = [],
               download = [],
               moviedata = []
            $('div.content-moviedata').find('div.gmr-moviedata').each((i, e) => state.push($(e).text().trim()))
            $('div#download').find('a').each((i, e) => download.push({
               provider: $(e).text(),
               url: $(e).attr('href')
            }))
            state.map(v => {
               let key = v.split`:` [0]
               let value = v.split`:` [1].trim()
               if (!/Genre|Posted/.test(key)) {
                  moviedata.push({
                     [key]: value
                  })
               }
            })
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  ...await this.jsonId(url),
                  trailer: $('a.gmr-trailer-popup').attr('href'),
                  sinopsis: $('article').find('p').text().trim()
               },
               moviedata: moviedata.splice(1, moviedata.length),
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