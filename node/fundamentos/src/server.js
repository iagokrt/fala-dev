// const http = require('http'); // console.log(http)
import http from 'node:http'; // console.log(http)

const server = http.createServer((req, res) => {
  console.log('Hello World')
  return res.end("Server is running!")
});

server.listen(3000);

