const axios = require('axios')
const cheerio = require('cheerio')

module.exports = class Wattpad {
   search = query => {
      return new Promise(async (resolve) => {
         try {
            let header = {
               headers: {
                  'Accept': 'application/json, text/javascript, */*; q=0.01',
                  'Accept-Language': 'id',
                  'Authorization': 'IwKhVmNM7VXhnsVb0BabhS',
                  'X-Requested-With': 'XMLHttpRequest'
               }
            }
            let json = await (await axios.get('https://www.wattpad.com/v4/search/stories?query=' + query + '&fields=stories%28id%2Ctitle%2CvoteCount%2CreadCount%2CcommentCount%2Cdescription%2Ccompleted%2Cmature%2Ccover%2Curl%2CisPaywalled%2Clength%2Clanguage%28id%29%2Cuser%28name%29%2CnumParts%2ClastPublishedPart%28createDate%29%2Cpromoted%2Csponsor%28name%2Cavatar%29%2Ctags%2Ctracking%28clickUrl%2CimpressionUrl%2CthirdParty%28impressionUrls%2CclickUrls%29%29%2Ccontest%28endDate%2CctaLabel%2CctaURL%29%29%2Ctotal%2Ctags%2Cnexturl&limit=20', header)).data
            let data = []
            json.stories.map(v => data.push({
               id: v.id,
               title: v.title,
               parts: v.numParts,
               status: v.completed ? 'Complete' : 'Ongoing',
               author: v.user,
               reads: v.readCount.toLocaleString(),
               votes: v.voteCount.toLocaleString(),
               comments: v.commentCount.toLocaleString(),
               url: v.url
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
            let parts = [],
               stats = []
            $($('div.story-parts')[0]).find('li').each((i, e) => parts.push({
               title: $(e).find('a').text().trim(),
               url: 'https://www.wattpad.com' + $(e).find('a').attr('href')
            }))
            $($('ul.new-story-stats')[0]).find('div.tool-tip').each((i, e) => stats.push($(e).attr('data-tip').trim()))
            let data = {
               thumbnail: $('div.story-cover').find('img').attr('src'),
               title: $('div.story-info__title').text().trim(),
               description: $('pre.description-text').text().split('\n').map(v => v.trim()).join('\n').replace(/[\r\n]{2,}/g, '\n\n').trim(),
               author: $($('div.author-info__username')[0]).text().trim(),
               reads: stats[0],
               votes: stats[1],
               numPart: stats[2],
               parts
            }
            if (!data.title) return resolve({
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

   read = url => {
      return new Promise(async (resolve) => {
         try {
            let html = await (await axios.get(url)).data
            let $ = cheerio.load(html)
            let data = {
               thumbnail: $('div.story-info').find('img.cover').attr('src'),
               title: $('h3.item-title').text().trim(),
               category: $('a.item-category').text().trim(),
               part: $('h1.h2').text().trim(),
               reads: $('div.story-stats').find('span.reads').text().trim(), // Number($('div.story-stats').find('span.reads').attr('title').replace(/\D/g, '').trim()).toLocaleString()
               votes: $('div.story-stats').find('span.votes').text().trim(), // Number($('div.story-stats').find('span.votes').attr('title').replace(/\D/g, '').trim()).toLocaleString()
               comments: $('div.story-stats').find('span[class="comments on-comments"]').text().trim(), // Number($('div.story-stats').find('span[class="comments on-comments"]').attr('title').replace(/\D/g, '').trim()).toLocaleString(),
               by: $('div[class="author hidden-lg"]').find('a.on-navigate').text().trim(),
               content: $('div.panel-reading > pre').text().trim().split('\n').map(v => v.trim()).join('\n\n').replace(/[\r\n]{2,}/g, '\n\n')
            }
            if (!data.content) return resolve({
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
}