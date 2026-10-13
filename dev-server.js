/**
 * Local Development Server for Crimson Charm Inventory App
 * Mimics Vercel environment locally with zero npm dependencies.
 * Run with: npm start (or node dev-server.js)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Auto-load .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const proxyHandler = require('./api/proxy');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Normalize URL path
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Handle API proxy route
  if (pathname === '/api/proxy' || pathname.startsWith('/api/')) {
    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk;
    });

    req.on('end', () => {
      let parsedBody = {};
      if (bodyData) {
        try {
          parsedBody = JSON.parse(bodyData);
        } catch (e) {
          parsedBody = bodyData;
        }
      }
      req.body = parsedBody;

      // Polyfill res helpers for Vercel handler
      res.status = function (statusCode) {
        res.statusCode = statusCode;
        return res;
      };
      res.json = function (obj) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(obj));
        return res;
      };

      proxyHandler(req, res).catch(err => {
        console.error('Server error in proxyHandler:', err);
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: err.message || String(err) }));
        }
      });
    });
    return;
  }

  // Handle static file serving (Index.html)
  let filePath = path.join(__dirname, pathname === '/' ? 'Index.html' : pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(__dirname, 'Index.html');
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error: ' + readErr.message);
        return;
      }

      let contentType = 'text/html';
      if (filePath.endsWith('.js')) contentType = 'application/javascript';
      if (filePath.endsWith('.json')) contentType = 'application/json';
      if (filePath.endsWith('.css')) contentType = 'text/css';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Crimson Charm Inventory App running locally at http://localhost:${PORT}`);
  console.log(`Backend mode: Dual-mode Vercel Proxy -> Google Apps Script`);
  if (process.env.APPS_SCRIPT_URL) {
    console.log(`Connected to Google Apps Script Web App: ${process.env.APPS_SCRIPT_URL}`);
  } else {
    console.log(`Note: APPS_SCRIPT_URL not set in env. You can enter it in the app's "More > Settings" tab.`);
  }
});
