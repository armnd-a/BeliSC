const { Pool } = require('pg')

module.exports = class Postgres {
   sql = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
         rejectUnauthorized: false
      }
   })

   execute = async (query) => {
      if (query) {
         return await (await this.sql.query(query))
      } else {
         await this.sql.query('CREATE TABLE IF NOT EXISTS database(id integer, data json)')
         return 2
      }
   }

   fetch = async (id = 1) => {
      try {
         return await (await this.sql.query('SELECT data FROM database WHERE id = $1', [id])).rows[0]
      } catch {
         await this.execute()
      }
   }

   fetchAll = async () => {
      try {
         return await (await this.sql.query('SELECT data FROM database')).rows
      } catch {
         await this.execute()
      }
   }

   insert = async (object = {}, id = 1) => {
      try {
         await this.sql.query('INSERT INTO database VALUES($1, $2)', [id, object])
         await this.sql.query('commit')
      } catch {
         await this.execute()
      }
   }

   update = async (object = {}, id = 1) => {
      try {
         await this.sql.query('UPDATE database SET data = $1 WHERE id = $2', [object, id])
         await this.sql.query('commit')
      } catch {
         await this.execute()
      }
   }

   save = async (object, id = 1) => {
      try {
         const check = await (await this.sql.query('SELECT data FROM database WHERE id = $1', [id])).rows
         if (check.length == 0) {
            await this.insert(object ? object : global.db, id)
         } else {
            await this.update(object ? object : global.db, id)
         }
      } catch {
         await this.execute()
      }
   }
}