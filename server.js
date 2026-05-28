import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const IMPORT_DIR = path.join(__dirname, 'stitch-import');

function injectScript(html) {
  // Inject cart-manager.js script before closing body tag
  if (html.includes('</body>')) {
    return html.replace('</body>', '<script src="/cart-manager.js"></script></body>');
  }
  return html + '<script src="/cart-manager.js"></script>';
}

const server = http.createServer((req, res) => {
  const url = req.url;
  
  if (url === '/' || url === '/index.html') {
    const filePath = path.join(IMPORT_DIR, 'screens', '4a50f1bffae0403faaa3b70de276e9e4.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Erro ao carregar a página inicial');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(injectScript(data));
      }
    });
  } else if (url === '/sabores') {
    const filePath = path.join(IMPORT_DIR, 'screens', 'bda999aba82b4e0aa4cac87af2ed836c.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Erro ao carregar a página de sabores');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(injectScript(data));
      }
    });
  } else if (url === '/sacola') {
    const filePath = path.join(IMPORT_DIR, 'screens', '9ca2e2c3276a40febb8e259e8efcf1b0.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Erro ao carregar a sacola');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(injectScript(data));
      }
    });
  } else if (url === '/checkout') {
    const filePath = path.join(IMPORT_DIR, 'screens', '038b9a6d6dc345b29ebf496ae25ef682.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Erro ao carregar o checkout');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(injectScript(data));
      }
    });
  } else if (url === '/cart-manager.js') {
    const filePath = path.join(__dirname, 'cart-manager.js');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
        res.end(data);
      }
    });
  } else {
    // Serve static files (screenshots, etc.)
    const safeUrl = url.replace(/\.\./g, ''); // prevent directory traversal
    const filePath = path.join(IMPORT_DIR, safeUrl);
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'application/octet-stream';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        if (ext === '.html') contentType = 'text/html; charset=utf-8';
        if (ext === '.css') contentType = 'text/css';
        if (ext === '.js') contentType = 'application/javascript';
        
        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`  GORÓ DA MANSÃO - E-COMMERCE DEV SERVER RUNNING  `);
  console.log(`==================================================`);
  console.log(`  Access URL: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
