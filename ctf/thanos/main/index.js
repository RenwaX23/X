const express = require('express');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(cookieParser());

const generateCode = () => {
  return crypto.randomBytes(24).toString('hex');
};

const generateNonce = () => {
  return crypto.randomBytes(6).toString('hex');
};

app.use((req, res, next) => {

  let code = generateCode();
  let nonce = generateNonce();

  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'none'; style-src 'nonce-${nonce}'; frame-src https://*.challenge-1225.intigriti.io/; base-uri 'none'; object-src 'none'; script-src 'nonce-${nonce}' 'unsafe-eval'; img-src 'self'; font-src https://fonts.googleapis.com https://fonts.gstatic.com;`
  );

  res.locals.code = code;
  res.locals.nonce = nonce;
  next();
});

app.get('/', (req, res) => {
  res.render('index', { code: res.locals.code, nonce: res.locals.nonce });
});

app.get('/challenge', (req, res) => {
  res.render('challenge', { code: res.locals.code, nonce: res.locals.nonce });
});

app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('main.jpeg') || path.endsWith('bye.jpeg')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.removeHeader('Pragma');
      res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
    }
  }
}));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
