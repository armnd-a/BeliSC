const axios = require('axios')
const cheerio = require('cheerio')

module.exports = class Drakor {
   search = query => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get('https://173.212.240.190/?s=' + query.replace(new RegExp('\s', 'g'), '+') + '&post_type=post')).data
            let $ = cheerio.load(html)
            let data = []
            $('div#post').each((i, e) => {
               let addr = $(e).text().split('Eps')[0].split(' ')
               data.push({
                  title: $(e).find('h2').text().trim(),
                  episode: addr[addr.length - 1].trim(),
                  release: addr[addr.length - 3].trim(),
                  genre: $(e).find('div.genrenya').text().trim().split(' '),
                  url: $(e).find('a').attr('href')                 
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

   detail = url => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get(url)).data
            let $ = cheerio.load(html)
            let P = $($('div.detail > p')[0]).text().split('/')
            let cast = []
            $('p.text-xs').find('a').each((i, e) => cast.push($(e).text().trim()))
            let episode = []
            $('table.mdl-data-table').find('tr').each((i, e) => {
               let urls = []
               $($(e).find('td')[1]).find('a').each((i, e) => urls.push({
                  provider: $(e).text().trim(),
                  url: $(e).attr('href')
               }))
               episode.push({
                  episode: $($(e).find('td')[0]).text(),
                  urls
               })
            })
            episode.shift()
            let data = {
               thumbnail: $('div.thumbnail').find('img').attr('src'),
               title: $('div.detail').find('h2').text().split('Episode')[0].trim() + ' (' + P[0].trim() + ')',
               episode: P[2].trim(),
               release: P[1].trim(),
               genre: $('p.gens').text().trim().split(' '),
               duration: ($('div.durs').text().trim()).replace(/\D/g, '') + ' Minutes',
               channel: $('div.durs').find('a').text().trim(),
               cast,
               sinopsis: $('p.caps').text().trim(),
               episodes: episode
            }
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
}