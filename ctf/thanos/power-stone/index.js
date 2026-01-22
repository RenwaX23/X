const express = require('express');
const app = express();
const port = 8082;

app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('power.jpeg')) {
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

    let power_stone_data = '';
    if (typeof req.query.power_stone === 'string' && req.query.power_stone.length <= 8) {
        power_stone_data = encodeURIComponent(req.query.power_stone);
    }

    res.send(`
<!DOCTYPE html>
<html>
        <body>
        <img src="/power.jpeg" width="100%" height="100%">
        <pre>Power Stone</pre>
${power_stone_data}
    <script>
    history.pushState(1,1,1);
    let safe =/<|>|\\s/g;
    window.addEventListener('message', (event) => {
    if(!(safe.exec(event.data))){
    document.body.innerHTML=event.data;
    }
    else{
        document.body.innerHTML='not safe';
    }
    });
</script>
`);

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
