const express = require('express');
const app = express();
const port = 8081;

app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('mind.jpeg')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            res.removeHeader('Pragma');
            res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
        }
    }
}));

app.get('/', (req, res) => {
    const nonce = Math.random().toString(36).substring(2, 14);
    res.setHeader('Content-Security-Policy', `default-src 'none'; img-src 'self'; base-uri 'none'; script-src 'nonce-${nonce}'`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    let query = req.query.query || 'Hello World!';
    if (typeof query !== 'string' || query.length > 60) {
        return res.send('');
    }
    query = query.replace(/=/g, "");
    query = query.replace(/"/g, "");
    query = query.replace(/<script/gi, "<nope>");

    let mind_stone_data = '';
    if (typeof req.query.mind_stone === 'string' && req.query.mind_stone.length <= 8) {
        mind_stone_data = `const mindStone = "${encodeURIComponent(req.query.mind_stone)}";\n`;
    }
    const output = `
    <!DOCTYPE html>
    <html>
    <img src="/mind.jpeg" width="100%" height="100%">
    ${query}\n<!-- comment -->\n<script nonce="${nonce}">${mind_stone_data}\nconsole.log("${query}");\n</script>`;
    res.send(output);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
