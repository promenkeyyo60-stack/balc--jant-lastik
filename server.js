const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Parse the URL to get the pathname without query strings
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
  pathname = decodeURIComponent(pathname);
  
  const extname = String(path.extname(pathname)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  const absolutePath = path.join(__dirname, pathname);
  
  fs.readFile(absolutePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
