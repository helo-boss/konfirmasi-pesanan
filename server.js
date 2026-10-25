const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const port = Number(process.env.PORT || 3000)
const root = __dirname

const server = http.createServer((request, response) => {
  const requestedPath = decodeURIComponent((request.url || '/').split('?')[0])
  const filePath = requestedPath === '/' ? path.join(root, 'index.html') : path.join(root, requestedPath)

  if (!filePath.startsWith(root)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end(error.code === 'ENOENT' ? 'Not found' : 'Internal server error')
      return
    }

    const extension = path.extname(filePath)
    const contentType = extension === '.html' ? 'text/html; charset=utf-8' : 'application/octet-stream'
    response.writeHead(200, { 'Content-Type': contentType })
    response.end(content)
  })
})

server.listen(port, '0.0.0.0', () => {
  console.log(`[v0] Static preview server listening on ${port}`)
})
