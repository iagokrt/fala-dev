import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/hello', async () => {
  const db = await knex('sqlite_schema').select('*')
  return db
})

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('HTTP Server is up'))
