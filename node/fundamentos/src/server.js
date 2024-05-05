// const http = require('http'); // console.log(http)
import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { log } from 'node:console';

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const params = req.url.match(route.path)

    console.log(params);

    req.params = { ...params.groups }

    // console.log(id);
    return route.handler(req, res)
  }

  return res.writeHead(404).end()
});

server.listen(3000)
