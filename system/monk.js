const mongoose = require('mongoose')

module.exports = class MongoDB {
   constructor(uri, options = {
      useNewUrlParser: true,
      useUnifiedTopology: true
   }) {
      this.uri = uri
      this.state = this.model = {}
      this.data = {}
      this.options = options
   }

   reads = async () => {
      mongoose.connect(this.uri, {
         ...this.options
      })
      try {
         const schema = new mongoose.Schema({
            data: {
               type: Object,
               required: true,
               default: {}
            }
         })
         this.model = mongoose.model('data', schema)
      } catch {
         this.model = mongoose.model('data')
      }
      this.state = await this.model.findOne({})
      if (!this.state) {
         (new this.model({
            data: {}
         })).save()
         const db = await this.model.findOne({})
         return this.state = db
      } else return this.state
   }

   writes = async (data) => {
      const obj = data ? data : global.db
      if (this.state && !this.state.data) return (new this.model({
         data: obj
      })).save()
      this.model.findById(this.state._id, (err, docs) => {
         if (err) return
         if (!docs.data) docs.data = {}
         docs.data = global.db
         docs.save()
      })
   }

   collects = async () => {
      this.data = await (await this.reads())
      if (this.data) return this.data.data
      return this.data = {}
   }
}