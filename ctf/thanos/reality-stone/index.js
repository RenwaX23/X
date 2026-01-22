const express = require('express')
const { JSDOM } = require('jsdom')
const createDOMPurify = require('dompurify')
const app = express()
const port = 8083

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('reality.jpeg')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            res.removeHeader('Pragma');
            res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
        }
    }
}));

app.get('/', (req, res) => {

    const user = req.query.user || 'guest';
    const action = req.query.action ? /^[a-zA-Z\\.]+$/.test(req.query.action) ? req.query.action : 'console.log' : 'console.log'

    const clean = DOMPurify.sanitize(user, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span', 'div', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: []
    }, {
        FORBID_ATTR: ['id', 'style', 'href', 'class', 'data-*', 'srcdoc', 'form', 'formaction', 'formmethod', 'referrerpolicy', 'target', 'rel', 'manifest', 'poster', 'ping', 'download']
    }, {
    });

    res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self'; script-src 'self' 'unsafe-inline' https://code.jquery.com https://cdnjs.cloudflare.com/;");
    res.setHeader('Referer-Policy', 'no-referrer');
    res.set({
        'Content-Type': 'text/html; charset=utf-8'
    })
    let reality_stone_data = '';
    if (typeof req.query.reality_stone === 'string' && req.query.reality_stone.length <= 8) {
        reality_stone_data = encodeURIComponent(req.query.reality_stone);
    }

    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reality Stone</title>
    </head>
    <body>
    <img src="/reality.jpeg" width="100%" height="100%">
    <script>
    history.replaceState(null, null, '/');
    </script>
    <textarea>${reality_stone_data}</textarea>
      <h1>Welcome ${clean}</h1>
      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-ujs/1.2.3/rails.min.js"></script>
      <script src="/callback?jsonp=${action}"></script>
    </body>
    </html>
`)

})

app.get('/callback', (req, res) => {

    res.set({
        'Content-Type': 'application/javascript; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
    })

    const jsonp = req.query.jsonp || 'console.log';

    res.send(`${jsonp}("website is ready")`)

})

app.listen(port, () => {
    console.log(`app listening at port ${port}`)
})