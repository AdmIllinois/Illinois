const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 1943;
const DB_FILE = path.join(__dirname, 'db.json');

const MIME_TYPES = {
    '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpg',
    '.gif': 'image/gif', '.svg': 'image/svg+xml', '.csv': 'text/csv',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        return { users: [{ username: 'admin', password: 'admin', role: 'admin', permissions: ['gestao', 'catalogo', 'despesas'] }], reports: [] };
    }
    return JSON.parse(fs.readFileSync(DB_FILE));
};

const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

const server = http.createServer((req, res) => {
    // Handling encoded URLs (like spaces)
    const urlPathRaw = req.url.split('?')[0];
    const urlPath = decodeURIComponent(urlPathRaw);
    console.log(`${req.method} ${urlPath}`);

    // API Routes
    if (urlPath === '/api/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(body);
                const db = readDB();
                const user = db.users.find(u => u.username === username && u.password === password);
                if (user) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, user: { username: user.username, role: user.role, permissions: user.permissions } }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
                }
            } catch (e) {
                res.writeHead(400); res.end();
            }
        });
        return;
    }

    if (urlPath === '/api/users' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ users: readDB().users }));
        return;
    }

    if (urlPath === '/api/users/save' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const { users } = JSON.parse(body);
            const db = readDB();
            db.users = users;
            writeDB(db);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        });
        return;
    }

    if (urlPath === '/api/data' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(readDB()));
        return;
    }

    if (urlPath === '/api/save' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const { reports } = JSON.parse(body);
            const db = readDB();
            if (reports) db.reports = reports;
            writeDB(db);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        });
        return;
    }

    // Static Files Logic
    let filePath = '';
    if (urlPath === '/' || urlPath === '/portal' || urlPath === '/portal/') {
        filePath = path.join(__dirname, 'portal', 'index.html');
    } else if (urlPath.startsWith('/portal/')) {
        filePath = path.join(__dirname, urlPath);
    } else if (urlPath.startsWith('/modules/')) {
        filePath = path.join(__dirname, urlPath);
    } else if (urlPath.startsWith('/css/') || urlPath.startsWith('/js/')) {
        filePath = path.join(__dirname, 'portal', urlPath);
    } else {
        filePath = path.join(__dirname, 'portal', urlPath);
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            // Try root
            fs.readFile(path.join(__dirname, urlPath), (err2, cont2) => {
                if (err2) {
                    res.writeHead(404);
                    res.end('404');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(cont2);
                }
            });
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`SERVER RUNNING AT: http://localhost:${PORT}`);
    console.log(`========================================`);
});
