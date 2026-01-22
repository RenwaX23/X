const express = require('express');
const app = express();
const port = 8085;

app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('space.jpeg')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            res.removeHeader('Pragma');
            res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
        }
    }
}));

app.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    res.send(`
<!DOCTYPE html>
<html>
        <body>
        <img src="/space.jpeg" width="100%" height="100%">
<div id="space"></div>
<div id="pwn"></div>

<script>
    const handleMessage = (event) => {
        if (typeof event.data === 'string' && event.data.length === 8) {
            const spaceDiv = document.getElementById('space');
            if (spaceDiv) {
                const shadowRoot = spaceDiv.attachShadow({ mode: 'closed' });
                shadowRoot.innerHTML = \`<p>\${event.data}</p>\`;
            }
            window.removeEventListener('message', handleMessage);
        }
    };
    window.addEventListener('message', handleMessage);
    document.body.innerHTML += [...Array(20)].map(() => [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')).join(' ');

    var input = (new URL(location).searchParams.get('debug') || '').replace(/[\!\-\/\#\&\;\%]/g, '_');
    var template = document.createElement('template');
    template.innerHTML = input;
    pwn.innerHTML = "<!-- <p> <textarea>: " + template.innerHTML + " </p> -->";
</script>

`);

});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
