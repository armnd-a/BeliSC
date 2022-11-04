const fs = require('fs')
const { writeFile } = require('fs/promises')
const mime = require('mime-types')
const path = require('path')
const {
   promisify
} = require('util')
const {
   resolve
} = require('path')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const fetch = require('node-fetch')
const FileType = require('file-type')
const ffmpeg = require('fluent-ffmpeg')
const {
   tmpdir
} = require('os')
const {
   default: makeWASocket,
   proto,
   delay,
   downloadContentFromMessage,
   MessageType,
   Mimetype,
   generateWAMessage,
   generateWAMessageFromContent,
   generateForwardMessageContent,
   generateThumbnail,
   getContentType,
   prepareWAMessageMedia,
   WAMessageProto,
   extractImageThumb
} = require('@adiwajshing/baileys')
const PhoneNumber = require('awesome-phonenumber')
const WSF = require('wa-sticker-formatter')

Socket = (...args) => {
   let client = makeWASocket(...args)
   Object.defineProperty(client, 'name', {
      value: 'WASocket',
      configurable: true,
   })

   let parseMention = text => [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')

   client.groupAdmin = async (jid) => {
      let participant = await (await client.groupMetadata(jid)).participants
      let admin = []
      for (let i of participant)(i.admin === "admin" || i.admin === "superadmin") ? admin.push(i.id) : ''
      return admin
   }
   
   client.decodeJid = jid => {
      return jid.match(new RegExp(':', 'g')) ? jid.split(':')[0] + '@s.whatsapp.net' : jid
   }
   
   client.generateMessage = async (jid, message, quoted = {}, options = {}) => {
      let generate = await generateWAMessage(jid, message, quoted)
      const type = getContentType(generate.message)
      if ('contextInfo' in message) generate.message[type].contextInfo = {
         ...generate.message[type].contextInfo,
         ...message.contextInfo
      }
      if ('contextInfo' in options) generate.message[type].contextInfo = {
         ...generate.message[type].contextInfo,
         ...options.contextInfo
      }
      return await client.relayMessage(jid, generate.message, {
         messageId: generate.key.id
      }).then(() => generate)
   }
   
   client.sendMessageModify = async (jid, text, quoted, properties, options = {}) => {
      await client.sendPresenceUpdate('composing', jid)
      if (properties.thumbnail) {
      	var { file } = await Func.getFile(properties.thumbnail)
      }
      return client.generateMessage(jid, {
         text,
         ...options,
         contextInfo: {
            mentionedJid: parseMention(text),
            externalAdReply: {
               title: properties.title || 'RIKKA BOT OFFICIAL',
               body: properties.body || null,
               mediaType: 1,
               previewType: 0,
               showAdAttribution: properties.ads && properties.ads ? true : false,
               renderLargerThumbnail: properties.largeThumb && properties.largeThumb ? true : false,
               thumbnail: properties.thumbnail ? await Func.fetchBuffer(file) : await Func.fetchBuffer(global.db.setting.cover),
               thumbnailUrl: 'https://telegra.ph/?id=' + Func.makeId(8),
               sourceUrl: properties.url || ''
            }
         }
      }, {
         quoted
      })
   }

   client.sendButtonText = async (jid, text, footer, buttons = [], quoted) => {
      const buttonMessage = {
         text,
         footer: footer,
         buttons,
         headerType: 1,
         mentions: parseMention(text)
      }
      await client.sendPresenceUpdate('composing', jid)
      return client.sendMessage(jid, buttonMessage, {
         quoted
      })
   }
   
   client.deleteObj = async (m, client) => {
      if (m.msg && m.msg.type == 0) {
         var copy = await store.loadMessage(m.chat, m.key.id, client)
         for (let i=0; i<5; i++) {
        	 if (copy.mtype == 'protocolMessage') {
         		var copy = await store.loadMessage(m.chat, m.key.id, client)
                 await delay(1000)
         		if (copy.mtype != 'protocolMessage') break
         	}
         }
         return proto.WebMessageInfo.fromObject({
            key: copy.key,
            message: {
               [copy.mtype]: copy.msg
            }
         })
      } else {
         return null
      }
   }
   
   client.fakeGroupLink = async (jid, text, title, sender, quoted) => {
      try {
         pic = await client.profilePictureUrl(sender, 'image')
      } catch {
         pic = global.db.setting.cover
      }
      return client.sendMessage(jid, {
         text,
         mentions: parseMention(text),
         contextInfo: {
            mentions: parseMention(text),
            externalAdReply: {
               title: '爪乇ㄥ•乃ㄖㄒ',
               mediaType: 2,
               mediaUrl: `https://instagram.com`,
               body: '',
               description: 'melbot',
               showAdAttribution: true,
               thumbnail: fs.readFileSync('./media/images/mel.jpg'),
               sourceUrl: 'https://chat.whatsapp.com/L2hJAaHZYPHHkcjFsBr3vE'
            }
         }
      }, {
         quoted
      })
   }   
   
   client.fakeGroupLink2 = async (jid, text, title, sender, quoted) => {
      try {
         pic = await client.profilePictureUrl(sender, 'image')
      } catch {
         pic = global.db.setting.cover
      }
      return client.sendMessage(jid, {
         text,
         mentions: parseMention(text),
         contextInfo: {
            mentions: parseMention(text),
            externalAdReply: {
               title: '爪乇ㄥ•乃ㄖㄒ',
               mediaType: 2,
               mediaUrl: `https://jsonformatter.org`,
               body: '',
               description: 'melbot',
               showAdAttribution: true,
               thumbnail: fs.readFileSync('./media/images/mel.jpg'),
               sourceUrl: 'https://chat.whatsapp.com/DX4ufmjrzzG1H4qJNVyo26'
            }
         }
      }, {
         quoted
      })
   }
   
   client.fakeGroupLink3 = async (jid, text, title, sender, quoted) => {
      try {
         pic = await client.profilePictureUrl(sender, 'image')
      } catch {
         pic = global.db.setting.cover
      }
      return client.sendMessage(jid, {
         text,
         mentions: parseMention(text),
         contextInfo: {
            mentions: parseMention(text),
            externalAdReply: {
               title: 'こんにちは私たち',
               mediaType: 2,
               mediaUrl: `https://jsonformatter.org`,
               body: '',
               description: 'RIKKA BOT',
               showAdAttribution: false,
               thumbnail: pic,
               sourceUrl: 'https://wa.me/6285807264974?text=sewabot+bang'
            }
         }
      }, {
         quoted
      })
   }
   
   client.fakeWa = async (jid, text, title, sender, link, quoted, options) => {
      try {
         pic = await client.profilePictureUrl(sender, 'image')
      } catch {
         pic = global.db.setting.cover
      }
      await client.sendPresenceUpdate('composing', jid)
      return client.sendMessage(jid, {
         text,
         mentions: parseMention(text),
         ...options,
         contextInfo: {
            mentions: parseMention(text),
            externalAdReply: {
               title,
               mediaType: 2,
               showAdAttribution: true,
               thumbnail: await Func.fetchBuffer(pic),
               sourceUrl: 'https://wa.me/6285807264974?text=bang+upgrade+premium+biar+unlimited+limit'
            }
         }
      }, {
         quoted
      })
   }

   client.groupList = async () => Object.entries(await client.groupFetchAllParticipating()).slice(0).map(entry => entry[1])

   client.copyNForward = async (jid, message, forceForward = false, options = {}) => {
      let vtype
      if (options.readViewOnce) {
         message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
         vtype = Object.keys(message.message.viewOnceMessage.message)[0]
         delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
         delete message.message.viewOnceMessage.message[vtype].viewOnce
         message.message = {
            ...message.message.viewOnceMessage.message
         }
      }
      let mtype = Object.keys(message.message)[0]
      let content = await generateForwardMessageContent(message, forceForward)
      let ctype = Object.keys(content)[0]
      let context = {}
      if (mtype != "conversation") context = message.message[mtype].contextInfo
      content[ctype].contextInfo = {
         ...context,
         ...content[ctype].contextInfo
      }
      const waMessage = await generateWAMessageFromContent(jid, content, options ? {
         ...content[ctype],
         ...options,
         ...(options.contextInfo ? {
            contextInfo: {
               ...content[ctype].contextInfo,
               ...options.contextInfo
            }
         } : {})
      } : {})
      await client.relayMessage(jid, waMessage.message, {
         messageId: waMessage.key.id
      })
      return waMessage
   }

   client.copyMsg = (jid, message, text = '', sender = client.user.id, options = {}) => {
      let copy = message.toJSON()
      let type = Object.keys(copy.message)[0]
      let isEphemeral = type === 'ephemeralMessage'
      if (isEphemeral) {
         type = Object.keys(copy.message.ephemeralMessage.message)[0]
      }
      let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
      let content = msg[type]
      if (typeof content === 'string') msg[type] = text || content
      else if (content.caption) content.caption = text || content.caption
      else if (content.text) content.text = text || content.text
      if (typeof content !== 'string') msg[type] = {
         ...content,
         ...options
      }
      if (copy.participant) sender = copy.participant = sender || copy.participant
      else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
      if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
      else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
      copy.key.remoteJid = jid
      copy.key.fromMe = sender === client.user.id
      return WAMessageProto.WebMessageInfo.fromObject(copy)
   }

   client.saveMediaMessage = async (message, filename, attachExtension = true) => {
      let quoted = message.msg ? message.msg : message
      let mime = (message.msg || message).mimetype || ''
      let messageType = mime.split('/')[0].replace('application', 'document') ? mime.split('/')[0].replace('application', 'document') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(quoted, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
         buffer = Buffer.concat([buffer, chunk])
      }
      let type = await FileType.fromBuffer(buffer)
      trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
      await fs.writeFileSync(trueFileName, buffer)
      return trueFileName
   }

   client.downloadMediaMessage = async (message) => {
      let mimes = (message.msg || message).mimetype || ''
      let messageType = mimes.split('/')[0].replace('application', 'document') ? mimes.split('/')[0].replace('application', 'document') : mimes.split('/')[0]
      let extension = mimes.split('/')[1]
      const stream = await downloadContentFromMessage(message, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
         buffer = Buffer.concat([buffer, chunk])
      }
      return buffer
   }

   client.sendContact = async (jid, contact, quoted, opts) => {
      let list = []
      contact.map(v => list.push({
         displayName: v.name,
         vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${v.name}\nORG:Owner RIKKA BOT\nTEL;type=CELL;type=VOICE;waid=${v.number}:${PhoneNumber('+' + v.number).getNumber('international')}\nEMAIL;type=Email:Rikkaaa/my.id\nURL;type=Website:https://Rikaaa@chiki.id\nADR;type=Location:;;🇰🇷 Korea;;\nOther:${v.about}\nEND:VCARD`
      }))
      return client.sendMessage(jid, {
         contacts: {
            displayName: `${list.length} Contact`,
            contacts: list
         },
         ...opts
      }, {
         quoted
      })
   }

   client.sendSticker = async (jid, path, quoted, options = {}) => {
      let buffer = /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : Buffer.alloc(0)
      let {
         extension
      } = await Func.getFile(buffer)
      const media = tmpdir() + '/' + Func.filename(extension)
      const result = tmpdir() + '/' + Func.filename('webp')
      if (extension === 'webp') {
         await writeFile(result, buffer)
         await WSF.setMetadata(options.packname, options.author, result)
         await client.sendMessage(jid, {
            sticker: fs.readFileSync(result),
            ...options
         }, {
            quoted
         })
         try {
            fs.unlinkSync(result)
         } catch (e) {
            console.log(e)
         }
      } else {
         ffmpeg(`${media}`)
            .input(media)
            .on('error', function(err) {
               fs.unlinkSync(media)
            })
            .on('end', function() {
               buildSticker()
            })
            .addOutputOptions([
               `-vcodec`,
               `libwebp`,
               `-vf`,
               `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`
            ])
            .toFormat('webp')
            .save(result)
         await writeFile(media, buffer)
         const buildSticker = async () => {
            await WSF.setMetadata(options.packname, options.author, result)
            await client.sendMessage(jid, {
               sticker: fs.readFileSync(result),
               ...options
            }, {
               quoted
            })
            try {
               fs.unlinkSync(media)
               fs.unlinkSync(result)
            } catch (e) {
               console.log(e)
            }
         }
      }
   }

   client.reply = async (jid, text, quoted, options) => {
      await client.sendPresenceUpdate('composing', jid)
      return client.sendMessage(jid, {
         text: text,
         mentions: parseMention(text),
         ...options
      }, {
         quoted
      })
   }
      
   client.fakeStory = async (jid, text, caption) => {
      let location = {
         key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`,
            ...(jid ? {
               remoteJid: 'status@broadcast'
            } : {})
         },
         message: {
            "imageMessage": {
               "mimetype": "image/jpeg",
               "caption": caption,
               "jpegThumbnail": fs.readFileSync(`./media/images/thumb.jpg`)
            }
         }
      }
      return client.reply(jid, text, location)
   }
      
   client.sendImage = async (jid, source, text, quoted, options) => {
      let isFile = tmpdir() + '/' + Func.uuid() + '.png'
      if (Buffer.isBuffer(source)) {
         fs.writeFileSync(isFile, source)
         await client.sendPresenceUpdate('composing', jid)
         return client.sendMessage(jid, {
            image: {
               url: isFile
            },
            caption: text,
            mentions: parseMention(text),
            ...options
         }, {
            quoted
         }).then(() => fs.unlinkSync(isFile))
      } else {
         await Func.download(source, isFile, async () => {
            await client.sendPresenceUpdate('composing', jid)
            return client.sendMessage(jid, {
               image: {
                  url: isFile
               },
               caption: text,
               mentions: parseMention(text),
               ...options
            }, {
               quoted
            }).then(() => fs.unlinkSync(isFile))
         })
      }
   }

   client.sendReact = async (jid, emoticon, keys = {}) => {
      let reactionMessage = {
         react: {
            text: emoticon,
            key: keys
         }
      }
      return await client.sendMessage(jid, reactionMessage)
   }
   
   client.sendVideo = async (jid, source, text, quoted, gif = false, options) => {
      let isFile = tmpdir() + '/' + Func.uuid() + '.mp4'
      if (Buffer.isBuffer(source)) {
         fs.writeFileSync(isFile, source)
         await client.sendPresenceUpdate('composing', jid)
         return client.sendMessage(jid, {
            video: {
               url: isFile
            },
            caption: text,
            mentions: parseMention(text),
            gifPlayback: gif,
            ...options
         }, {
            quoted
         }).then(() => fs.unlinkSync(isFile))
      } else {
         await Func.download(source, isFile, async () => {
            await client.sendPresenceUpdate('composing', jid)
            return client.sendMessage(jid, {
               video: {
                  url: isFile
               },
               caption: text,
               mentions: parseMention(text),
               gifPlayback: gif,
               ...options
            }, {
               quoted
            }).then(() => fs.unlinkSync(isFile))
         })
      }
   }

   client.sendAudio = async (jid, source, ptt = false, quoted, options) => {
      let isFile = tmpdir() + '/' + Func.uuid() + '.mp3'
      if (Buffer.isBuffer(source)) {
         fs.writeFileSync(isFile, source)
         await client.sendPresenceUpdate(voice ? 'recording' : 'composing', jid)
         return client.sendMessage(jid, {
            audio: {
               url: isFile
            },
            ptt: ptt,
            mimetype: 'audio/mpeg',
            ...options
         }, {
            quoted
         }).then(() => fs.unlinkSync(isFile))
      } else {
         await Func.download(source, isFile, async () => {
            await client.sendPresenceUpdate(ptt ? 'recording' : 'composing', jid)
            return client.sendMessage(jid, {
               audio: {
                  url: isFile
               },
               ptt: ptt,
               mimetype: 'audio/mpeg',
               ...options
            }, {
               quoted
            }).then(() => fs.unlinkSync(isFile))
         })
      }
   }

   client.sendDocument = async (jid, source, name, quoted, options) => {
      let getExt = name.split('.')
      let ext = getExt[getExt.length - 1]
      let isFile = tmpdir() + '/' + name.replace(/(\/)/g, '-')
      if (Buffer.isBuffer(source)) {
         fs.writeFileSync(isFile, source)
         await client.sendPresenceUpdate('composing', jid)
         return client.sendMessage(jid, {
            document: {
               url: isFile
            },
            fileName: name,
            mimetype: typeof mime.lookup(ext) != 'undefined' ? mime.lookup(ext) : mime.lookup('txt')
         }, {
            quoted
         }).then(() => fs.unlinkSync(isFile))
      } else {
         await Func.download(source, isFile, async () => {
            await client.sendPresenceUpdate('composing', jid)
            return client.sendMessage(jid, {
               document: {
                  url: isFile
               },
               fileName: name,
               mimetype: typeof mime.lookup(ext) ? mime.lookup(ext) : mime.lookup('txt')
            }, {
               quoted
            }).then(() => fs.unlinkSync(isFile))
         })
      }
   }

   client.sendList = async (jid, title, text, footer, btnText, rows = [], quoted) => {
      let sections = [{
         rows
      }]
      let listMessage = {
         title: title,
         text: text,
         footer: footer,
         buttonText: btnText,
         sections
      }
      await client.sendPresenceUpdate('composing', jid)
      return client.sendMessage(jid, listMessage, {
         quoted
      })
   }

   client.sendFile = async (jid, url, name, caption = '', quoted, opts, options) => {
      let {
         status,
         file,
         filename,
         mime,
         size
      } = await Func.getFile(url, name, opts && opts.referer ? opts.referer : false)
      if (!status) return client.reply(jid, global.status.error, m)
      client.refreshMediaConn(false)
      if (opts && opts.document) {
         const message = await prepareWAMessageMedia({
            document: {
               url: file
            },
            fileName: filename,
            mimetype: mime,
            ...options
         }, {
            upload: client.waUploadToServer
         })
         let media = generateWAMessageFromContent(jid, {
            documentMessage: message.documentMessage
         }, {
            quoted
         })
         await client.sendPresenceUpdate('composing', jid)
         return await client.relayMessage(jid, media.message, {
            messageId: media.key.id
         }).then(() => fs.unlinkSync(file))
      } else {
         if (/image\/(jpe?g|png)/.test(mime)) {
            let thumb = await generateThumbnail(file, mime)
            const message = await prepareWAMessageMedia({
               image: {
                  url: file
               },
               caption: caption,
               jpegThumbnail: thumb,
               contextInfo: {
                  mentionedJid: [...caption.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net')
               },
               ...options
            }, {
               upload: client.waUploadToServer
            })
            let media = generateWAMessageFromContent(jid, {
               imageMessage: message.imageMessage
            }, {
               quoted
            })
            await client.sendPresenceUpdate('composing', jid)
            return await client.relayMessage(jid, media.message, {
               messageId: media.key.id
            }).then(() => fs.unlinkSync(file))
         } else if (/video/.test(mime)) {
            let thumb = await generateThumbnail(file, mime)
            const message = await prepareWAMessageMedia({
               video: {
                  url: file
               },
               caption: caption,
               jpegThumbnail: thumb,
               gifPlayback: opts && opts.gif ? true : false,
               contextInfo: {
                  mentionedJid: [...caption.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net')
               },
               ...options
            }, {
               upload: client.waUploadToServer
            })
            let media = generateWAMessageFromContent(jid, {
               videoMessage: message.videoMessage
            }, {
               quoted
            })
            await client.sendPresenceUpdate('composing', jid)
            return await client.relayMessage(jid, media.message, {
               messageId: media.key.id
            }).then(() => fs.unlinkSync(file))
         } else if (/audio/.test(mime)) {
            const message = await prepareWAMessageMedia({
               audio: {
                  url: file
               },
               ptt: opts && opts.ptt ? true : false,
               mimetype: mime,
               contextInfo: {
                  mentionedJid: [...caption.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net')
               },
               ...options
            }, {
               upload: client.waUploadToServer
            })
            let media = generateWAMessageFromContent(jid, {
               audioMessage: message.audioMessage
            }, {
               quoted
            })
            await client.sendPresenceUpdate(opts && opts.ptt ? 'recoding' : 'composing', jid)
            return await client.relayMessage(jid, media.message, {
               messageId: media.key.id
            }).then(() => fs.unlinkSync(file))
         } else {
            const message = await prepareWAMessageMedia({
               document: {
                  url: file
               },
               fileName: filename,
               mimetype: mime,
               ...options
            }, {
               upload: client.waUploadToServer
            })
            let media = generateWAMessageFromContent(jid, {
               documentMessage: message.documentMessage
            }, {
               quoted
            })
            await client.sendPresenceUpdate('composing', jid)
            return await client.relayMessage(jid, media.message, {
               messageId: media.key.id
            }).then(() => fs.unlinkSync(file))
         }
      }
   }

   client.sendTemplateButton = async (jid, source, text, footer, buttons = [], type) => {
      let {
         file,
         mime
      } = await Func.getFile(source)
      let options = (type && type.document) ? {
         document: {
            url: file
         },
         url: 'https://mmg.whatsapp.net/d/f/AnUWkHhZF2zsgflUUn4NBS72M9FdFgVijhLSWDtvfnJW.enc',
         mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
         fileSha256: 'dxsumNsT8faD6vN91lNkqSl60yZ5MBlH9L6mjD5iUkQ=',
         pageCount: 1212,
         fileEncSha256: 'QGPsr3DQgnOdGpfcxDLFkzV2kXAaQmgTV8mYDzwrev4=',
         jpegThumbnail: await Func.createThumb(source),
         fileName: (type && type.name) ? type.name : 'RIKKA BOT',
         fileLength: '2022000000000000',
         mediaKey: 'u4PCBMBCnVT0s1M8yl8/AZYmeK8oOBAh/fnnVPujcgw='
      } : (type && type.location) ? {
         location: {
            jpegThumbnail: await Func.createThumb(source)
         }
      } : /video/.test(mime) ? {
         video: {
            url: file
         },
         gifPlayback: type && type.gif ? true : false
      } : /image/.test(mime) ? {
         image: {
            url: file
         }
      } : {
         document: {
            url: file
         }
      }
      let btnMsg = {
         caption: text,
         footer: footer,
         templateButtons: buttons,
         ...options
      }
      await client.sendPresenceUpdate('composing', jid)
      return client.sendMessage(jid, btnMsg)
   }

   client.sendButton = async (jid, source, text, footer, quoted, buttons = [], type, opts) => {
      let {
         file,
         mime
      } = await Func.getFile(source)
      let options = (type && type.location) ? {
         location: {
            jpegThumbnail: await Func.fetchBuffer(source)
         },
         headerType: 6
      } : (type && type.document) ? {
         document: {
            url: file
         },
         headerType: 3,
         fileName: opts && opts.fileName ? opts.fileName : 'RIKKA BOT',
         mimetype: 'application/vnd.ms-excel',
         pageCount: 1212,
         fileLength: '2022000000000000',
         contextInfo: {
            externalAdReply: {
               mediaType: 1,
               title: opts && opts.title ? opts.title : '© RIKKA BOT',
               renderLargerThumbnail: true,
               thumbnail: opts && opts.thumbnail ? opts.thumbnail : await Func.fetchBuffer(global.db.setting.cover),
               thumbnailUrl: 'https://telegra.ph/?id=' + Func.makeId(8),
               sourceUrl: 'https://chat.whatsapp.com/L2hJAaHZYPHHkcjFsBr3vE'
            }
         }
      } : /video/.test(mime) ? {
         video: {
            url: file
         },
         headerType: 5
      } : /image/.test(mime) ? {
         image: {
            url: file
         },
         headerType: 4
      } : {
         document: {
            url: file
         },
         headerType: 3
      }
      let buttonMessage = {
         caption: text,
         footer: footer,
         buttons: buttons,
         ...opts,
         ...options,
         mentions: parseMention(text)
      }
      await client.sendPresenceUpdate('composing', jid)
      return client.sendMessage(jid, buttonMessage, {
         quoted
      })
   }
   
   client.sendButton2 = async (jid, source, text, footer, quoted, buttons = [], type, opts) => {
      let {
         file,
         mime
      } = await Func.getFile(source)
      let options = (type && type.location) ? {
         location: {
            jpegThumbnail: await Func.fetchBuffer(source)
         },
         headerType: 6
      } : (type && type.document) ? {
         document: {
            url: file
         },
         headerType: 4,
         fileName: Func.greeting(m.pushName),
         mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         pageCount: 1212,
         fileLength: '990000000000000',
         contextInfo: {
            externalAdReply: {
         mediaUrl: 'https://youtu.be/xfrIkvtcqME',
         mediaType: 2,
         renderLargerThumbnail: true,
         showAdAttribution: true,
         title: opts && opts.title ? opts.title : '© RIKKA BOT',
         thumbnail: opts && opts.thumbnail ? opts.thumbnail : await Func.fetchBuffer(global.db.setting.cover),
         thumbnailUrl: 'https://telegra.ph/?id=' + Func.makeId(8),
         sourceUrl: 'https://youtu.be/xfrIkvtcqME'
            }
         }
      } : /video/.test(mime) ? {
         video: {
            url: file
         },
         headerType: 5
      } : /image/.test(mime) ? {
         image: {
            url: file
         },
         headerType: 4
      } : {
         document: {
            url: file
         },
         headerType: 3
      }
      let buttonMessage = {
         caption: text,
         footer: footer,
         buttons: buttons,
         ...opts,
         ...options,
         mentions: parseMention(text)
      }
      await client.sendPresenceUpdate('composing', jid)
      return client.sendMessage(jid, buttonMessage, {
         quoted
      })
   }
   
   client.sendButton3 = async (jid, source, text, footer, quoted, buttons = [], type, opts) => {
      let {
         file,
         mime
      } = await Func.getFile(source)
      let options = (type && type.location) ? {
         location: {
            jpegThumbnail: await Func.fetchBuffer(source)
         },
         headerType: 6
      } : (type && type.document) ? {
         document: {
            url: file
         },
         headerType: 4,
         fileName: Func.greeting(m.pushName),
         mimetype: 'application/pdf',
         fileLength: '990000000000000',
         contextInfo: {
            externalAdReply: {
         mediaUrl: 'https://fb.watch.com',
         mediaType: 2,
         renderLargerThumbnail: false,
         showAdAttribution: false,
         title: opts && opts.title ? opts.title : '© RIKKA BOT',
         thumbnail: opts && opts.thumbnail ? opts.thumbnail : await Func.fetchBuffer(global.db.setting.cover),
         thumbnailUrl: 'https://telegra.ph/?id=' + Func.makeId(8),
         sourceUrl: 'https://chat.whatsapp.com/L2hJAaHZYPHHkcjFsBr3vE'
            }
         }
      } : /video/.test(mime) ? {
         video: {
            url: file
         },
         headerType: 5
      } : /image/.test(mime) ? {
         image: {
            url: file
         },
         headerType: 4
      } : {
         document: {
            url: file
         },
         headerType: 3
      }
      let buttonMessage = {
         caption: text,
         footer: footer,
         buttons: buttons,
         ...opts,
         ...options,
         mentions: parseMention(text)
      }
      await client.sendPresenceUpdate('composing', jid)
      return client.sendMessage(jid, buttonMessage, {
         quoted
      })
   }

   client.SerializeQuote = (m) => {
      return Serialize(client, m)
   }

   return client
}

Serialize = (client, m) => {
   if (!m) return m
   let M = proto.WebMessageInfo
   if (m.key) {
      m.id = m.key.id
      m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || m.id.startsWith('3EB0') && m.id.length === 20 || m.id.startsWith('B24E') && m.id.length === 20
      m.chat = m.key.remoteJid
      m.fromMe = m.key.fromMe
      m.isGroup = m.chat.endsWith('@g.us')
      m.sender = m.fromMe ? (client.user.id.split(":")[0] + '@s.whatsapp.net' || client.user.id) : (m.key.participant || m.key.remoteJid)
   }
   if (m.message) {
      if (m.message.viewOnceMessage) {
         m.mtype = Object.keys(m.message.viewOnceMessage.message)[0]
         m.msg = m.message.viewOnceMessage.message[m.mtype]
      } else {
         m.mtype = Object.keys(m.message)[0] == 'senderKeyDistributionMessage' ? Object.keys(m.message)[2] == 'messageContextInfo' ? Object.keys(m.message)[1] : Object.keys(m.message)[2] : Object.keys(m.message)[0] != 'messageContextInfo' ? Object.keys(m.message)[0] : Object.keys(m.message)[1]
         m.msg = m.message[m.mtype]
      }
      if (m.mtype === 'ephemeralMessage') {
         Serialize(client, m.msg)
         m.mtype = m.msg.mtype
         m.msg = m.msg.msg
      }
      let quoted = m.quoted = typeof m.msg != 'undefined' ? m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null : null
      m.mentionedJid = typeof m.msg != 'undefined' ? m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [] : []
      if (m.quoted) {
         let type = Object.keys(m.quoted)[0]
         m.quoted = m.quoted[type]
         if (['productMessage'].includes(type)) {
            type = Object.keys(m.quoted)[0]
            m.quoted = m.quoted[type]
         }
         if (typeof m.quoted === 'string') m.quoted = {
            text: m.quoted
         }
         m.quoted.id = m.msg.contextInfo.stanzaId
         m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
         m.quoted.isBot = m.quoted.id ? (m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 12 || m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 20 || m.quoted.id.startsWith('B24E') && m.quoted.id.length === 20) : false
         m.quoted.sender = m.msg.contextInfo.participant.split(":")[0] || m.msg.contextInfo.participant
         m.quoted.fromMe = m.quoted.sender === (client.user && client.user.id)
         m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
         let vM = m.quoted.fakeObj = M.fromObject({
            key: {
               remoteJid: m.quoted.chat,
               fromMe: m.quoted.fromMe,
               id: m.quoted.id
            },
            message: quoted,
            ...(m.isGroup ? {
               participant: m.quoted.sender
            } : {})
         })
         m.quoted.mtype = m.quoted != null ? Object.keys(m.quoted.fakeObj.message)[0] : null
         m.quoted.text = m.quoted.text || m.quoted.caption || (m.quoted.mtype == 'buttonsMessage' ? m.quoted.contentText : '') || (m.quoted.mtype == 'templateMessage' ? m.quoted.hydratedFourRowTemplate.hydratedContentText : '') || ''
         m.quoted.info = async () => {
            let q = await store.loadMessage(m.chat, m.quoted.id, client)
            return Serialize(client, q)
         }
         m.quoted.download = () => client.downloadMediaMessage(m.quoted)
      }
   }
   if (typeof m.msg != 'undefined') {
      if (m.msg.url) m.download = () => client.downloadMediaMessage(m.msg)
   }
   m.text = (m.mtype == 'stickerMessage' ? (typeof global.db.sticker[m.msg.fileSha256.toString().replace(/,/g, '')] != 'undefined') ? global.db.sticker[m.msg.fileSha256.toString().replace(/,/g, '')].text : '' : '') || (m.mtype == 'listResponseMessage' ? m.message.listResponseMessage.singleSelectReply.selectedRowId : '') || (m.mtype == 'buttonsResponseMessage' ? m.message.buttonsResponseMessage.selectedButtonId : '') || (m.mtype == 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage.selectedId : '') || (typeof m.msg != 'undefined' ? m.msg.text : '') || (typeof m.msg != 'undefined' ? m.msg.caption : '') || m.msg || ''
   return m
}

Scandir = async (dir) => {
   let subdirs = await readdir(dir)
   let files = await Promise.all(subdirs.map(async (subdir) => {
      let res = resolve(dir, subdir)
      return (await stat(res)).isDirectory() ? Scandir(res) : res
   }))
   return files.reduce((a, f) => a.concat(f), [])
}

exports.Socket = Socket
exports.Serialize = Serialize
exports.Scandir = Scandir
