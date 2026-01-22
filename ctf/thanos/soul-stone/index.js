const express = require('express');
const app = express();
const port = 8084;

app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('soul.jpeg')) {
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
    res.setHeader('Referer-Policy', 'origin');

    if (req.headers['sec-fetch-dest'] !== 'iframe') {
        res.setHeader('Content-Security-Policy', "sandbox allow-scripts allow-same-origin");
    }
    if (req.headers.referer !== 'https://soul.challenge-1225.intigriti.io/' && req.headers.referer !== 'https://challenge-1225.intigriti.io/') {
        res.send('');
        return;
    }

    let soul_stone_data = '';
    if (typeof req.query.soul_stone === 'string' && req.query.soul_stone.length <= 8) {
        soul_stone_data = `const soulStone = "${encodeURIComponent(req.query.soul_stone)}";`;
    }

    res.send(`
<!DOCTYPE html>
<html>
        <body>
        <img src="/soul.jpeg" width="100%" height="100%">
        <pre>Soul Stone</pre>
<script>

    opener=null;
    ${soul_stone_data}
    const urlParams = new URLSearchParams(window.location.search);
    let url = urlParams.get('url');
    document.referrer='';
    history.replaceState(null, null, '/');
    var win='';

    if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
        url=url.replaceAll('&','').replaceAll('%26', '%23');
        win = window.open(url, url.slice(0,4));

        setTimeout(() => {
            if (win.document.domain==='google.com') {
                console.log('safe: google.com');
                win.postMessage('Soul: '+soulStone, '*');
            }
        }, 1000);
    };

    const evalParam = urlParams.get('eval');
    if (evalParam && self==top && this==parent) {
        eval(evalParam);
    }

</script>


`);

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
