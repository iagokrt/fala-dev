// const http = require('http'); // console.log(http)
import http from 'node:http'

const users = []
// const orders = []

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method=="GET" && url =="/users") {
    return res
    .setHeader('Content-type', 'application/json')
    .end(JSON.stringify(users))
  }

  if (method=="POST" && url =="/users") {

    users.push({
      id: 1,
      name: 'tete',
      email: 'tete@mail.com'
    })

    return res
    .writeHead(201)
    .end()

  }

  return res
  .writeHead(404)
  .end("Server is running! Main")
});

server.listen(3000)
