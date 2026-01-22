const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8086;

app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'");
    next();
});

app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('time.jpeg')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            res.removeHeader('Pragma');
            res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
        }
    }
}));

app.get('/', (req, res) => {

    if (req.query.time_stone) {
        res.cookie('time_stone', req.query.time_stone, { sameSite: 'None', secure: true, httpOnly: true });
    }
    res.send(`

<!DOCTYPE html>
<html>
        <body>
        <img src="/time.jpeg" width="100%" height="100%">
        <pre>Time Stone</pre>
        </body>
</html>
`);

});

app.get('/search', (req, res) => {
    const q = req.query.q;
    const timeStoneCookie = req.cookies && req.cookies.time_stone;

    if (typeof q === 'string' && q.length <= 8 && timeStoneCookie && timeStoneCookie.startsWith(q)) {
        res.redirect('/time/stone/search/yes');
    } else {
        res.redirect('/time/stone/search/nope');
    }
});

app.get('/time/stone/search/yes', (req, res) => {
    res.send(`
yes
`);
});

app.get('/time/stone/search/nope', (req, res) => {
    res.send(`
nope
`);
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
