import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(cookie)

app.addHook('preHandler', async (request, reply) => {
  console.log(`[${request.method}] ${request.url}`);
})

app.register(transactionsRoutes, {
  prefix: '/transactions'
})

app.get('/test', () => {
  return 'Hello, Test route!'
})

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('HTTP Server is up'))
